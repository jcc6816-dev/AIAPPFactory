const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Load env vars
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

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: SUPABASE_URL or keys not configured.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectGsc() {
  console.log("Supabase connected. Fetching GSC snapshots...");
  
  // Fetch latest snapshots for 'gsc' source
  const { data: snapshots, error } = await supabase
    .from('growth_metric_snapshots')
    .select('*')
    .eq('source', 'gsc')
    .eq('status', 'success')
    .order('snapshot_date', { ascending: false })
    .limit(10);

  if (error) {
    console.error("Failed to fetch snapshots:", error);
    process.exit(1);
  }

  if (!snapshots || snapshots.length === 0) {
    console.log("No successful GSC snapshots found.");
    return;
  }

  console.log(`Found ${snapshots.length} recent GSC snapshots.\n`);

  // We want to scan each snapshot and check for target query clusters
  snapshots.forEach(snapshot => {
    const date = snapshot.snapshot_date;
    const range = snapshot.range;
    const details = snapshot.details_json;
    
    if (!details || !details.queries) {
      console.log(`Snapshot [${date}] (${range}): No query details present.`);
      return;
    }

    const queries = details.queries;
    
    // Categorize
    const contactFormQueries = [];
    const typeformQueries = [];
    const webhookQueries = [];
    
    queries.forEach(q => {
      const queryName = q.key || (q.keys && q.keys[0]) || '';
      const queryStr = queryName.toLowerCase();
      if (!queryStr) return;

      q.displayName = queryName;
      
      // Matchers
      if (queryStr.includes('contact') && (queryStr.includes('form') || queryStr.includes('builder') || queryStr.includes('generator'))) {
        contactFormQueries.push(q);
      } else if (queryStr.includes('typeform')) {
        typeformQueries.push(q);
      } else if (queryStr.includes('webhook')) {
        webhookQueries.push(q);
      }
    });

    console.log(`========================================================================`);
    console.log(`Snapshot Date: ${date} | Range: ${range} | Total Unique Queries in Snapshot: ${queries.length}`);
    console.log(`========================================================================`);
    
    console.log(`\n1. Contact Form Related Queries (${contactFormQueries.length} found):`);
    if (contactFormQueries.length === 0) {
      console.log("   None");
    } else {
      contactFormQueries.forEach(q => {
        console.log(`   - "${q.displayName}": Clicks: ${q.clicks}, Imps: ${q.impressions}, CTR: ${(q.ctr * 100).toFixed(2)}%, Pos: ${q.position.toFixed(1)}`);
      });
    }

    console.log(`\n2. Typeform Related Queries (${typeformQueries.length} found):`);
    if (typeformQueries.length === 0) {
      console.log("   None");
    } else {
      typeformQueries.forEach(q => {
        console.log(`   - "${q.displayName}": Clicks: ${q.clicks}, Imps: ${q.impressions}, CTR: ${(q.ctr * 100).toFixed(2)}%, Pos: ${q.position.toFixed(1)}`);
      });
    }

    console.log(`\n3. Webhook Related Queries (${webhookQueries.length} found):`);
    if (webhookQueries.length === 0) {
      console.log("   None");
    } else {
      webhookQueries.forEach(q => {
        console.log(`   - "${q.displayName}": Clicks: ${q.clicks}, Imps: ${q.impressions}, CTR: ${(q.ctr * 100).toFixed(2)}%, Pos: ${q.position.toFixed(1)}`);
      });
    }
    console.log(`\n`);
  });
}

inspectGsc();
