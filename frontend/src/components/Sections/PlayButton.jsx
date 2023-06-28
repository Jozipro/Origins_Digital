import React from "react";
import PropTypes from "prop-types";

function PlayButton({ handleToggleVideo }) {
  return (
    <button type="submit" onClick={handleToggleVideo}>
      Visionner
    </button>
  );
}

PlayButton.propTypes = {
  handleToggleVideo: PropTypes.func.isRequired,
};
export default PlayButton;
