/**
 * GenForms production process definition.
 *
 * Keep this file in source control so a release can always prove the exact
 * working directory and startup guard PM2 must use. The guard, rather than
 * `server.js` directly, loads the preserved server-side environment and
 * refuses an incomplete production configuration.
 */
module.exports = {
  apps: [
    {
      name: "aiform-factory",
      script: "./scripts/production-start-guard.js",
      cwd: __dirname,
      interpreter: "node",
      exec_mode: "fork",
      instances: 1,
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
    },
  ],
};
