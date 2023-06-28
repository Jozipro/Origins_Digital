import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "../../styles/index.css";
import {
  ArrowBackIosOutlined,
  ArrowForwardIosOutlined,
} from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";
import Video from "./Video";
import useAPI from "../../api/useAPI";
import { useAuth } from "../../context/AuthContext";
import useResponsiveWidth from "./useResponsiveWidth";

function SectionCategory({ sectionInfo }) {
  const listRef = useRef();
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [position] = useState(0);
  const [videoNumber, setVideoNumber] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showMore, setShowMore] = useState(true);
  const { responsiveWidth } = useResponsiveWidth();
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const leftarrowRef = useRef();
  const rightarrowRef = useRef();
  const wrapperRef = useRef();
  const { userInfo } = useAuth();
  if (!userInfo?.isPremium) userInfo.isPremium = 0;

  const api = useAPI();

  const getVideoData = async () => {
    try {
      if (userInfo.id) {
        const res = await api.get(`videos/allVideoAndFavorite/${userInfo.id}`);
        setData(res.data);
      } else {
        const res = await api.get(`videos/`);
        setData(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const newFilteredData = data.filter(
    (newVideo) => newVideo.SectionID === sectionInfo.id
  );

  useEffect(() => {
    getVideoData();
  }, [refresh]);

  const uniqueCategories = newFilteredData.filter((item, index) => {
    return (
      newFilteredData.findIndex((object) => {
        return object.categorie_name === item.categorie_name;
      }) === index
    );
  });
  function handleCategory(category) {
    setVideoNumber(0);
    setSelectedCategory(category);
    const translateX = 0;
    listRef.current.style.transform = `translateX(${translateX}px)`;
  }

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
    const widthContainer = listRef.current.clientWidth;

    const windowWidth = window.innerWidth;

    let videoWidth;
    if (windowWidth < 670) {
      videoWidth = windowWidth;
    } else {
      videoWidth = 670;
    }

    const filteredData = selectedCategory
      ? newFilteredData.filter(
          (item) => item.categorie_name === selectedCategory
        )
      : newFilteredData;

    const nbVideos = filteredData.length;

    const nbVideosDisplayedPerClick = Math.floor(windowWidth / videoWidth);

    const totalWidthVideos = videoWidth * nbVideos;

    const totalEmptySpace = widthContainer - totalWidthVideos;
    const whatToAddToVideoWidth = Math.ceil(totalEmptySpace / nbVideos);

    videoWidth += whatToAddToVideoWidth;

    const restVideo = nbVideos - videoNumber;
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
        <h1 className="section-name">{sectionInfo.name}</h1>
        <div className="button-wrapper">
          <button type="submit" className="follow-btn">
            À SUIVRE
          </button>
          <button type="submit" className="next-btn" onClick={() => seeMore()}>
            {showMore ? "VOIR PLUS" : "VOIR MOINS"}
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
            id="sliderArrow_sectionCategory"
          />
          <div className="category-container">
            {uniqueCategories.map((item, index) => (
              <button
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className="category-btn"
                type="submit"
                onClick={() => handleCategory(item.categorie_name)}
              >
                {item.categorie_name}
              </button>
            ))}
          </div>
          <div
            className="container container-section"
            ref={listRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {!selectedCategory
              ? newFilteredData.map((item, index) => {
                  const favoriteVideo = data.find(
                    (favVideo) =>
                      favVideo.user_id !== null && favVideo.title === item.title
                  );
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={index}>
                      <Link to={`/video_description/${item.id}`}>
                        <Video
                          src={`${import.meta.env.VITE_APP_API_URL}${
                            item.link
                          }`}
                          width={
                            responsiveWidth < 650
                              ? `${responsiveWidth}px`
                              : "650px"
                          }
                          height={responsiveWidth <= 420 ? "390px" : "300px"}
                          displayDescription
                          displayDescriptionTitle={item.title}
                          displayDescriptionText={item.description_text}
                          isVideoPremium={item.isVideoPremium}
                          isVideoPaying={item.isVideoPaying}
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
                                giveVideoDeleteId(userInfo.id, item.id)
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
                              onClick={() => giveVideoId(userInfo.id, item.id)}
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
                })
              : newFilteredData
                  .filter((item) => item.categorie_name === selectedCategory)
                  .map((item, index) => {
                    const favoriteVideo = data.find(
                      (favVideo) =>
                        favVideo.user_id !== null &&
                        favVideo.title === item.title
                    );
                    return (
                      // eslint-disable-next-line react/no-array-index-key
                      <div key={index}>
                        <Link to={`/video_description/${item.id}`}>
                          <Video
                            src={`${import.meta.env.VITE_APP_API_URL}${
                              item.link
                            }`}
                            width={
                              responsiveWidth < 650
                                ? `${responsiveWidth}px`
                                : "650px"
                            }
                            height={responsiveWidth <= 420 ? "390px" : "300px"}
                            displayDescription
                            displayDescriptionTitle={item.title}
                            displayDescriptionText={item.description_text}
                            isVideoPremium={item.isVideoPremium}
                            isVideoPaying={item.isVideoPaying}
                            isEnabled
                          />
                        </Link>
                        {userInfo.email ? (
                          // eslint-disable-next-line react/no-array-index-key
                          <div className="favorite-text-and-button" key={index}>
                            {favoriteVideo ? (
                              <button
                                className="favorite-profil-button"
                                type="button"
                                onClick={() =>
                                  giveVideoDeleteId(userInfo.id, item.id)
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
                                onClick={() =>
                                  giveVideoId(userInfo.id, item.id)
                                }
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
            id="sliderArrow_sectionCategory"
          />
        </div>
      ) : (
        <div id="display-all">
          {newFilteredData.map((video, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Link to={`/video_description/${video.id}`} key={index}>
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
SectionCategory.propTypes = {
  sectionInfo: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    order: PropTypes.number,
    section_type: PropTypes.string,
  }).isRequired,
};
export default SectionCategory;
