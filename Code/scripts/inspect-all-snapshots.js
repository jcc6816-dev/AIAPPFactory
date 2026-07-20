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
    .select('id, snapshot_date, source, range, segment, status, metrics_json, error_message, fetched_at')
    .order('snapshot_date', { ascending: false })
    .order('source', { ascending: true })
    .limit(20);

  if (error || !snapshots || snapshots.length === 0) {
    console.error("Error fetching snapshots:", error);
    process.exit(1);
  }

  console.log(`\n=== Recent Growth Snapshots in Database ===`);
  console.log(`Total fetched: ${snapshots.length}`);
  console.log(`------------------------------------------------------------------------------------------`);
  console.log(`ID     | Date       | Source   | Range  | Status    | Fetched At           | Metrics Summary`);
  console.log(`------------------------------------------------------------------------------------------`);
  
  snapshots.forEach(s => {
    const metricsSummary = s.metrics_json ? JSON.stringify(s.metrics_json) : '{}';
    console.log(`${s.id.toString().padEnd(6)} | ${s.snapshot_date.padEnd(10)} | ${s.source.padEnd(8)} | ${s.range.padEnd(6)} | ${s.status.padEnd(9)} | ${s.fetched_at} | ${metricsSummary.slice(0, 100)}`);
  });
  console.log(`------------------------------------------------------------------------------------------`);
}

run();
