import {
  createGrowthEventSafely,
  listGrowthEventsByFormUuid,
} from "@/models/growth-event";
import type { FormSubmissionRecord } from "@/types/form";
import type { GrowthEventRecord } from "@/types/growth-event";

const ACTIVATION_WINDOW_MS = 24 * 60 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10;
const rateLimitBuckets = new Map<string, number[]>();

function eventTime(event: GrowthEventRecord) {
  const value = Date.parse(event.created_at || "");
  return Number.isFinite(value) ? value : undefined;
}

function matchesSubmission(
  event: GrowthEventRecord,
  submissionUuid: string
) {
  return event.metadata_json?.submission_uuid === submissionUuid;
}

export function isFirstSuccessLoopEnabled() {
  return process.env.FIRST_SUCCESS_LOOP_ENABLED !== "false";
}

export function checkFirstSuccessRateLimit(
  userUuid: string,
  formUuid: string,
  now = Date.now()
) {
  const key = `${userUuid}:${formUuid}`;
  const recent = (rateLimitBuckets.get(key) || []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );
  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitBuckets.set(key, recent);
    return false;
  }
  recent.push(now);
  rateLimitBuckets.set(key, recent);
  return true;
}

export function resetFirstSuccessRateLimitsForTests() {
  rateLimitBuckets.clear();
}

export function hasFirstSuccessActivationSequence(
  events: GrowthEventRecord[],
  userUuid: string,
  submission: FormSubmissionRecord
) {
  const ordered = [...events]
    .map((event) => ({ event, timestamp: eventTime(event) }))
    .filter(
      (item): item is { event: GrowthEventRecord; timestamp: number } =>
        item.timestamp !== undefined
    )
    .sort((left, right) => left.timestamp - right.timestamp);

  const created = ordered.find(
    ({ event }) =>
      event.event_name === "form_created" && event.user_uuid === userUuid
  );
  if (!created) return false;

  const published = ordered.find(
    ({ event, timestamp }) =>
      timestamp >= created.timestamp &&
      event.event_name === "form_published" &&
      event.user_uuid === userUuid
  );
  if (!published) return false;

  const completionEvent = submission.is_test
    ? "test_submission_completed"
    : "public_form_submitted";
  const completed = ordered.find(
    ({ event, timestamp }) =>
      timestamp >= published.timestamp &&
      event.event_name === completionEvent &&
      matchesSubmission(event, submission.uuid) &&
      (submission.is_test ? event.user_uuid === userUuid : true)
  );
  if (!completed) return false;

  const viewed = ordered.find(
    ({ event, timestamp }) =>
      timestamp >= completed.timestamp &&
      event.event_name === "first_result_viewed" &&
      event.user_uuid === userUuid &&
      matchesSubmission(event, submission.uuid)
  );
  if (!viewed) return false;

  return viewed.timestamp - created.timestamp <= ACTIVATION_WINDOW_MS;
}

export async function recordTrustedFirstResultView(input: {
  userUuid: string;
  formUuid: string;
  shareCode: string;
  submission: FormSubmissionRecord;
}) {
  const existingEvents = await listGrowthEventsByFormUuid(input.formUuid);
  const existingView = existingEvents.find(
    (event) =>
      event.event_name === "first_result_viewed" &&
      event.user_uuid === input.userUuid &&
      matchesSubmission(event, input.submission.uuid)
  );

  if (!existingView) {
    await createGrowthEventSafely({
      event_name: "first_result_viewed",
      visitor_id: "",
      user_uuid: input.userUuid,
      path: `/api/forms/${input.formUuid}/result-view`,
      form_uuid: input.formUuid,
      share_code: input.shareCode,
      source: "first_success_loop",
      metadata_json: {
        submission_uuid: input.submission.uuid,
        is_test: Boolean(input.submission.is_test),
      },
    });
  }

  const eventsAfterView = existingView
    ? existingEvents
    : await listGrowthEventsByFormUuid(input.formUuid);
  const alreadyActivated = eventsAfterView.some(
    (event) =>
      event.event_name === "activation_completed" &&
      event.user_uuid === input.userUuid
  );
  const activationCompleted = hasFirstSuccessActivationSequence(
    eventsAfterView,
    input.userUuid,
    input.submission
  );

  if (activationCompleted && !alreadyActivated) {
    await createGrowthEventSafely({
      event_name: "activation_completed",
      visitor_id: "",
      user_uuid: input.userUuid,
      path: `/api/forms/${input.formUuid}/result-view`,
      form_uuid: input.formUuid,
      share_code: input.shareCode,
      source: "first_success_loop",
      metadata_json: {
        submission_uuid: input.submission.uuid,
        completion_type: input.submission.is_test
          ? "test_submission"
          : "public_submission",
      },
    });
  }

  return {
    firstResultRecorded: !existingView,
    activationCompleted,
    activationRecorded: activationCompleted && !alreadyActivated,
  };
}
