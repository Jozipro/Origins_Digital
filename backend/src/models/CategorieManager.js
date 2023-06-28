const AbstractManager = require("./AbstractManager");

class CategorieManager extends AbstractManager {
  constructor() {
    super({ table: "categorie" });
  }

  findAll() {
    return this.database.query(`select * from ${this.table}`);
  }

  insert(categorie) {
    return this.database
      .query(`insert into ${this.table} (name) values (?)`, [categorie.name])
      .then(([result]) => result.insertId)
      .catch((err) => {
        throw err;
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
    return this.database.query(`delete from ${this.table} where id = ?`, [id]);
  }
}

module.exports = CategorieManager;
