import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAPI from "../../api/useAPI";
import contactAbo from "../../assets/service.png";
import { useAuth } from "../../context/AuthContext";

export default function PopUp() {
  const api = useAPI();
  const { state } = useLocation();
  const { setUserInfo } = useAuth();
  const navigate = useNavigate();

  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setModal(false);
      }
    };

    if (modal) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.classList.add("modal-open");
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [modal]);

  const refreshAboStatus = async () => {
    try {
      const res = await api.get(`users/${state.userInfo.id}`);
      setUserInfo(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const clickEditPremium = () => {
    (async () => {
      try {
        const response = await api.get(`users/${state.userInfo.id}`);
        const { data } = response;

        await api.put(`users/${state.userInfo.id}`, {
          name: data.name,
          email: data.email,
          firstname: data.firstname,
          role: data.role,
          isPremium: data.isPremium,
          isVideoPlus: 0,
        });
        refreshAboStatus();
        toggleModal();
        setTimeout(() => {
          navigate("/profile");
        }, 200);
      } catch (error) {
        console.error(error);
      }
    })();
  };

  return (
    <div>
      <button
        className="valide-mdp-button"
        type="button"
        onClick={toggleModal}
        style={{ background: "red", color: "black", borderRadius: "30px" }}
      >
        Annuler l'abonnement
      </button>
      <div>
        {modal && (
          <div className="overlay-abo-div" role="dialog" aria-modal="true">
            {modal && (
              <div className="pop-up-abo">
                <img
                  src={contactAbo}
                  style={{ width: "50px", height: "50px" }}
                  alt=""
                />
                <p>
                  Nous sommes vraiment désolés. Es-tu sûr(e) de vouloir
                  supprimer ton compte ? Si tu es certain(e) de ton choix, tu
                  peux cliquer sur "Confirmer".
                  <br />
                  Si tu hésites encore, n'hésite pas à contacter notre service
                  client. Nous serons ravis de t'aider et de trouver une
                  solution adaptée à ton abonnement.
                </p>
                <button
                  className="button-pop-for-all"
                  type="button"
                  onClick={toggleModal}
                >
                  Annuler
                </button>
                <button
                  className="button-pop-for-all"
                  type="button"
                  onClick={clickEditPremium}
                >
                  Confirmer
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
