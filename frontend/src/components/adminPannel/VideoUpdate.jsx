import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/index.css";
import useAPI from "../../api/useAPI";

function VideoUpdate() {
  const { id } = useParams();
  const api = useAPI();
  const navigate = useNavigate();
  const [allCategory, setCategory] = useState([]);
  const [videoData, setVideoData] = useState();
  const [allSection, setAllSection] = useState();
  const [videoSection, setVideoSection] = useState();
  const [rawVideoData, setRawVideoData] = useState();

  useEffect(() => {
    const getVideoData = async () => {
      await api.get(`videos/${id}`).then((res) => {
        setRawVideoData(res.data);
        setVideoData(res.data);
      });
    };
    getVideoData();
  }, [id]);

  useEffect(() => {
    api.get("/category").then((res) => setCategory(res.data));
  }, [id]);

  useEffect(() => {
    api.get("/sections").then((res) => setAllSection(res.data));
  }, [id]);

  useEffect(() => {
    api.get("/video_section").then((res) => {
      const videoSectionData = res.data.find(
        (item) => item.video_id === videoData?.id
      );
      setVideoSection(videoSectionData?.section_id || "");
    });
  }, [videoData?.id]);

  function handleChange(e) {
    const { name, checked } = e.target;
    let newValue;

    if (name === "isVideoPaying" || name === "isVideoPremium") {
      newValue = checked ? 1 : 0;
    } else {
      newValue = e.target.value;
    }

    setVideoData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  }

  function handleSectionChange(e) {
    const { value } = e.target;
    setVideoData((prevVideoData) => ({
      ...prevVideoData,
      SectionID: parseInt(value, 10),
    }));
  }

  function multiUpdate() {
    if (rawVideoData.SectionID !== null && videoData.SectionID !== null) {
      api
        .put(`videos/${videoData.id}`, {
          title: videoData.title,
          description_text: videoData.description_text,
          link: videoData.link,
          category_id: videoData.category_id,
          isVideoPaying: videoData.isVideoPaying,
          isVideoPremium:
            videoData.isVideoPaying === 1 ? 1 : videoData.isVideoPremium,
        })
        .then(() => {
          navigate("/adminPanel/videosTable");
        })
        .catch((error) => {
          console.error(error);
        });

      api
        .put(`video_section/${videoData.video_section_id}`, {
          section_id: videoData.SectionID,
          id: rawVideoData.video_section_id,
        })
        .then(() => {
          navigate("/adminPanel/videosTable");
        })
        .catch((err) => {
          console.error(err);
        });
    } else if (
      rawVideoData.SectionID === null &&
      videoData.SectionID === null
    ) {
      api
        .put(`videos/${videoData.id}`, {
          title: videoData.title,
          description_text: videoData.description_text,
          link: videoData.link,
          category_id: videoData.category_id,
          isVideoPaying: videoData.isVideoPaying,
          isVideoPremium:
            videoData.isVideoPaying === 1 ? 1 : videoData.isVideoPremium,
        })
        .then(() => {
          navigate("/adminPanel/videosTable");
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (
      rawVideoData.SectionID === null &&
      videoData.SectionID !== null
    ) {
      api
        .put(`videos/${videoData.id}`, {
          title: videoData.title,
          description_text: videoData.description_text,
          link: videoData.link,
          category_id: videoData.category_id,
          isVideoPaying: videoData.isVideoPaying,
          isVideoPremium:
            videoData.isVideoPaying === 1 ? 1 : videoData.isVideoPremium,
        })
        .then(() => {
          navigate("/adminPanel/videosTable");
        })
        .catch((error) => {
          console.error(error);
        });

      api
        .post("video_section/add_section", {
          videoId: videoData.id,
          sectionId: videoData.SectionID,
        })
        .then()
        .catch((err) => {
          console.error(err);
        });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    multiUpdate();
  }

  return (
    <div className="sectionUpdate">
      <h2 className="sectionUpdateTitle">Edition de la video</h2>
      <form className="sectionUpdateForm" onSubmit={handleSubmit}>
        <div className="sectionUpdateId">
          <label htmlFor="id">Identifiant de la video :</label>
          <input
            type="text"
            placeholder="id"
            value={videoData?.id}
            className="sectionUpdateInput"
            onChange={(handleChange, handleSectionChange)}
            name="id"
            disabled
          />
        </div>
        <div className="sectionUpdateName">
          <label htmlFor="title">Titre de la vidéo :</label>
          <input
            type="text"
            placeholder="Titre de la video"
            className="sectionUpdateInput"
            value={videoData?.title}
            onChange={handleChange}
            name="title"
          />
        </div>
        <div className="sectionUpdateName">
          <label htmlFor="description_text">Description :</label>
          <input
            type="text"
            placeholder="Description"
            className="sectionUpdateInput"
            value={videoData?.description_text}
            onChange={handleChange}
            name="description_text"
          />
        </div>
        <div className="sectionUpdateName">
          <label htmlFor="category_id"> Modifier la categorie:</label>
          {allCategory && (
            <select
              name="category_id"
              value={videoData?.category_id}
              onChange={handleChange}
              className="selecter"
            >
              {allCategory.map((cat, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <option value={cat.id} key={index}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}

          <label htmlFor="section_id">
            {" "}
            {videoData?.video_section_id
              ? `Modifier la section (section actuelle : ${videoData.SectionName})`
              : "Ajouter à une section"}
          </label>

          {allSection && (
            <select
              name="section_id"
              value={videoSection?.id}
              onChange={handleSectionChange}
              className="selecter"
            >
              <option value="">Veuillez sélectionner une section</option>
              {allSection.map((sec, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <option value={sec.id} key={index}>
                  {sec.name}
                </option>
              ))}
            </select>
          )}
          <label htmlFor="isVideoPaying">Video Payante?</label>
          <input
            type="checkbox"
            name="isVideoPaying"
            checked={videoData?.isVideoPaying === 1}
            onChange={handleChange}
          />
          <label htmlFor="isVideoPremium">Video Premium?</label>
          <input
            type="checkbox"
            name="isVideoPremium"
            checked={videoData?.isVideoPremium === 1}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="sectionUpdateButton">
          Mettre à jour
        </button>
      </form>
    </div>
  );
}

export default VideoUpdate;
