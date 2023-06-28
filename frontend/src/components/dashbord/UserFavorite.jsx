import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";
import useAPI from "../../api/useAPI";
import { useAuth } from "../../context/AuthContext";
import subscribe from "../../assets/Project-1.mp4";
import "../../styles/index.css";

export default function UserFavorite() {
  const { userInfo } = useAuth();
  if (!userInfo?.isPremium) userInfo.isPremium = 0;
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const api = useAPI();

  const getVideoData = async () => {
    try {
      await api.get(`videosUser/${userInfo.id}`).then((res) => {
        setData(res.data);
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getVideoData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const insertFavoriteVideo = (newValue) => {
    api
      .delete(
        `videosUser/${newValue.videoId}?user=${newValue.userId}`,
        newValue
      )
      .then(() => {
        getVideoData();
      });
  };

  const giveVideoId = (userId, videoId) => {
    const newValue = { userId, videoId };
    insertFavoriteVideo(newValue);
  };

  return (
    <div className="main-div-profil-video">
      <div className="title-videos-favorites">
        <OndemandVideoIcon style={{ fontSize: "100px" }} />
        <h2>Videos Favorites</h2>
        <div className="search-bar-profil">
          <h4>Chercher une video :</h4>
          <input
            type="text"
            placeholder="Chercher..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="video-grid">
        {filteredData.map((video, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} className="video-wrapper">
            <div className="video-content">
              <ReactPlayer
                width="100%"
                height="75%"
                style={{ backgroundColor: "black" }}
                url={
                  ((!userInfo || userInfo.isPremium === 0) &&
                    video.isVideoPremium === 1) ||
                  (userInfo.isVideoPlus === 0 && video.isVideoPaying === 1)
                    ? subscribe
                    : `${import.meta.env.VITE_APP_API_URL}${video.link}`
                }
                controls
              />
              <div className="favorite-text-and-button">
                <h4>{video.title}</h4>
                <div>
                  {`${video.description_text.slice(0, 30)}...`}
                  <Link
                    to={`/video_description/${video.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <p className="voir-plus-fav-video">voir plus</p>
                  </Link>
                </div>
                <button
                  className="favorite-profil-button"
                  type="button"
                  onClick={() => giveVideoId(userInfo.id, video.id)}
                >
                  <FavoriteIcon style={{ fontSize: "30px", color: "red" }} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
