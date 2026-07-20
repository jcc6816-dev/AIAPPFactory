alter table forms
  add column if not exists webhook_url_encrypted text not null default '';

comment on column forms.webhook_url_encrypted is
  'AES-256-GCM encrypted webhook URL. webhook_url remains only for temporary migration fallback.';
