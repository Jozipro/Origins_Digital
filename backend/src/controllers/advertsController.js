/* eslint-disable camelcase */
const path = require("path");
const fs = require("fs");
const models = require("../models");

const browse = (req, res) => {
  models.adverts
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
  models.adverts
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

const edit = (req, res) => {
  const adverts = req.body;

  adverts.id = parseInt(req.params.id, 10);

  models.adverts
    .update(adverts)
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

const add = async (req, res) => {
  const { pictures } = req.body;
  const { file } = req;
  if (!file) {
    return res.sendStatus(500);
  }

  const baseFolder = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "assets",
    "images",
    "ads"
  );
  const originalName = path.join(baseFolder, file.originalname);
  const filename = path.join(baseFolder, file.filename);

  fs.rename(filename, originalName, (err) => {
    if (err) res.status(500);
  });
  const picture_link = `assets/images/ads/${file.originalname}`;

  // TODO validations (length, format...)
  try {
    const result = await models.adverts.insert({
      pictures,
      picture_link,
    });

    const newAdvert = {
      pictures,
      picture_link,
      id: result,
    };
    return res.status(201).json(newAdvert);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

const destroy = async (req, res) => {
  const baseFolder = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "assets",
    "images",
    "ads"
  );
  const adId = req.params.id;
  try {
    const ad = await models.adverts.find(adId);
    if (!ad) {
      return res.sendStatus(404);
    }

    const adLink = ad[0][0].picture_link;
    const adFileName = adLink.split("/").pop();
    const adFilePath = path.join(baseFolder, adFileName);
    fs.unlinkSync(adFilePath);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send(
        "Une erreur s'est produite lors de la suppression de la publicité."
      );
  }

  models.adverts
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
  return res;
};

module.exports = {
  browse,
  read,
  edit,
  add,
  destroy,
};
