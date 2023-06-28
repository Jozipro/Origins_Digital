import React, { useState } from "react";
import PropTypes from "prop-types";
import useAPI from "../../api/useAPI";

function Videos({ videos, onDeleteVideo }) {
  const api = useAPI();

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategorie, setNewCategorie] = useState();
  const [modifyTitle, setModifyTitle] = useState(false);
  const [modifyDesc, setModifyDesc] = useState(false);

  const handleDeleteVideo = () => {
    onDeleteVideo(videos.id);
  };

  const handleEdit = () => {
    const newVideo = {
      title: newTitle,
      description_text: newDescription,
      category_id: newCategorie,
    };

    api.put(`/videos/${videos.id}`, newVideo).then((resp) => {
      return resp;
    });
  };

  const handleModifyTitle = () => {
    setModifyTitle(!modifyTitle);
  };

  const handleModifyDesc = () => {
    setModifyDesc(!modifyDesc);
  };

  return (
    <div className="admin-videos" style={{ backgroundColor: "grey" }}>
      <div className="video-info">
        <div className="title">
          <h2>{videos.title}</h2>
          <button type="button" onClick={handleModifyTitle}>
            Modifier le titre
          </button>
        </div>
        <div className="desc">
          {modifyDesc ? (
            <>
              <label htmlFor="description" className="video-text">
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  handleEdit();
                  handleModifyDesc();
                }}
              >
                {" "}
                Modifier
              </button>
            </>
          ) : (
            <>
              <h2 className="video-text">{videos.description_text} </h2>
              <button type="button" onClick={handleModifyDesc}>
                {" "}
                Modifier la description
              </button>
            </>
          )}
        </div>
        <p>Date d'ajout: {videos.date_publication}</p>
        <button type="button" onClick={handleDeleteVideo}>
          Supprimer
        </button>
      </div>
      <div className="video-update-form">
        {modifyTitle && (
          <>
            <label htmlFor="title">
              Nouveau titre:
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </label>
            <button type="button" onClick={handleEdit}>
              {" "}
              Modifier
            </button>
          </>
        )}

        <select onChange={(e) => setNewCategorie(e.target.value)}>
          <option value="1">Animaux</option>
          <option value="2">Sports</option>
          <option value="3">Cuisine</option>
          <option value="4">Voyage</option>
        </select>
        <button type="button" onClick={handleEdit}>
          {" "}
          Modifier
        </button>
        {/* )} */}
      </div>
    </div>
  );
}

Videos.propTypes = {
  videos: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    category_id: PropTypes.number.isRequired,
    description_text: PropTypes.string.isRequired,
    date_publication: PropTypes.string.isRequired,
  }),
  onDeleteVideo: PropTypes.func.isRequired,
};

Videos.defaultProps = {
  videos: {
    title: "toto",
    link: "toto",
    category_id: 0,
    description_text: "toto",
    date_publication: "toto",
  },
};

export default Videos;
