// PM2: server ko hamesha chalu rakhta hai, crash par restart, reboot par start.
//   pm2 start deploy/ecosystem.config.cjs && pm2 save && pm2 startup
module.exports = {
  apps: [
    {
      name: 'deephysio',
      script: 'server/index.js',
      cwd: __dirname + '/..',
      instances: 1,
      env: { NODE_ENV: 'production' },
      max_memory_restart: '300M',
      out_file: 'logs/out.log',
      error_file: 'logs/error.log',
      time: true,
    },
    // Staging (alag folder + alag .env + alag database), e.g. /var/www/deephysio-staging
  ],
}
