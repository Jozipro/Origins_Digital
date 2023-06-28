import "../../styles/index.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAPI from "../../api/useAPI";
import Registration from "./Registration";
import { useAuth } from "../../context/AuthContext";
import userRole from "../../utils/users";

export default function ConnectionPage() {
  const navigate = useNavigate();
  const api = useAPI();
  const [mail, setMail] = useState("");
  const [mdp, setMdp] = useState("");
  const [registrationMail, setRegistrationMail] = useState("");
  const [account, setAccount] = useState(true);
  const [errorMessage, setErrorMessage] = useState(false);
  const [adaptedErrorMessage, setAdaptedErrorMessage] = useState("");
  const { success, setSuccess, setIsAdmin, setUserInfo } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      mdp,
      email: mail,
    };

    api
      .post("users/login/", user)
      .then((res) => {
        const { token } = res.data;
        api.defaults.headers.authorization = `Bearer ${token}`;
        setSuccess(false);
        setUserInfo(res.data.user);
        if (res.data.user.role === userRole.ADMIN) setIsAdmin(true);
        navigate("/profile");
      })
      .catch((err) => {
        if (err.response) {
          const { status } = err.response;
          switch (status) {
            case 401:
              setAdaptedErrorMessage("Mot de passe ou addresse mail invalide");
              break;

            case 404:
              setAdaptedErrorMessage(
                "Erreur de réseau. Vérifier votre connexion internet"
              );
              break;
            default:
              setAdaptedErrorMessage(
                "Une erreur s'est produite. Veuillez réessayer plus tard."
              );
              break;
          }
        }
        console.error(err);
        setErrorMessage(true);
      });
  };

  return account ? (
    <div id="connection">
      <img
        src="https://cdn.pixabay.com/photo/2021/07/28/00/57/pyramids-6498038_960_720.jpg"
        alt=""
        className="connection-bg"
      />
      {success && (
        <div id="connection">
          <img
            src="https://cdn.pixabay.com/photo/2021/07/28/00/57/pyramids-6498038_960_720.jpg"
            alt=""
            className="connection-bg"
          />
          <h2>SE CONNECTER</h2>
          <input
            id="username"
            type="text"
            name="username"
            className="user-input"
            placeholder="Email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
          />
          <input
            type="password"
            name="motdepasse"
            className="user-input"
            placeholder="Mot de Passe"
            value={mdp}
            onChange={(e) => setMdp(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(e);
              }
            }}
          />
          {errorMessage && <p id="password-error">{adaptedErrorMessage}</p>}
          <button type="button" className="user-button" onClick={handleSubmit}>
            Connexion
          </button>
          <h2>
            Pas encore de compte?{"  "}
            <button
              type="button"
              className="button-text"
              onClick={() => {
                setAccount(false);
              }}
            >
              Inscrivez-vous{" "}
            </button>
          </h2>
        </div>
      )}
    </div>
  ) : (
    <Registration
      registrationMail={registrationMail}
      setRegistrationMail={setRegistrationMail}
      mail={mail}
      setMail={setMail}
      mdp={mdp}
      setMdp={setMdp}
      handleSubmit={handleSubmit}
    />
  );
}
