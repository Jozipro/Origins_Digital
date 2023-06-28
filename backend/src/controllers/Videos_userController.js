const models = require("../models");

const browse = (req, res) => {
  models.videos_user
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
  models.videos_user
    .read(req.params.id)
    .then(([rows]) => {
      res.send(rows);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const insert = (req, res) => {
  const { userId, videoId } = req.body;
  models.videos_user
    .insert({ userId, videoId })
    .then(() => {
      res.status(200).json({
        message: "La video a bien été ajouté aux favoris utilisateur",
      });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const destroy = (req, res) => {
  const videoId = parseInt(req.params.videoId, 10);
  const userId = parseInt(req.query.user, 10);
  models.videos_user
    .delete({ userId, videoId })
    .then(() => {
      res.status(200).json({
        message: "La video a bien été supprimé de favoris utilisateur",
      });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

module.exports = {
  browse,
  read,
  destroy,
  insert,
};
