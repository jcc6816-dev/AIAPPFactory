CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at timestamptz,
    nickname VARCHAR(255),
    avatar_url VARCHAR(255),
    locale VARCHAR(50),
    signin_type VARCHAR(50),
    signin_ip VARCHAR(255),
    signin_provider VARCHAR(50),
    signin_openid VARCHAR(255),
    invite_code VARCHAR(255) NOT NULL default '',
    updated_at timestamptz,
    invited_by VARCHAR(255) NOT NULL default '',
    is_affiliate BOOLEAN NOT NULL default false,
    UNIQUE (email, signin_provider)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_no VARCHAR(255) UNIQUE NOT NULL,
    created_at timestamptz,
    user_uuid VARCHAR(255) NOT NULL DEFAULT '',
    user_email VARCHAR(255) NOT NULL DEFAULT '',
    amount INT NOT NULL,
    interval VARCHAR(50),
    expired_at timestamptz,
    status VARCHAR(50) NOT NULL,
    stripe_session_id VARCHAR(255),
    credits INT NOT NULL,
    currency VARCHAR(50),
    sub_id VARCHAR(255),
    sub_interval_count int,
    sub_cycle_anchor int,
    sub_period_end int,
    sub_period_start int,
    sub_times int,
    product_id VARCHAR(255),
    product_name VARCHAR(255),
    valid_months int,
    order_detail TEXT,
    paid_at timestamptz,
    paid_email VARCHAR(255),
    paid_detail TEXT
);


CREATE TABLE apikeys (
    id SERIAL PRIMARY KEY,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(100),
    user_uuid VARCHAR(255) NOT NULL,
    created_at timestamptz,
    status VARCHAR(50)
);

CREATE TABLE credits (
    id SERIAL PRIMARY KEY,
    trans_no VARCHAR(255) UNIQUE NOT NULL,
    created_at timestamptz,
    user_uuid VARCHAR(255) NOT NULL,
    trans_type VARCHAR(50) NOT NULL,
    credits INT NOT NULL,
    order_no VARCHAR(255),
    expired_at timestamptz
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255),
    title VARCHAR(255),
    description TEXT,
    content TEXT,
    created_at timestamptz,
    updated_at timestamptz,
    status VARCHAR(50),
    cover_url VARCHAR(255),
    author_name VARCHAR(255),
    author_avatar_url VARCHAR(255),
    locale VARCHAR(50)
);

create table affiliates (
    id SERIAL PRIMARY KEY,
    user_uuid VARCHAR(255) NOT NULL,
    created_at timestamptz,
    status VARCHAR(50) NOT NULL default '',
    invited_by VARCHAR(255) NOT NULL,
    paid_order_no VARCHAR(255) NOT NULL default '',
    paid_amount INT NOT NULL default 0,
    reward_percent INT NOT NULL default 0,
    reward_amount INT NOT NULL default 0
);

create table forms (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    user_uuid VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL default '',
    theme VARCHAR(50) NOT NULL default 'minimal',
    schema_json JSONB NOT NULL default '{}'::jsonb,
    status VARCHAR(50) NOT NULL default 'draft',
    share_code VARCHAR(255) UNIQUE NOT NULL,
    ocr_template VARCHAR(50) NOT NULL default 'general_image',
    llm_provider VARCHAR(50) NOT NULL default '',
    llm_model VARCHAR(100) NOT NULL default '',
    generation_meta_json JSONB NOT NULL default '{}'::jsonb,
    webhook_enabled BOOLEAN NOT NULL default false,
    webhook_url VARCHAR(500) NOT NULL default '',
    webhook_provider VARCHAR(50) NOT NULL default 'generic',
    webhook_secret_encrypted TEXT NOT NULL default '',
    webhook_auth_mode VARCHAR(50) NOT NULL default 'none',
    webhook_keyword_encrypted TEXT NOT NULL default '',
    webhook_header_name VARCHAR(255) NOT NULL default '',
    created_at timestamptz,
    updated_at timestamptz
);

create table form_submissions (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    form_uuid VARCHAR(255) NOT NULL,
    form_title VARCHAR(255) NOT NULL default '',
    form_share_code VARCHAR(255) NOT NULL default '',
    answers_json JSONB NOT NULL default '{}'::jsonb,
    files_json JSONB NOT NULL default '[]'::jsonb,
    storage_files_json JSONB NOT NULL default '[]'::jsonb,
    status VARCHAR(50) NOT NULL default 'submitted',
    workflow_run_uuid VARCHAR(255) NOT NULL default '',
    ocr_status VARCHAR(50) NOT NULL default 'not_requested',
    ocr_provider VARCHAR(50) NOT NULL default '',
    ocr_result_json JSONB NOT NULL default '{}'::jsonb,
    ocr_error_message TEXT NOT NULL default '',
    created_at timestamptz
);

create table workflow_runs (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    form_uuid VARCHAR(255) NOT NULL,
    form_submission_uuid VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL default 'queued',
    steps_json JSONB NOT NULL default '[]'::jsonb,
    error_message TEXT NOT NULL default '',
    created_at timestamptz,
    finished_at timestamptz
);

create table webhook_logs (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    form_uuid VARCHAR(255) NOT NULL,
    submission_uuid VARCHAR(255) NOT NULL,
    workflow_run_uuid VARCHAR(255) NOT NULL default '',
    target_url VARCHAR(255) NOT NULL default '',
    request_body_json JSONB NOT NULL default '{}'::jsonb,
    response_status INT NOT NULL default 0,
    response_body TEXT NOT NULL default '',
    attempt_count INT NOT NULL default 1,
    status VARCHAR(50) NOT NULL default 'completed',
    error_message TEXT NOT NULL default '',
    created_at timestamptz,
    last_attempt_at timestamptz
);
