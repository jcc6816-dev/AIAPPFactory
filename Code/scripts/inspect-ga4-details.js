const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load env vars
try {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const parts = trimmed.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let val = parts.slice(1).join('=').trim();
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    });
  }
} catch (err) {
  console.error("Failed to load .env.local", err);
}

const supabaseUrl = process.env.SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: snapshots, error } = await supabase
    .from('growth_metric_snapshots')
    .select('*')
    .eq('source', 'ga4')
    .eq('status', 'success')
    .order('snapshot_date', { ascending: false })
    .order('fetched_at', { ascending: false })
    .limit(12);

  if (error || !snapshots || snapshots.length === 0) {
    console.error("Error fetching snapshots:", error);
    process.exit(1);
  }

  const latestByRange = new Map();
  snapshots.forEach(snapshot => {
    if (!latestByRange.has(snapshot.range)) {
      latestByRange.set(snapshot.range, snapshot);
    }
  });

  ['1d', '7d', '28d'].forEach(range => {
    const snapshot = latestByRange.get(range);
    if (!snapshot) return;
    console.log(`\n==========================================`);
    console.log(`GA4 Snapshot Date: ${snapshot.snapshot_date} | Range: ${snapshot.range}`);
    console.log(`==========================================`);
    console.log("Summary Metrics:", JSON.stringify(snapshot.metrics_json, null, 2));

    const details = snapshot.details_json || {};
    
    // Funnel Events
    const funnel = details.funnel || [];
    console.log(`\nFunnel Event Counts:`);
    funnel.forEach(e => {
      console.log(`   - "${e.eventName}": Count: ${e.eventCount}`);
    });

    // Landing Pages
    const pages = details.landingPages || [];
    console.log(`\nTop Landing Pages (by sessions, top 10):`);
    pages.slice(0, 10).forEach((p, idx) => {
      console.log(`   ${idx + 1}. "${p.key}" | Sessions: ${p.sessions}, Active Users: ${p.activeUsers}, Events: ${p.eventCount}`);
    });
  });
}

run();
