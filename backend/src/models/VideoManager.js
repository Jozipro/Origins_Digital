const AbstractManager = require("./AbstractManager");

class VideoManager extends AbstractManager {
  constructor() {
    super({ table: "videos" });
  }

  findReallyAll() {
    return this.database
      .query(`SELECT videos.*, categorie.name AS categorie_name, section.name, section.id AS SectionID
    FROM videos
    INNER JOIN categorie ON videos.category_id = categorie.id
    LEFT JOIN video_section ON videos.id = video_section.video_id
    LEFT JOIN section ON video_section.section_id = section.id;
    `);
  }

  findAll() {
    return this.database.query(
      `SELECT ${this.table}.*, categorie.name AS categorie_name, video_section.section_id ,section.id as SectionID, section.name as SectionName, section.section_type
      FROM videos
      INNER JOIN categorie ON ${this.table}.category_id = categorie.id
      LEFT JOIN video_section ON ${this.table}.id = video_section.video_id
      LEFT JOIN section ON video_section.section_id = section.id;`
    );
  }

  findAllFromEverything() {
    return this.database.query(
      `SELECT ${this.table}.*, categorie.name AS categorie_name, section.name, section.id AS SectionID
      FROM ${this.table}
      INNER JOIN categorie ON ${this.table}.category_id = categorie.id
      LEFT JOIN video_section ON ${this.table}.id = video_section.video_id
      LEFT JOIN section ON video_section.section_id = section.id;`
    );
  }

  find(id) {
    return this.database.query(
      `select ${this.table}.*, section.id as SectionID, section.name as SectionName, video_section.id as video_section_id
      from ${this.table}
      left join video_section on ${this.table}.id = video_section.video_id
      left join section on video_section.section_id = section.id
      where ${this.table}.id = ?`,
      [id]
    );
  }

  insert(videos) {
    return this.database
      .query(
        `insert into ${this.table} (title, link, category_id, description_text, date_publication, isVideoPremium, isVideoPaying) values (?, ?, ?, ?, ?, ?, ?)`,
        [
          videos.title,
          videos.link,
          videos.category_id,
          videos.description_text,
          videos.date_publication,
          videos.isVideoPremium,
          videos.isVideoPaying,
        ]
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }

  findFavorites({ userId, sectionID }) {
    return this.database
      .query(
        `SELECT DISTINCT ${this.table}.*, videos_user.user_id, videos_user.videos_id, categorie.name AS categorie_name, video_section.section_id AS SectionID
        FROM ${this.table}
        INNER JOIN categorie ON videos.category_id = categorie.id
        INNER JOIN video_section ON videos.id = video_section.video_id
        INNER JOIN section ON video_section.section_id = section.id
        LEFT JOIN videos_user ON videos.id = videos_user.videos_id AND videos_user.user_id = ?
        WHERE section_id = ?;`,
        [userId, sectionID]
      )
      .catch((err) => {
        console.error(err);
      });
  }

  findFavoritesWithoutSectionId({ userId }) {
    return this.database
      .query(
        `SELECT DISTINCT ${this.table}.*, videos_user.user_id, videos_user.videos_id, categorie.name as categorie_name, section.id AS SectionID
        FROM ${this.table}
        INNER JOIN video_section ON videos.id = video_section.video_id
        INNER JOIN section ON video_section.section_id = section.id
        INNER JOIN categorie ON videos.category_id = categorie.id
        LEFT JOIN videos_user ON videos.id = videos_user.videos_id AND videos_user.user_id = ?;`,
        [userId]
      )
      .catch((err) => {
        console.error(err);
      });
  }

  update(id, videos) {
    return this.database
      .query(`update ${this.table} set  ? where id = ?`, [videos, id])
      .then(([result]) => result.affectedRows === 1)
      .catch((err) => {
        console.error(err);
      });
  }

  delete(id) {
    return this.database
      .query("delete from video_section where video_id= ?", [id])
      .then(() => {
        return this.database.query(`delete from ${this.table} where id = ?`, [
          id,
        ]);
      });
  }
}

module.exports = VideoManager;
