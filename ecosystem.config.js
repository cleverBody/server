module.exports = {
  apps: [{
    name: 'tuweiqinghua-server',
    script: 'app.js',
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}; 