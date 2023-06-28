import "../../styles/index.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import useAPI from "../../api/useAPI";

export default function Header() {
  const api = useAPI();
  const navigate = useNavigate();
  const { success, isAdmin, reset } = useAuth();
  const [isSearchClosed, setIsSearchClosed] = useState(false);
  const [textSearch, setTextSearch] = useState("");
  const [allVideos, setAllVideos] = useState();

  useEffect(() => {
    api.get("videos").then((res) => setAllVideos(res.data));
  }, []);

  const filteredVideos = allVideos?.filter((item) =>
    item.title.includes(textSearch)
  );

  const checkboxRef = useRef();

  function expand() {
    setIsSearchClosed(!isSearchClosed);
    setTextSearch("");
  }

  function handleLinkClick() {
    checkboxRef.current.checked = false;
    setTextSearch("");
  }

  function handleVideoLinkClick() {
    checkboxRef.current.checked = false;
    setTextSearch("");
    setIsSearchClosed(!isSearchClosed);
  }

  const logout = () => {
    reset();
    handleLinkClick();
    navigate("/connexion");
  };

  return (
    <div id="nav-body">
      <nav>
        <div className="navbar">
          <div className="container nav-container">
            <input
              className="checkbox"
              type="checkbox"
              name=""
              id=""
              ref={checkboxRef}
            />
            <div className="hamburger-lines">
              <span className="line line1" />
              <span className="line line2" />
              <span className="line line3" />
            </div>
            <form id="content">
              <input
                type="text"
                name="input"
                value={textSearch}
                onChange={(e) => setTextSearch(e.target.value)}
                className={`input ${isSearchClosed ? "square" : ""}`}
              />
              <ul className="all-video">
                {textSearch &&
                  filteredVideos?.map((video, index) => (
                    <Link
                      to={`/video_description/${video.id}`}
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      onClick={() => handleVideoLinkClick()}
                    >
                      <li
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        className="video-list"
                        id="video-list-{video.id}"
                      >
                        {video.title}
                      </li>
                    </Link>
                  ))}
              </ul>

              <button
                type="button"
                className={`search ${isSearchClosed ? "close" : ""}`}
                onClick={expand}
                aria-label="search"
              />
            </form>
            <div className="menu-items">
              <li>
                <Link to="/" onClick={() => handleLinkClick()}>
                  Accueil
                </Link>
              </li>
              {success ? (
                <li>
                  <Link to="/connexion" onClick={() => handleLinkClick()}>
                    Connexion
                  </Link>
                </li>
              ) : (
                <li>
                  <Link to="/profile" onClick={() => handleLinkClick()}>
                    Mon Profil
                  </Link>
                </li>
              )}
              <li>
                <Link to="/aboutPage" onClick={() => handleLinkClick()}>
                  A Propos
                </Link>
              </li>
              <li>
                <Link to="/Contact" onClick={() => handleLinkClick()}>
                  Contact
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link to="/adminPanel/" onClick={() => handleLinkClick()}>
                    Administrateur
                  </Link>
                </li>
              )}
              {!success && (
                <button className="user-button" type="button" onClick={logout}>
                  Déconnexion
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
