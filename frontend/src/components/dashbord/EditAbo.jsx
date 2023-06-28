import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import PopUp from "./PopUp";
import PopUpAdd from "./PopUpAdd";

export default function EditAbo() {
  const { state } = useLocation();
  const [editableContent, setEditableContent] = useState(state);

  return (
    <div className="user-main-profile">
      <div className="user-adresse-information">
        <div>
          <h3>Gestion de l'Abonnement</h3>
          <h4>Nom </h4>
          <div />
          <p>
            <input
              type="text"
              style={{ backgroundColor: "white", color: "black" }}
              value={
                editableContent.userInfo.firstname
                  ? editableContent.userInfo.firstname
                  : ""
              }
              onChange={(e) =>
                setEditableContent({
                  ...editableContent,
                  userInfo: {
                    ...editableContent.userInfo,
                    firstname: e.target.value,
                  },
                })
              }
            />
          </p>
          <h4>Prénom</h4>
          <p>
            <input
              type="text"
              style={{ backgroundColor: "white", color: "black" }}
              value={editableContent.userInfo.name}
              onChange={(e) =>
                setEditableContent({
                  ...editableContent,
                  userInfo: {
                    ...editableContent.userInfo,
                    name: e.target.value,
                  },
                })
              }
            />
          </p>
        </div>
        <div className="user-adresse-information">
          <h3>Coordnonnées Bancaires</h3>
          <h4>IBAN</h4>
          <p>FR145 1254 5877 XXXX XXXX</p>
          <h4>BIC</h4>
          <p>FR45875</p>
          <h4>Etablissement </h4>
          <p>Crédit Agricole</p>
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
        {state.userInfo.isVideoPlus === 1 ? (
          <div>
            <PopUp state={state} />
          </div>
        ) : (
          <div>
            <PopUpAdd state={state} />
          </div>
        )}
      </div>
    </div>
  );
}

EditAbo.propTypes = {
  userInfo: PropTypes.shape({
    name: PropTypes.string,
    firstname: PropTypes.string,
    email: PropTypes.string,
  }),
};
EditAbo.defaultProps = {
  userInfo: {
    name: "",
    firstname: "",
    email: "",
  },
};
