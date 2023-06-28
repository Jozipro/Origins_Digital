require("dotenv").config();

const mysql = require("mysql2/promise");

// create a connection pool to the database

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

// try a connection

pool.getConnection().catch(() => {
  console.warn(
    "Warning:",
    "Failed to get a DB connection.",
    "Did you create a .env file with valid credentials?",
    "Routes using models won't work as intended"
  );
});

// declare and fill models: that's where you should register your own managers

const models = {};

const VideoManager = require("./VideoManager");
const UserManager = require("./UserManager");
const SectionManager = require("./SectionManager");
const CategorieManager = require("./CategorieManager");
const VideoSectionManager = require("./VideoSectionManager");

models.video = new VideoManager();
models.video.setDatabase(pool);

models.user = new UserManager();
models.user.setDatabase(pool);

models.section = new SectionManager();
models.section.setDatabase(pool);

models.categorie = new CategorieManager();
models.categorie.setDatabase(pool);

models.videoSection = new VideoSectionManager();
models.videoSection.setDatabase(pool);
const AdvertsManager = require("./AdvertsManager");

models.adverts = new AdvertsManager();
models.adverts.setDatabase(pool);

const VideosUserManager = require("./Videos_userManager");

models.videos_user = new VideosUserManager();
models.videos_user.setDatabase(pool);

// bonus: use a proxy to personalize error message,
// when asking for a non existing model

const handler = {
  get(obj, prop) {
    if (prop in obj) {
      return obj[prop];
    }

    const pascalize = (string) =>
      string.slice(0, 1).toUpperCase() + string.slice(1);

    throw new ReferenceError(
      `models.${prop} is not defined. Did you create ${pascalize(
        prop
      )}Manager.js, and did you register it in backend/src/models/index.js?`
    );
  },
};

module.exports = new Proxy(models, handler);
