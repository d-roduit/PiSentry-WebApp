module.exports = {
  apps: [{
    name: 'PiSentry-WebApp',
    script: './server.js',
    node_args : '-r dotenv/config', // Use environment variables declared in .env file
  }],
};