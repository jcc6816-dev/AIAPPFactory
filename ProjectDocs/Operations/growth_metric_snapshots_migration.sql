-- SQL DDL for creating the growth_metric_snapshots table in Supabase
-- Run this in the Supabase SQL Editor to complete the database migration

CREATE TABLE IF NOT EXISTS growth_metric_snapshots (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    snapshot_date DATE NOT NULL,
    source VARCHAR(50) NOT NULL,
    range VARCHAR(50) NOT NULL,
    segment VARCHAR(255) NOT NULL DEFAULT 'default',
    metrics_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    details_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(50) NOT NULL DEFAULT 'success',
    error_message TEXT NOT NULL DEFAULT '',
    fetched_at timestamptz DEFAULT NOW(),
    created_at timestamptz DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_gms_date_source_range_segment ON growth_metric_snapshots(snapshot_date, source, range, segment);
CREATE INDEX IF NOT EXISTS idx_gms_source_date ON growth_metric_snapshots(source, snapshot_date);
