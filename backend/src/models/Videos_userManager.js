const AbstractManager = require("./AbstractManager");

class VideosUserManager extends AbstractManager {
  constructor() {
    super({ table: "videos_user" });
  }

  findAll() {
    return this.database.query(`select * from ${this.table}`);
  }

  read(id) {
    return this.database.query(
      `SELECT videos.id AS video_id, videos.*, categorie.name
      FROM videos
      INNER JOIN categorie ON videos.category_id = categorie.id
      INNER JOIN videos_user ON videos.id = videos_user.videos_id
      INNER JOIN user ON videos_user.user_id = user.id
      WHERE user.id = ?;
      `,
      [id]
    );
  }

  insert({ userId, videoId }) {
    return this.database
      .query(
        `INSERT INTO videos_user (user_id, videos_id) VALUES (?, ?)
        `,
        [userId, videoId]
      )
      .catch((err) => {
        console.error(err);
        return err.errno;
      });
  }

  delete({ userId, videoId }) {
    return this.database.query(
      `DELETE FROM ${this.table}
    WHERE user_id = ?
    AND videos_id = ?;`,
      [userId, videoId]
    );
  }
}

module.exports = VideosUserManager;
