import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/index.css";

import useAPI from "../../api/useAPI";

function SectionAdd() {
  const navigate = useNavigate();
  const api = useAPI();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newSectionData, setNewSectionData] = useState({
    name: "",
    section_type: "",
    order: 0,
  });

  const options = [
    "",
    "section avec catégorie",
    "section sans catégorie",
    "section teasers",
    "section hero",
    "section grande hauteur",
  ];

  function handleChange(e) {
    const { name, value } = e.target;
    setNewSectionData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function addSectionData() {
    api
      .post("sections", newSectionData)
      .then(() => {
        navigate("/adminPanel/sectionsTable");
      })
      .catch((err) => {
        setError(true);
        if (err.response.status === 409) {
          setErrorMessage("Cette entrée existe déjà");
        } else {
          setErrorMessage("Une erreur est survenue");
        }
      });
  }

  function handleSubmit(e) {
    e.preventDefault();
    addSectionData();
  }

  return (
    <div className="sectionUpdate">
      <h2 className="sectionUpdateTitle">Page de section</h2>

      <form className="sectionUpdateForm" onSubmit={handleSubmit}>
        <div className="sectionUpdateName">
          <label htmlFor="name">Nom de la section :</label>
          <input
            type="text"
            placeholder="Section Name"
            className="sectionUpdateInput"
            value={newSectionData.name}
            onChange={handleChange}
            name="name"
          />
        </div>
        <div className="sectionUpdateOrder">
          <label htmlFor="name">Ordre :</label>
          <input
            type="number"
            placeholder="Ordre"
            className="sectionUpdateInput"
            value={newSectionData.order}
            onChange={handleChange}
            name="order"
            min="1"
            max="10"
            style={{ border: error ? "1px solid red" : "" }}
          />
        </div>
        {error && <p>{errorMessage}</p>}
        <div className="sectionUpdateSectionType">
          <label htmlFor="name">Type de la section :</label>
          <select
            id="section_type"
            value={newSectionData.section_type}
            onChange={handleChange}
            name="section_type"
          >
            {options.map((option, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <option value={option} key={index}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="sectionUpdateButton">
          Ajouter
        </button>
      </form>
    </div>
  );
}

export default SectionAdd;
