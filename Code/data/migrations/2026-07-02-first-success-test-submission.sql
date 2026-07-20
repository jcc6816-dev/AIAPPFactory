alter table form_submissions
  add column if not exists is_test boolean not null default false;

create index if not exists idx_form_submissions_form_test_created
  on form_submissions (form_uuid, is_test, created_at desc);

comment on column form_submissions.is_test is
  'Marks creator-initiated test submissions. Test submissions are stored but skip billing and external notifications.';
