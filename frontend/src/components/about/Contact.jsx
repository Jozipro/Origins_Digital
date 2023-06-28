import React, { useState } from "react";
import useAPI from "../../api/useAPI";
import "./contactPage.css";
import contactBandrole from "../../assets/contactBand2.jpg";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [succesSendNode, setSuccesSendNode] = useState(false);
  const [errorSendNode, setErrorSendNode] = useState(false);
  const api = useAPI();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name,
      email,
      message,
    };
    api
      .post("nodeMailer", formData)
      .then((response) => {
        if (response.status === 200) {
          setSuccesSendNode(true);
        } else {
          setErrorSendNode(true);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="main-form-contact-about">
      <img
        className="banderole-conatact-costard"
        src={contactBandrole}
        alt="banderole contact"
      />
      <div className="texte-explication-contact">
        <p>
          Cher utilisateur, votre satisfaction est notre priorité absolue, c'est
          pourquoi nous mettons un point d'honneur à vous offrir un service
          client exceptionnel. <br />
          Nous sommes à votre disposition pour vous offrir une expérience fluide
          et agréable, et nous nous engageons à vous fournir des réponses
          rapides, précises et personnalisées. <br />
          <br />
          Votre feedback est également très important pour nous. Nous apprécions
          vos commentaires, suggestions et préoccupations, car ils nous aident à
          améliorer continuellement notre service. Nous vous promettons une
          réponse dans les plus brefs délais.
          <br />
          <br /> Merci encore d'avoir choisi notre service. Nous sommes
          impatients de vous assister et de vous offrir une expérience client
          exceptionnelle. <br />
          <br /> Cordialement, L'équipe du service client,
          <br />
        </p>
      </div>
      <form className="contact-mail-client" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nom:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div>
          <label htmlFor="message">Contenu du message:</label>
          <textarea
            id="message"
            value={message}
            onChange={handleMessageChange}
            required
          />
        </div>
        <button type="submit">Envoyer</button>
      </form>
      <div className="message-de-succes-ou-erreur">
        {succesSendNode ? (
          <div className="message-de-retour-contact">
            Nous avon bien reçu votre message et allons vous répondre dans les
            plus bréfs délais. Merci pour votre confiance et à bientot !
          </div>
        ) : undefined}
        {errorSendNode ? (
          <div>Une erreur à eu lieu veuillez essayer plus tard</div>
        ) : undefined}{" "}
      </div>
    </div>
  );
}

export default Contact;
