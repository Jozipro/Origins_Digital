const models = require("../models");

const browse = (req, res) => {
  models.section
    .findAll()
    .then(([rows]) => {
      res.send(rows);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const read = (req, res) => {
  models.section
    .find(req.params.id)
    .then(([rows]) => {
      if (rows[0] == null) {
        res.sendStatus(404);
      } else {
        res.send(rows[0]);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const add = (req, res) => {
  const sections = req.body;

  models.section
    .insert(sections)
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      if (err.errno === 1062) {
        res.sendStatus(409);
      } else {
        res.sendStatus(500);
      }
    });
};

const edit = (req, res) => {
  const sections = req.body;

  sections.id = parseInt(req.params.id, 10);

  models.section
    .update(sections)
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      if (err.errno === 1062) {
        res.sendStatus(409);
      } else {
        res.sendStatus(500);
      }
    });
};

const destroy = (req, res) => {
  models.section
    .delete(req.params.id)
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

module.exports = {
  browse,
  read,
  add,
  edit,
  destroy,
};
