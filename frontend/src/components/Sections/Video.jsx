import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import "../../styles/index.css";
import { useAuth } from "../../context/AuthContext";
import PlayButton from "./PlayButton";
import videoLock from "../../assets/connect.png";
import HotPot from "../../assets/cadenat.jpeg";

function Video({
  title,
  width,
  height,
  displayPlayButton,
  displayDescription,
  displayDescriptionText,
  displayDescriptionTitle,
  isEnabled,
  src,
  isVideoPremium,
  isVideoPaying,
  controls,
  setDuration,
}) {
  const { userInfo } = useAuth();
  const videoRef = useRef(null);
  if (!userInfo?.isPremium) userInfo.isPremium = 0;

  const handleLoadedMetadata = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      setDuration(videoElement.duration);
    }
  };

  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggleVideo = () => {
    const video = videoRef.current;

    if (video.paused) {
      const videoPromise = video.play();
      if (videoPromise !== undefined) {
        videoPromise.catch((error) => {
          console.error(error);
        });
      }
      setIsPlaying(!isPlaying);
    } else {
      video.pause();
      setIsPlaying(isPlaying);
    }
  };

  let posterImage = null;
  if ((!userInfo || userInfo.isPremium === 0) && isVideoPremium === 1) {
    posterImage = videoLock;
  } else if (userInfo.isVideoPlus === 0 && isVideoPaying === 1) {
    posterImage = HotPot;
  }

  return (
    <div className="wrapper-video">
      <video
        ref={videoRef}
        onLoadedMetadata={handleLoadedMetadata}
        src={src}
        controls={controls}
        poster={posterImage}
        muted
        preload="metadata"
        style={{ width, height }}
        onMouseOver={
          (isEnabled &&
            (!userInfo || userInfo.isPremium === 0) &&
            isVideoPremium === 1) ||
          (userInfo.isVideoPlus === 0 && isVideoPaying === 1)
            ? null
            : handleToggleVideo
        }
        onFocus={
          (isEnabled &&
            (!userInfo || userInfo.isPremium === 0) &&
            isVideoPremium === 1) ||
          (userInfo.isVideoPlus === 0 && isVideoPaying === 1)
            ? null
            : handleToggleVideo
        }
      >
        {" "}
        <track kind="captions" src="path/to/captions.vtt" label="Captions" />
      </video>
      <h3 className="video-title">{title}</h3>
      {displayPlayButton && (
        <PlayButton handleToggleVideo={handleToggleVideo} />
      )}
      {displayDescription && (
        <div className="description-video-wrapper">
          <h4 className="description-title">{displayDescriptionTitle}</h4>
          <p className="description-text">{displayDescriptionText}</p>
        </div>
      )}
    </div>
  );
}
Video.propTypes = {
  title: PropTypes.string,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  displayPlayButton: PropTypes.bool,
  displayDescription: PropTypes.bool,
  displayDescriptionText: PropTypes.string,
  displayDescriptionTitle: PropTypes.string,
  isEnabled: PropTypes.bool,
  isVideoPremium: PropTypes.number,
  isVideoPaying: PropTypes.number,
  controls: PropTypes.bool,
  setDuration: PropTypes.func,
};

Video.defaultProps = {
  title: "",
  displayPlayButton: false,
  displayDescription: false,
  displayDescriptionText: "",
  displayDescriptionTitle: "",
  isEnabled: false,
  isVideoPremium: undefined,
  isVideoPaying: undefined,
  controls: false,
  setDuration: () => {},
};
export default Video;
