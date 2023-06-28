const AbstractManager = require("./AbstractManager");

class AdvertsManager extends AbstractManager {
  constructor() {
    super({ table: "adverts" });
  }

  findAll() {
    return this.database.query(`select * from  ${this.table}`);
  }

  insert(adverts) {
    return this.database.query(
      `insert into ${this.table} (pictures, picture_link) values (?, ?)`,
      [adverts.pictures, adverts.picture_link]
    );
  }

  update(adverts) {
    return this.database.query(
      `update ${this.table} set pictures = ?, picture_link = ? where id = ?`,
      [adverts.pictures, adverts.picture_link]
    );
  }

  delete(id) {
    return this.database.query(`delete from ${this.table} where id= ?`, [id]);
  }
}

module.exports = AdvertsManager;
