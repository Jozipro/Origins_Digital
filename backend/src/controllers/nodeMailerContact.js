const nodemailer = require("nodemailer");

function initialize(req, res) {
  const { name, email, message } = req.body;
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SERVER,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_SENDER,
      pass: process.env.MAIL_MDP,
    },
  });

  const mailOptions = {
    from: "testwcs004@gmail.com",
    to: "testwcs004@gmail.com", // adresse e-mail du destinataire
    envelope: {
      from: email, // utilisé comme adresse MAIL FROM: pour SMTP
      to: "testwcs004@gmail.com", // utilisé comme adresse RCPT TO: pour SMTP
    },
    subject: "Contact Client",
    text: `Vous avez reçu un message de : ${name}, avec le message suivant : " ${message} "`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else if (info !== null) res.sendStatus(200);
  });
}

function welcomeMessage(req, res) {
  const { name, email } = req.body;
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SERVER,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_SENDER,
      pass: process.env.MAIL_MDP,
    },
  });

  const mailOptions = {
    from: "testwcs004@gmail.com",
    to: email, // adresse e-mail du destinataire
    envelope: {
      from: "testwcs004@gmail.com", // utilisé comme adresse MAIL FROM: pour SMTP
      to: email, // utilisé comme adresse RCPT TO: pour SMTP
    },
    subject: "Contact Client",
    html: `<p>Bonjour ${name}, <br> <br> Félicitations pour votre inscription et bienvenue sur le site Origins Digital avec l'adresse email suivante : ${email} ! <br>
    Toute l'équipe est disponible pour répondre à vos questions. <br>
    Si vous souhaitez changer votre mot de passe, veuillez cliquer sur le lien suivant :
    <a href="http://localhost:5173/profile/useredit">Cliquez sur ce
   lien</a><br><br>
   Vous pouvez également le faire depuis votre profil utilisateur. Explorez toutes les vidéos à votre disposition et abonnez-vous pour profiter d'un contenu exceptionnel ! 
   <br><br>

    Cordialement, l'équipe de Origins Digital<br><br>
   
    <img style='display:block; width:244px;height:144px;' id='base64image'
       src="https://img.newstank.fr/crop/none/f5fdf7057d8dd8cef45682b30206bb3e/0/0/672/294/640/280/image-article-221347.jpg" /> 
    </p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else if (info !== null) res.sendStatus(200);
  });
}

module.exports = { initialize, welcomeMessage };
