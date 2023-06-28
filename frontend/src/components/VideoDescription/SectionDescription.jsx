import React, { useEffect, useRef, useState } from "react";
import "../../styles/index.css";
import {
  ArrowBackIosOutlined,
  ArrowForwardIosOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import useAPI from "../../api/useAPI";
import { useAuth } from "../../context/AuthContext";
import Video from "../Sections/Video";
import useResponsiveWidth from "../Sections/useResponsiveWidth";

function SectionDescription() {
  const listRef = useRef();
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [position] = useState(0);
  const [videoNumber, setVideoNumber] = useState(0);
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const api = useAPI();
  const { responsiveWidth } = useResponsiveWidth();
  const leftarrowRef = useRef();
  const rightarrowRef = useRef();
  const wrapperRef = useRef();
  const { userInfo } = useAuth();
  if (!userInfo?.isPremium) userInfo.isPremium = 0;
  const nbVideos = data.length;

  const getVideoData = async () => {
    try {
      if (userInfo.id) {
        const res = await api.get(`videos/allVideoAndFavorite/${userInfo.id}/`);
        setData(res.data);
      } else {
        const res = await api.get(`videos`);
        setData(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getVideoData();
  }, [refresh]);

  const deleteFavoriteVideo = (newValue) => {
    api
      .delete(
        `videosUser/${newValue.videoId}?user=${newValue.userId}`,
        newValue
      )
      .then(() => {
        getVideoData();
      });
  };

  const giveVideoDeleteId = (userId, videoId) => {
    const newValue = { userId, videoId };
    deleteFavoriteVideo(newValue);
  };

  const insertFavoriteVideo = async (newValue) => {
    try {
      await api.post(`videosUser/`, newValue).then(() => {
        setRefresh(!refresh);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const giveVideoId = (userId, videoId) => {
    const newValue = { userId, videoId };
    insertFavoriteVideo(newValue);
  };

  useEffect(() => {
    const leftArrowElement = leftarrowRef.current;
    const rightArrowElement = rightarrowRef.current;
    wrapperRef.current.addEventListener("mouseleave", () => {
      leftArrowElement.style.visibility = "hidden";
      rightArrowElement.style.visibility = "hidden";
    });
    wrapperRef.current.addEventListener("mouseenter", () => {
      leftArrowElement.style.visibility = "visible";
      rightArrowElement.style.visibility = "visible";
    });
  }, []);

  function handleClick(direction) {
    const widthContainer = listRef.current.clientWidth; // indique la longueur totale du container qui contient toutes les videos

    const windowWidth = window.innerWidth; // largeur de l'écran

    let videoWidth;
    if (windowWidth < 670) {
      videoWidth = windowWidth;
    } else {
      videoWidth = 670;
    }

    const nbVideosDisplayedPerClick = Math.floor(windowWidth / videoWidth);

    const totalWidthVideos = videoWidth * nbVideos;

    const totalEmptySpace = widthContainer - totalWidthVideos; // indique le nombre total d'espace vide sur le container
    const whatToAddToVideoWidth = Math.ceil(totalEmptySpace / nbVideos);

    videoWidth += whatToAddToVideoWidth;

    const restVideo = nbVideos - videoNumber; // Nombre de videos restantes avant d'arriver à la fin de la liste
    const totalRestVideosTotalWidth = videoWidth * restVideo;

    if (direction === "right" && restVideo === 0) {
      rightarrowRef.current.style.visibility = "hidden";
    } else if (
      direction === "right" &&
      restVideo > 0 &&
      restVideo <= nbVideos &&
      nbVideos >= nbVideosDisplayedPerClick &&
      totalRestVideosTotalWidth > windowWidth
    ) {
      const newVideoNumber = videoNumber + 1;
      const translateX = -(newVideoNumber * videoWidth);
      setVideoNumber(newVideoNumber);
      listRef.current.style.transform = `translateX(${translateX}px)`;
    }

    if (direction === "left" && videoNumber > 0) {
      const newVideoNumber = videoNumber - 1;
      const translateX = -(newVideoNumber * videoWidth);

      setVideoNumber(newVideoNumber);
      listRef.current.style.transform = `translateX(${translateX}px)`;
    }
  }

  const handleTouchStart = (event) => {
    setTouchStartX(event.touches[0].clientX);
  };

  const handleTouchMove = (event) => {
    setTouchEndX(event.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX && touchEndX) {
      if (touchEndX < touchStartX) {
        handleClick("right");
      } else if (touchEndX > touchStartX) {
        handleClick("left");
      }

      setTouchStartX(null);
      setTouchEndX(null);
    }
  };

  function seeMore() {
    setShowMore(!showMore);
  }

  return (
    <div className="list">
      <div className="wrapper-sectionName-buttons">
        <div className="button-wrapper">
          <button type="submit" className="follow-btn">
            À SUIVRE
          </button>
          <button type="submit" className="next-btn" onClick={() => seeMore}>
            VOIR PLUS
          </button>
        </div>
      </div>

      {showMore ? (
        <div className="wrapper" ref={wrapperRef}>
          <ArrowBackIosOutlined
            className="sliderArrow left"
            onClick={() => handleClick("left")}
            disabled={position === 0}
            ref={leftarrowRef}
          />
          <div
            className="container container-section"
            ref={listRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {data.map((video, index) => {
              const favoriteVideo = data.find(
                (favVideo) =>
                  favVideo.user_id !== null && favVideo.title === video.title
              );
              return (
                // eslint-disable-next-line react/no-array-index-key
                <div key={index}>
                  <Link to={`/video_description/${video.id}`}>
                    <Video
                      height={responsiveWidth <= 420 ? "390px" : "300px"}
                      width={
                        responsiveWidth < 650 ? `${responsiveWidth}px` : "650px"
                      }
                      displayDescription
                      displayDescriptionTitle={video.title}
                      displayDescriptionText={video.description_text}
                      src={`${import.meta.env.VITE_APP_API_URL}${video.link}`}
                      isVideoPremium={video.isVideoPremium}
                      isVideoPaying={video.isVideoPaying}
                      isEnabled
                    />
                  </Link>
                  {userInfo.email ? (
                    <div className="favorite-text-and-button">
                      {favoriteVideo ? (
                        <button
                          className="favorite-profil-button"
                          type="button"
                          onClick={() =>
                            giveVideoDeleteId(userInfo.id, video.id)
                          }
                        >
                          <FavoriteIcon
                            style={{ fontSize: "30px", color: "red" }}
                          />
                        </button>
                      ) : (
                        <button
                          className="favorite-profil-button"
                          type="button"
                          onClick={() => giveVideoId(userInfo.id, video.id)}
                        >
                          <FavoriteIcon
                            style={{ fontSize: "30px", color: "white" }}
                          />
                        </button>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
          <ArrowForwardIosOutlined
            className="sliderArrow right"
            onClick={() => handleClick("right")}
            ref={rightarrowRef}
          />
        </div>
      ) : (
        // eslint-disable-next-line no-undef
        <div key={index}>
          {data.map((video) => (
            <Link to={`/video_description/${video.id}`}>
              <Video
                width={responsiveWidth < 650 ? `${responsiveWidth}px` : "650px"}
                height={responsiveWidth <= 420 ? "390px" : "300px"}
                displayDescription
                displayDescriptionTitle={video.title}
                displayDescriptionText={video.description_text}
                src={`${import.meta.env.VITE_APP_API_URL}${video.link}`}
                isVideoPremium={video.isVideoPremium}
                isVideoPaying={video.isVideoPaying}
                isEnabled
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SectionDescription;
