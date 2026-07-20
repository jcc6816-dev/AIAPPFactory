const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const repoRoot = path.resolve(__dirname, "..", "..");
const codeRoot = path.resolve(__dirname, "..");
const DEFAULT_OUTPUT = path.join(
  repoRoot,
  "ProjectDocs",
  "Operations",
  "gsc_click_product_tracker.md"
);

function loadEnv() {
  const envPath = path.join(codeRoot, ".env.local");
  if (!fs.existsSync(envPath)) return;

  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index < 0) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function formatNumber(value, digits = 0) {
  const numeric = Number(value || 0);
  return numeric.toLocaleString("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function formatPercent(value) {
  const numeric = Number(value || 0);
  return `${numeric.toFixed(2)}%`;
}

function getRowKey(row) {
  if (!row) return "Unknown";
  if (typeof row.key === "string") return row.key;
  if (Array.isArray(row.keys) && row.keys.length > 0) return String(row.keys[0]);
  return "Unknown";
}

function normalizePagePath(value) {
  if (!value) return "";
  try {
    const parsed = new URL(value);
    return parsed.pathname + parsed.search;
  } catch {
    return String(value);
  }
}

function rowMetrics(row) {
  const clicks = Number(row?.clicks || 0);
  const impressions = Number(row?.impressions || 0);
  return {
    clicks,
    impressions,
    ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
    position: Number(row?.position || 0),
  };
}

function sortByClicksThenImpressions(a, b) {
  const ac = Number(a.clicks || 0);
  const bc = Number(b.clicks || 0);
  if (bc !== ac) return bc - ac;
  return Number(b.impressions || 0) - Number(a.impressions || 0);
}

function safeCell(value) {
  return String(value ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, " ")
    .trim();
}

function markdownTable(headers, rows) {
  const header = `| ${headers.map(safeCell).join(" |")} |`;
  const separator = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map(
    (row) => `| ${row.map((cell) => safeCell(cell)).join(" | ")} |`
  );
  return [header, separator, ...body].join("\n");
}

function summarizeProductEvents(events, fromDate, toDate) {
  const byName = new Map();
  const formsNewSessions = new Set();
  const productEvents = events.filter((event) => {
    const created = event.created_at || "";
    return created.slice(0, 10) >= fromDate && created.slice(0, 10) <= toDate;
  });

  for (const event of productEvents) {
    byName.set(event.event_name, (byName.get(event.event_name) || 0) + 1);
    const pathValue = event.path || "";
    if (pathValue.includes("/forms/new")) {
      formsNewSessions.add(`${event.visitor_id || ""}::${event.session_id || ""}`);
    }
  }

  return {
    formsNewSessions: formsNewSessions.size,
    formsNewView: byName.get("forms_new_view") || 0,
    ctaViewed: byName.get("forms_new_primary_action_viewed") || 0,
    ctaClicked: byName.get("forms_new_primary_action_clicked") || 0,
    loginStarted: byName.get("guest_login_intent_started") || 0,
    loginReturned: byName.get("guest_login_intent_returned") || 0,
    formCreated: byName.get("form_created") || 0,
  };
}

function buildQueryRows(snapshot, limit) {
  const queries = Array.isArray(snapshot?.details_json?.queries)
    ? snapshot.details_json.queries
    : [];
  return queries
    .map((row) => ({ key: getRowKey(row), ...rowMetrics(row) }))
    .sort(sortByClicksThenImpressions)
    .slice(0, limit);
}

function buildPageRows(snapshot, limit) {
  const pages = Array.isArray(snapshot?.details_json?.pages)
    ? snapshot.details_json.pages
    : [];
  return pages
    .map((row) => ({
      key: normalizePagePath(getRowKey(row)),
      ...rowMetrics(row),
    }))
    .sort(sortByClicksThenImpressions)
    .slice(0, limit);
}

function findLatest(snapshots, range) {
  return snapshots
    .filter((snapshot) => snapshot.range === range)
    .sort((a, b) => {
      const byDate = String(b.snapshot_date).localeCompare(String(a.snapshot_date));
      if (byDate !== 0) return byDate;
      return String(b.fetched_at || "").localeCompare(String(a.fetched_at || ""));
    })[0];
}

async function main() {
  loadEnv();

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("SUPABASE_URL and Supabase key are required.");
  }

  const outputPath =
    process.argv.includes("--output")
      ? process.argv[process.argv.indexOf("--output") + 1]
      : DEFAULT_OUTPUT;
  const limit = Math.max(
    1,
    Math.min(20, Number(process.argv[process.argv.indexOf("--limit") + 1] || 10))
  );

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: snapshots, error: snapshotError } = await supabase
    .from("growth_metric_snapshots")
    .select(
      "id, snapshot_date, source, range, segment, status, metrics_json, details_json, fetched_at"
    )
    .eq("source", "gsc")
    .eq("status", "success")
    .order("snapshot_date", { ascending: false })
    .limit(20);

  if (snapshotError) throw snapshotError;
  if (!snapshots || snapshots.length === 0) {
    throw new Error("No successful GSC snapshots found.");
  }

  const latest1d = findLatest(snapshots, "1d");
  const latest7d = findLatest(snapshots, "7d");
  const latest28d = findLatest(snapshots, "28d");
  const anchor = latest1d || latest7d || latest28d;
  const toDate = String(anchor.snapshot_date);
  const from7Date = isoDate(new Date(Date.parse(`${toDate}T00:00:00Z`) - 6 * 864e5));

  const { data: events, error: eventError } = await supabase
    .from("growth_events")
    .select(
      "event_name, visitor_id, session_id, path, source, template_id, metadata_json, created_at"
    )
    .gte("created_at", `${from7Date}T00:00:00.000Z`)
    .lte("created_at", `${toDate}T23:59:59.999Z`)
    .order("created_at", { ascending: false })
    .limit(3000);

  if (eventError) throw eventError;

  const oneDayEvents = summarizeProductEvents(events || [], toDate, toDate);
  const sevenDayEvents = summarizeProductEvents(events || [], from7Date, toDate);

  const sections = [];
  sections.push(`# GSC 点击到产品激活追踪表\n`);
  sections.push(`> 生成时间：${new Date().toISOString()}  `);
  sections.push(`> 数据来源：Supabase \`growth_metric_snapshots\` + \`growth_events\`  `);
  sections.push(
    `> 说明：当前 GSC 快照为单维度 \`query\` / \`page\`，不是精确 query×page 联合维度；“是否进入产品”使用同日/近 7 日站内事件做弱关联。\n`
  );
  sections.push(
    `> 注意：GSC 可能因隐私阈值隐藏部分 query；因此会出现 pages 有点击、queries 仍为 0 click 的情况。\n`
  );

  const summaryRows = [latest1d, latest7d, latest28d]
    .filter(Boolean)
    .map((snapshot) => {
      const metrics = snapshot.metrics_json || {};
      return [
        snapshot.range,
        snapshot.snapshot_date,
        snapshot.fetched_at || "",
        formatNumber(metrics.clicks),
        formatNumber(metrics.impressions),
        formatPercent(metrics.ctr),
        formatNumber(metrics.position, 1),
      ];
    });

  sections.push(`## GSC 汇总\n`);
  sections.push(
    markdownTable(
      ["Range", "Snapshot date", "Fetched at", "Clicks", "Impressions", "CTR", "Avg position"],
      summaryRows
    )
  );

  sections.push(`\n## 产品激活弱关联\n`);
  sections.push(
    markdownTable(
      [
        "Window",
        "/forms/new sessions",
        "forms_new_view",
        "CTA viewed",
        "CTA clicked",
        "login started",
        "login returned",
        "form_created",
      ],
      [
        [
          toDate,
          oneDayEvents.formsNewSessions,
          oneDayEvents.formsNewView,
          oneDayEvents.ctaViewed,
          oneDayEvents.ctaClicked,
          oneDayEvents.loginStarted,
          oneDayEvents.loginReturned,
          oneDayEvents.formCreated,
        ],
        [
          `${from7Date}..${toDate}`,
          sevenDayEvents.formsNewSessions,
          sevenDayEvents.formsNewView,
          sevenDayEvents.ctaViewed,
          sevenDayEvents.ctaClicked,
          sevenDayEvents.loginStarted,
          sevenDayEvents.loginReturned,
          sevenDayEvents.formCreated,
        ],
      ]
    )
  );

  for (const snapshot of [latest1d, latest7d, latest28d].filter(Boolean)) {
    const queryRows = buildQueryRows(snapshot, limit);
    const pageRows = buildPageRows(snapshot, limit);

    sections.push(`\n## ${snapshot.range} Top queries\n`);
    sections.push(
      markdownTable(
        ["Query", "Clicks", "Impressions", "CTR", "Avg position", "处理建议"],
        queryRows.map((row) => [
          row.key,
          formatNumber(row.clicks),
          formatNumber(row.impressions),
          formatPercent(row.ctr),
          formatNumber(row.position, 1),
          row.clicks > 0
            ? "记录点击；查同日 landing page 与 /forms/new 事件"
            : row.position <= 20 && row.impressions > 0
              ? "近页机会；暂不大改，观察 CTR"
              : "观察",
        ])
      )
    );

    sections.push(`\n## ${snapshot.range} Top landing pages\n`);
    sections.push(
      markdownTable(
        ["Landing page", "Clicks", "Impressions", "CTR", "Avg position", "是否进入产品"],
        pageRows.map((row) => [
          row.key,
          formatNumber(row.clicks),
          formatNumber(row.impressions),
          formatPercent(row.ctr),
          formatNumber(row.position, 1),
          row.clicks > 0
            ? "用 growth_events / Clarity 复核是否进入 /forms/new"
            : "无点击，暂不判断",
        ])
      )
    );
  }

  sections.push(`\n## 点击级人工复盘台账\n`);
  sections.push(
    markdownTable(
      [
        "日期",
        "Query",
        "Landing page",
        "国家",
        "设备/语言线索",
        "Click",
        "Impression",
        "Avg position",
        "是否进入 /forms/new",
        "后续动作",
      ],
      [
        [
          new Date().toISOString().slice(0, 10),
          "Mike 在 GSC UI 观察到 1 个点击，query 待补",
          "待 GSC 快照追上后补 landing page",
          "待补充",
          "疑似非中英；先记录不行动",
          "1",
          "待补充",
          "排名上升，数值待补",
          "待按点击发生日期关联 growth_events",
          "等待下一次 GSC 快照；不新增西语页面",
        ],
        [
          toDate,
          "待从 GSC 单次点击行补充",
          "待从 Top landing page / GSC UI 补充",
          "待补充",
          "如西语/非中英，先记录不行动",
          "1",
          "待补充",
          "待补充",
          sevenDayEvents.formsNewSessions > 0 ? "近 7 日有 /forms/new 事件，需按时间窗口复核" : "暂无证据",
          "样本 <3：只记录；不新增西语页面",
        ],
      ]
    )
  );

  sections.push(`\n## 判定规则\n`);
  sections.push(`- 单个非中英 query/click：只记录，不开新语言版本。`);
  sections.push(`- 7 天内同类 query ≥3 次曝光上升或 ≥2 次点击：进入关键词/市场复核。`);
  sections.push(`- 点击页同日或近窗进入 \`/forms/new\`：检查 CTA 与模板承接。`);
  sections.push(`- 点击页未进入产品：优先看页面 CTA、首屏意图匹配和内链，不先扩 SEO 页面。`);
  sections.push(`- \`/forms/new\` 有 CTA click 但无创建：交给 G2 激活链路继续诊断。`);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${sections.join("\n")}\n`, "utf8");
  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
