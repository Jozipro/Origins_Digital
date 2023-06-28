/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "../../styles/index.css";
import {
  ArrowBackIosOutlined,
  ArrowForwardIosOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import Video from "./Video";
import useAPI from "../../api/useAPI";
import useResponsiveWidth from "./useResponsiveWidth";

function SectionVideosHautes({ sectionInfo }) {
  const listRef = useRef();
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [position] = useState(0);
  const [videoNumber, setVideoNumber] = useState(0);
  const [data, setData] = useState([]);
  const [showMore, setShowMore] = useState(true);

  const api = useAPI();
  const leftarrowRef = useRef();
  const rightarrowRef = useRef();
  const wrapperRef = useRef();
  const { responsiveWidth } = useResponsiveWidth();

  const newFilteredData = data.filter(
    (newVideo) => newVideo.SectionID === sectionInfo.id
  );

  const getVideoData = async () => {
    await api
      .get("videos")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getVideoData();
  }, []);

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

    const nbVideos = newFilteredData.length;

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
          />
          <div
            className="container container-section"
            ref={listRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {newFilteredData.map((video, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Link to={`/video_description/${video.id}`} key={index}>
                <Video
                  width={
                    responsiveWidth < 650 ? `${responsiveWidth}px` : "650px"
                  }
                  height={responsiveWidth <= 750 ? "390px" : "750px"}
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
          <ArrowForwardIosOutlined
            className="sliderArrow right"
            onClick={() => handleClick("right")}
            ref={rightarrowRef}
          />
        </div>
      ) : (
        <div id="display-all">
          {newFilteredData.map((video, index) => (
            <Link to={`/video_description/${video.id}`} key={index}>
              <Video
                width={`responsiveWidth < 650 ? ${responsiveWidth}px : "650px"`}
                height={responsiveWidth <= 750 ? "390px" : "750px"}
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
      )
    </div>
  );
}

SectionVideosHautes.propTypes = {
  sectionInfo: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    order: PropTypes.number,
    section_type: PropTypes.string,
  }).isRequired,
};

export default SectionVideosHautes;
