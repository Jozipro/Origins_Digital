const joi = require("joi");
const path = require("path");
const fs = require("fs");
const models = require("../models");
const { hashPassword } = require("../utils/Auth");

const validate = (data, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return joi
    .object({
      name: joi.string().max(45).presence(presence),
      email: joi.string().email().presence(presence),
      mdp: joi.string().max(255).presence(presence),
    })
    .validate(data, { abortEarly: false }).error;
};

const validatePassword = (data, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return joi
    .object({
      newPassword: joi.string().max(255).presence(presence),
      mdp: joi.string().max(255).presence(presence),
      email: joi.string().email().presence(presence),
      id: joi.number().presence(presence),
    })
    .validate(data, { abortEarly: false }).error;
};

const browse = (req, res) => {
  models.user
    .findAll()
    .then(([rows]) => {
      const sanitizedRows = rows.map((row) => {
        const { mdp, ...sanitizedRow } = row;
        return sanitizedRow;
      });
      res.send(sanitizedRows);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const read = (req, res) => {
  const id = parseInt(req.params.id, 10);
  models.user
    .find(id)
    .then(([rows]) => {
      if (rows[0] == null) {
        res.sendStatus(404);
      } else {
        const sanitizedRows = rows.map((row) => {
          const { mdp, ...sanitizedRow } = row;
          return sanitizedRow;
        });
        res.send(sanitizedRows[0]);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const edit = (req, res) => {
  const user = req.body;

  user.id = parseInt(req.params.id, 10);

  models.user
    .update(user)
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
  const error = validate(req.body);
  if (error) {
    return res.sendStatus(422);
  }
  const { name, email, mdp } = req.body;
  const hashed = await hashPassword(mdp);
  if (!hashed) {
    return res.sendStatus(500);
  }
  try {
    const result = await models.user.insert({
      name,
      email,
      mdp: hashed,
    });
    return res.status(201).json(result);
  } catch (err) {
    if (err.message === "User already exists") {
      return res.status(409).send("User already exists");
    }
    console.error(err);
    return res.sendStatus(500);
  }
};

const updateNewPassword = async (req, res) => {
  const error = validatePassword(req.body);
  if (error) {
    return res.sendStatus(422);
  }
  const { newPassword, id } = req.body;
  const hashed = await hashPassword(newPassword);
  if (!hashed) {
    return res.sendStatus(500);
  }
  try {
    await models.user.updatePassword({
      mdp: hashed,
      id,
    });
    return res.sendStatus(204);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

const addAvatar = async (req, res) => {
  const { file } = req;

  const id = parseInt(req.params.id, 10);
  if (!file) {
    return res.sendStatus(500);
  }
  const baseFolder = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "assets",
    "images"
  );
  const originalName = path.join(baseFolder, file.originalname);
  const filename = path.join(baseFolder, file.filename);

  try {
    fs.rename(filename, originalName, () => {
      res.sendStatus(201);
    });
  } catch (err) {
    return res.sendStatus(500);
  }

  const link = `assets/images/${file.originalname}`;
  try {
    const result = await models.user.insertAvatar({
      link,
      id,
    });
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
};

const destroy = (req, res) => {
  models.user
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

const findOne = async (req, res) => {
  models.user.find(req.query.name).then(([result]) => {
    res.json(result);
  });
};

const login = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return res.sendStatus(422);
  const result = await models.user.login(email);
  if (result) {
    const [firstResult] = result;
    if (firstResult != null) {
      req.user = firstResult;
      next();
    } else return res.sendStatus(401);
  } else return res.sendstatus(500);
  return true;
};

module.exports = {
  browse,
  read,
  edit,
  add,
  addAvatar,
  destroy,
  login,
  findOne,
  updateNewPassword,
};
