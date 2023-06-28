import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/index.css";
import useAPI from "../../api/useAPI";

function VideoAdd() {
  const navigate = useNavigate();

  const [videoTitle, setTitle] = useState("");
  const [categorie, setCategorie] = useState(1);
  const [description, setDescription] = useState("");

  const [fileUpload, setFileUpload] = useState(null);
  const [videosChanging, setVideosChanging] = useState(true);
  const [newCategorie, setNewCategorie] = useState({ name: "", id: "" });
  const [allCategories, setAllCategories] = useState([]);
  const [videoPaying, setVideoPaying] = useState(0);
  const [videoPremium, setVideoPremium] = useState(0);
  const [wrongType, setWrongtype] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const api = useAPI();

  useEffect(() => {
    api.get("category").then((res) => {
      setAllCategories(res.data);
    });
  }, [videosChanging]);

  const handleAddVideos = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", videoTitle);
    formData.append("description_text", description);
    formData.append("category_id", categorie);
    formData.append("link", fileUpload);
    formData.append("date_publication", Date());
    formData.append("isVideoPaying", videoPaying);
    formData.append("isVideoPremium", videoPremium);

    api
      .post("/videos", formData)

      .then(() => {
        setVideosChanging(!videosChanging);
        navigate("/adminPanel/videosTable");
      })
      .catch((error) => {
        const { status } = error.response;
        switch (status) {
          case 400:
            setErrorMessage("Format non valide");
            setWrongtype(true);
            break;
          case 500:
            setErrorMessage("Problème dans l'ajout de la vidéo");
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

  function handleChange(e) {
    const { name, value } = e.target;
    setNewCategorie((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function addCategorie() {
    api
      .post("category", newCategorie)
      .then((res) => {
        setCategorie(res.data.id);
        setVideosChanging(!videosChanging);
      })
      .catch((error) => {
        console.error("Error adding categorie:", error);
      });
  }

  function handleSubmit(e) {
    e.preventDefault();
    addCategorie();
  }

  return (
    <div className="sectionUpdate">
      <h2 className="sectionUpdateTitle">Page de video</h2>

      <div className="sectionUpdateForm">
        <div className="sectionUpdateName">
          <label htmlFor="title">Titre de la vidéo :</label>
          <input
            type="text"
            placeholder="Titre"
            className="sectionUpdateInput"
            value={videoTitle}
            onChange={(e) => setTitle(e.target.value)}
            name="title"
          />
        </div>
        <div className="sectionUpdateName">
          <label htmlFor="description_text">Description de la vidéo :</label>
          <input
            type="text"
            placeholder="Description"
            className="sectionUpdateInput"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            name="description_text"
          />
        </div>
        <div className="sectionUpdateName">
          <label htmlFor="category_id">Selectionnez une categorie :</label>
          <select
            name="category_id"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
          >
            {allCategories.map((cat) => (
              <option value={cat.id} key={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <form className="" onSubmit={handleSubmit} id="section-form">
            <div className="sectionUpdateName">
              <label htmlFor="name"> Ou insérez une nouvelle categorie :</label>
              <input
                type="text"
                value={newCategorie.name}
                name="name"
                onChange={handleChange}
              />
            </div>
            <button type="button" onClick={addCategorie}>
              Ajouter
            </button>

            <div id="video-paying">
              <label htmlFor="videoPaying">Video Payante?</label>
              <input
                name="videoPaying"
                type="checkbox"
                checked={videoPaying === 1}
                onChange={() =>
                  videoPaying === 0 ? setVideoPaying(1) : setVideoPaying(0)
                }
              />
              <label htmlFor="videoPremium">Video Premium?</label>
              <input
                name="videoPremium"
                type="checkbox"
                checked={videoPremium === 1}
                onChange={() =>
                  videoPremium === 0 ? setVideoPremium(1) : setVideoPremium(0)
                }
              />
            </div>
          </form>
        </div>
        <label htmlFor="link">
          <input
            type="file"
            name="link"
            onChange={(e) => setFileUpload(e.target.files[0])}
            id="file-selection-button"
          />
        </label>
        {wrongType && <p className="error">{errorMessage}</p>}

        <button
          type="submit"
          className="sectionUpdateButton"
          onClick={handleAddVideos}
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}

export default VideoAdd;
