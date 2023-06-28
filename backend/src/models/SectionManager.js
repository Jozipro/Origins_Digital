const AbstractManager = require("./AbstractManager");

class SectionManager extends AbstractManager {
  constructor() {
    super({ table: "section" });
  }

  find(id) {
    return this.database.query(`select * from  ${this.table} where id = ?`, [
      id,
    ]);
  }

  findAll() {
    return this.database.query(
      `select * from ${this.table} ORDER BY  \`order\` ASC`
    );
  }

  insert(section) {
    return this.database.query(
      `INSERT INTO ${this.table} (name,  \`order\`, section_type) VALUES (?, ?, ?)`,
      [section.name, section.order, section.section_type]
    );
  }

  update(section) {
    return this.database
      .query(
        `UPDATE ${this.table} SET name = ?, \`order\` = ?, section_type = ? WHERE id = ?`,
        [section.name, section.order, section.section_type, section.id]
      )
      .catch((err) => console.error(err));
  }

  delete(id) {
    return this.database.query(`delete from ${this.table} where id = ?`, [id]);
  }
}

module.exports = SectionManager;
