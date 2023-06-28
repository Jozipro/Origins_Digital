import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/index.css";

import useAPI from "../../api/useAPI";

function AdvertAdd() {
  const navigate = useNavigate();

  const [pictures, setPictures] = useState("");

  const [fileUpload, setFileUpload] = useState(null);
  const [advertChanging, setAdvertChanging] = useState(true);
  const [wrongType, setWrongtype] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const api = useAPI();

  const handleAddAdvert = (e) => {
    e.preventDefault();
    const formAdvertData = new FormData();
    formAdvertData.append("pictures", pictures);
    formAdvertData.append("picture_link", fileUpload);

    api
      .post("/adverts", formAdvertData)

      .then(() => {
        setAdvertChanging(!advertChanging);
        navigate("/adminPanel/advertsTable");
      })
      .catch((err) => {
        const { status } = err.response;
        switch (status) {
          case 400:
            setErrorMessage("Format non valide");
            setWrongtype(true);
            break;
          case 500:
            setErrorMessage("Problème dans l'ajout de la publicité");
            setWrongtype(true);
            break;
          default:
            setErrorMessage(
              "Une erreur s'est produite. Veuillez réessayer plus tard."
            );
            break;
        }
      });
  };

  return (
    <div className="sectionUpdate">
      <h2 className="sectionUpdateTitle">Page de publicités</h2>
      <div className="sectionUpdateForm">
        <div className="sectionUpdateName">
          <label htmlFor="pictures">Titre de la publicité :</label>
          <input
            type="text"
            placeholder="Titre"
            className="sectionUpdateInput"
            value={pictures}
            onChange={(e) => setPictures(e.target.value)}
            name="pictures"
          />
        </div>
        <label htmlFor="picture_link">
          <input
            type="file"
            name="picture_link"
            onChange={(e) => setFileUpload(e.target.files[0])}
            id="file-selection-button"
          />
        </label>
        {wrongType && <p className="error">{errorMessage}</p>}
        <button
          type="submit"
          className="sectionUpdateButton"
          onClick={handleAddAdvert}
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}

export default AdvertAdd;
