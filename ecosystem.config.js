module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [
      {
        name: 'dapp-dice',
        script: './src/dice.js',
        watch: true,
      },
      {
        name: 'dapp-poker',
        script: './src/poker.js',
        watch: true,
      }
    ],
  };
  