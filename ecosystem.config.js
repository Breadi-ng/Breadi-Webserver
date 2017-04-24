module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : "breadi",
      script    : "index.js",
      env: {
        COMMON_VARIABLE: "true"
      },
      env_production : {
        NODE_ENV:             "production",
        APP_ID:               "VMvhutWAGNpk78QXprTt",
        MASTER_KEY:           "8zqndJmKVnQER6aXsnWR",
        DOMAIN_NAME:          "breadi.tk",
        MONGODB_URI:          db(),
        MAILGUN_API_KEY:      "key-9vmhz-shoqd2qm8votyipmtnh-m9xjg6",
        PARSE_MOUNT:          "/1",
        PARSE_SERVER_URI:     "https://api.breadi.tk",
        PUB_SERVER_URL:       "https://api.breadi.tk",
        PORT:                 "3030"
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : "root",
      host : "104.207.132.52",
      ref  : "origin/master",
      repo : "git@github.com:verygreenboi/Breadi-Webserver.git",
      path : "/var/www/breadi.tk",
      "post-deploy" : "npm install && pm2 startOrRestart ecosystem.config.js --env production"
    },
    dev : {
      user : "node",
      host : "212.83.163.1",
      ref  : "origin/master",
      repo : "git@github.com:repo.git",
      path : "/var/www/development",
      "post-deploy" : "npm install && pm2 startOrRestart ecosystem.config.js --env dev",
      env  : {
        NODE_ENV: "dev"
      }
    }
  }
}

function db() {
  let url = "mongodb://localhost:27017/breadi";
  return url;
}
