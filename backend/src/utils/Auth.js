const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const hashingOption = {
  type: argon2.argon2d,
  memoryCost: 2 ** 16,
  hashLength: 50,
  parallelism: 1,
};

const hashPassword = async (mdp) => {
  const hashed = await argon2
    .hash(mdp, hashingOption)
    .then((hashedPassword) => {
      return hashedPassword;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
  return hashed;
};

const verifyPassword = async (req, res) => {
  argon2
    .verify(req.user.mdp, req.body.mdp)
    .then((isVerified) => {
      if (isVerified) {
        const payload = { sub: req.user.id, role: req.user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        delete req.user.mdp;
        res.send({ token, user: req.user });
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const verifyEditPassword = async (req, res, next) => {
  argon2
    .verify(req.user.mdp, req.body.mdp)
    .then((isVerified) => {
      if (isVerified) {
        delete req.user.mdp;
        next();
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const verifyAdmin = async (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");
    if (authorizationHeader === null || !authorizationHeader) {
      throw new Error("Authorization header is missing");
    }
    const [type, token] = authorizationHeader.split(" ");
    if (type !== "Bearer") {
      throw new Error("Authorization header had not the bearer type");
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "13579AETUO") {
      throw new Error("User is not an admin");
    }
    next();
  } catch (err) {
    console.error(err);
    return res.status(403).send("Forbidden");
  }
  return true;
};

const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");
    if (authorizationHeader === null || !authorizationHeader) {
      throw new Error("Authorization header is missing");
    }
    const [type, token] = authorizationHeader.split(" ");
    if (type !== "Bearer") {
      throw new Error("Authorization header had not the bearer type");
    }
    req.payload = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.error(err);
    return res.status(500);
  }
  return true;
};

module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken,
  verifyAdmin,
  verifyEditPassword,
};
