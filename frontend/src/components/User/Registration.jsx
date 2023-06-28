import { useState } from "react";
import "../../styles/index.css";
import PropTypes from "prop-types";
import useAPI from "../../api/useAPI";
import { useAuth } from "../../context/AuthContext";

export default function Registration({
  registrationMail,
  setRegistrationMail,
  mail,
  setMail,
  mdp,
  setMdp,
  handleSubmit,
  refPass,
  refMail,
}) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { success, setSuccess } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const api = useAPI();

  const handleSubmitRegister = (e) => {
    e.preventDefault();
    const newUser = {
      name: userName,
      email: registrationMail,
      mdp: password,
    };
    api
      .post("users/", newUser)
      .then((result) => {
        if (result.status === 201) {
          api
            .post("nodeMailer/sendWelcome", newUser)
            .then(() => {})
            .catch((err) => console.error(err));
        }
        setSuccess(!success);
        return result;
      })
      .catch((err) => {
        if (err.response.status === 409) {
          setErrorMessage("Nom d'utilisateur déjà utilisé");
          console.error(err);
        }
      });
  };

  return success ? (
    <div id="connection">
      <h2>Créez votre compte :</h2>
      <img
        src="https://cdn.pixabay.com/photo/2021/07/28/00/57/pyramids-6498038_960_720.jpg"
        alt=""
        className="connection-bg"
      />

      <input
        type="text"
        className="user-input"
        value={registrationMail}
        onChange={(e) => setRegistrationMail(e.target.value)}
        placeholder="Adresse mail "
      />
      <input
        type="text"
        className="user-input"
        id="userName"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Nom "
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <input
        type="password"
        className="user-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe "
      />

      <input
        type="submit"
        onClick={handleSubmitRegister}
        className="user-button"
      />
    </div>
  ) : (
    <div id="connection">
      <h2> Felicitation! Vous pouvez maintenant vous connecter!</h2>
      <input
        id="username"
        type="text"
        name="username"
        className="user-input"
        placeholder="Email"
        value={mail}
        onChange={(e) => setMail(e.target.value)}
        ref={refMail}
      />
      <input
        type="password"
        name="motdepasse"
        className="user-input"
        placeholder="Mot de Passe"
        value={mdp}
        onChange={(e) => setMdp(e.target.value)}
        ref={refPass}
      />
      <button type="submit" className="user-button" onClick={handleSubmit}>
        Connexion
      </button>
    </div>
  );
}

Registration.propTypes = {
  registrationMail: PropTypes.string.isRequired,
  setRegistrationMail: PropTypes.func.isRequired,
  mail: PropTypes.string.isRequired,
  setMail: PropTypes.func.isRequired,
  mdp: PropTypes.string.isRequired,
  setMdp: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  refPass: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  refMail: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

Registration.defaultProps = {
  refPass: null,
  refMail: null,
};
