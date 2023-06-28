import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAPI from "../../api/useAPI";
import bravo from "../../assets/bravo.svg.png";
import bank from "../../assets/bank.jpg";
import { useAuth } from "../../context/AuthContext";

export default function PopUp() {
  const api = useAPI();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { setUserInfo } = useAuth();

  const [modal, setModal] = useState(false);
  const [bravoModal, setBravoModal] = useState(false);

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

  const toggleBravoModal = () => {
    setBravoModal(!bravoModal);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setBravoModal(false);
      }
    };

    if (bravoModal) {
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
  }, [bravoModal]);

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
          isVideoPlus: 1,
        });
      } catch (error) {
        console.error(error);
      }
      refreshAboStatus();
      setTimeout(() => {
        toggleModal();
      }, 500);
      toggleBravoModal();
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    })();
  };

  return (
    <div>
      <button
        className="valide-mdp-button"
        type="button"
        onClick={toggleModal}
        style={{ background: "green", color: "black", borderRadius: "30px" }}
      >
        Ajouter Abonnement
      </button>
      <div>
        {modal && (
          <div className="overlay-abo-div" role="dialog" aria-modal="true">
            {modal && (
              <div className="pop-up-abo">
                <img
                  src={bank}
                  style={{
                    borderRadius: "30px",
                    width: "300px",
                    height: "200px",
                  }}
                  alt="bravo"
                />
                <p>Valider le paiement avec la banque</p>
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

      <div>
        {bravoModal && (
          <div className="overlay-abo-div" role="dialog" aria-modal="true">
            {bravoModal && (
              <div className="pop-up-abo">
                <img
                  src={bravo}
                  style={{
                    borderRadius: "30px",
                    width: "300px",
                    height: "200px",
                  }}
                  alt="bravo"
                />
                <p>Vous pouvez maintenant profiter de votre abonnement !</p>
                <button
                  className="button-pop-for-all"
                  type="button"
                  onClick={toggleBravoModal}
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
