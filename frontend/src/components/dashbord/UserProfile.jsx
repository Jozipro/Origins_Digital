import React from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

export default function UserProfile() {
  const { state } = useLocation();

  return (
    <div className="user-main-profile">
      <div className="user-adresse-information">
        <h3>Info Utilisateur</h3>
        <h4>Prénom :</h4>
        <p>{state.userInfo.firstname}</p>
        <h4>Nom :</h4>
        <p>{state.userInfo.name}</p>
        <h4>Email :</h4>
        <p>{state.userInfo.email}</p>
        <h4>Premium :</h4>
        <p>
          {state.userInfo.isPremium === 1
            ? "Utilisateur Premium"
            : "Utilisateur Standart"}
        </p>
      </div>
      <div className="user-adresse-information">
        <h3>Adresse</h3>
        <h4>Ville :</h4>
        <p>Lyon</p>
        <h4>Rue :</h4>
        <p>Rue Victor Hugo 42</p>
        <h4>Code Postal : </h4>
        <p>69003</p>
        <h4>Téléphone :</h4>
        <p> 0606060606</p>
        <h4>Complement :</h4>
        <p>Vide</p>
      </div>
      <div className="user-adresse-information">
        <h3>Coordnonnées Bancaires</h3>
        <h4>IBAN</h4>
        <p>FR145 1254 5877 XXXX XXXX</p>
        <h4>BIC</h4>
        <p>FR45875</p>
        <h4>Etablissement </h4>
        <p>Crédit Agricole</p>
        <h4>Tél :</h4>
        <p> 0606060606</p>
      </div>
      <div className="user-adresse-information">
        <h3>Abonnement</h3>
        <h4>Premium</h4>
        <p>Premium Plus</p>
        <h4>Renouvellement</h4>
        <p>12/12/2023</p>
        <h4>Facturation </h4>
        <p>Prelevement</p>
      </div>
    </div>
  );
}

UserProfile.propTypes = {
  userInfo: PropTypes.shape({
    name: PropTypes.string,
    firstname: PropTypes.string,
    email: PropTypes.string,
  }),
};
UserProfile.defaultProps = {
  userInfo: {
    name: "",
    firstname: "",
    email: "",
  },
};
