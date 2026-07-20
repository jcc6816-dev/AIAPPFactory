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
    .eq('source', 'gsc')
    .eq('status', 'success')
    .order('snapshot_date', { ascending: false })
    .limit(3);

  if (error || !snapshots || snapshots.length === 0) {
    console.error("Error fetching snapshots:", error);
    process.exit(1);
  }

  console.log(`=== GSC Snapshots Count: ${snapshots.length} ===`);

  snapshots.forEach(snapshot => {
    const date = snapshot.snapshot_date;
    const range = snapshot.range;
    const queries = snapshot.details_json?.queries || [];
    const pages = snapshot.details_json?.pages || [];
    
    console.log(`\n==========================================`);
    console.log(`Snapshot Date: ${date} | Range: ${range} | Total Unique Queries: ${queries.length}`);
    console.log(`==========================================`);

    if (queries.length === 0) {
      console.log("   No queries recorded.");
      return;
    }

    // Sort by impressions descending
    const sorted = [...queries].sort((a, b) => (b.impressions || 0) - (a.impressions || 0));

    console.log("Top 30 queries by impressions:");
    sorted.slice(0, 30).forEach((q, idx) => {
      const queryStr = q.key || q.keys?.[0] || 'unknown';
      console.log(`   ${(idx + 1).toString().padStart(2, ' ')}. "${queryStr}" | Imps: ${q.impressions}, Clicks: ${q.clicks}, CTR: ${(q.ctr * 100).toFixed(2)}%, Pos: ${q.position?.toFixed(1)}`);
    });

    // Categorize
    const contactFormQueries = [];
    const typeformQueries = [];
    const webhookQueries = [];
    const leadQueries = [];
    const waitlistQueries = [];
    const generalQueries = [];

    queries.forEach(q => {
      const queryStr = (q.key || q.keys?.[0] || '').toLowerCase();
      if (!queryStr) return;
      if (queryStr.includes('waitlist') || queryStr.includes('waiting list')) {
        waitlistQueries.push(q);
      } else if (queryStr.includes('lead')) {
        leadQueries.push(q);
      } else if (queryStr.includes('contact') && (queryStr.includes('form') || queryStr.includes('builder') || queryStr.includes('generator'))) {
        contactFormQueries.push(q);
      } else if (queryStr.includes('typeform')) {
        typeformQueries.push(q);
      } else if (queryStr.includes('webhook')) {
        webhookQueries.push(q);
      } else {
        generalQueries.push(q);
      }
    });

    console.log(`\n--- Query Categorization for [${date}] (${range}) ---`);
    console.log(`Waitlist: ${waitlistQueries.length} | Lead: ${leadQueries.length} | Contact Form: ${contactFormQueries.length} | Typeform: ${typeformQueries.length} | Webhook: ${webhookQueries.length}`);

    if (waitlistQueries.length > 0) {
      console.log(`\n   Waitlist Queries (Top 15):`);
      waitlistQueries.sort((a, b) => b.impressions - a.impressions).slice(0, 15).forEach(q => {
        console.log(`     - "${q.key}": Imps: ${q.impressions}, Clicks: ${q.clicks}, CTR: ${(q.ctr * 100).toFixed(2)}%, Pos: ${q.position.toFixed(1)}`);
      });
    }

    if (leadQueries.length > 0) {
      console.log(`\n   Lead Queries (Top 15):`);
      leadQueries.sort((a, b) => b.impressions - a.impressions).slice(0, 15).forEach(q => {
        console.log(`     - "${q.key}": Imps: ${q.impressions}, Clicks: ${q.clicks}, CTR: ${(q.ctr * 100).toFixed(2)}%, Pos: ${q.position.toFixed(1)}`);
      });
    }

    if (contactFormQueries.length > 0) {
      console.log(`\n   Contact Form Queries (Top 10):`);
      contactFormQueries.sort((a, b) => b.impressions - a.impressions).slice(0, 10).forEach(q => {
        console.log(`     - "${q.key}": Imps: ${q.impressions}, Clicks: ${q.clicks}, CTR: ${(q.ctr * 100).toFixed(2)}%, Pos: ${q.position.toFixed(1)}`);
      });
    }

    if (typeformQueries.length > 0) {
      console.log(`\n   Typeform Queries (Top 10):`);
      typeformQueries.sort((a, b) => b.impressions - a.impressions).slice(0, 10).forEach(q => {
        console.log(`     - "${q.key}": Imps: ${q.impressions}, Clicks: ${q.clicks}, CTR: ${(q.ctr * 100).toFixed(2)}%, Pos: ${q.position.toFixed(1)}`);
      });
    }

    if (webhookQueries.length > 0) {
      console.log(`\n   Webhook Queries (Top 10):`);
      webhookQueries.sort((a, b) => b.impressions - a.impressions).slice(0, 10).forEach(q => {
        console.log(`     - "${q.key}": Imps: ${q.impressions}, Clicks: ${q.clicks}, CTR: ${(q.ctr * 100).toFixed(2)}%, Pos: ${q.position.toFixed(1)}`);
      });
    }

    const leadPages = pages.filter((page) => {
      const pageKey = (page.key || page.keys?.[0] || '').toLowerCase();
      return pageKey.includes('lead-capture') || pageKey.includes('lead-magnet');
    });

    if (leadPages.length > 0) {
      console.log(`\n   Lead Pages (Top 15):`);
      leadPages.sort((a, b) => b.impressions - a.impressions).slice(0, 15).forEach(page => {
        console.log(`     - "${page.key}": Imps: ${page.impressions}, Clicks: ${page.clicks}, CTR: ${(page.ctr * 100).toFixed(2)}%, Pos: ${page.position.toFixed(1)}`);
      });
    }

    const waitlistPages = pages.filter((page) => {
      const pageKey = (page.key || page.keys?.[0] || '').toLowerCase();
      return pageKey.includes('waitlist');
    });

    if (waitlistPages.length > 0) {
      console.log(`\n   Waitlist Pages (Top 15):`);
      waitlistPages.sort((a, b) => b.impressions - a.impressions).slice(0, 15).forEach(page => {
        console.log(`     - "${page.key}": Imps: ${page.impressions}, Clicks: ${page.clicks}, CTR: ${(page.ctr * 100).toFixed(2)}%, Pos: ${page.position.toFixed(1)}`);
      });
    }
  });
}

run();
