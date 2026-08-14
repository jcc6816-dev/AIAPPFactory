-- Test answers are real, but a network retry must never turn into another row.
alter table form_submissions
  add column if not exists request_id text;

create unique index if not exists idx_form_submissions_test_request_id
  on form_submissions (form_uuid, request_id)
  where is_test = true and request_id is not null;
