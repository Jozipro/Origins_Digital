import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../../styles/index.css";
import { useAuth } from "../../context/AuthContext";
import useAPI from "../../api/useAPI";
import AccountMenu2 from "../dashbord/AccountMenu2";

export default function AdminPanel() {
  const { userInfo, setSuccess, success, setIsAdmin, reset } = useAuth();
  const api = useAPI();
  const navigate = useNavigate();

  const handleLogOut = () => {
    delete api.defaults.headers.authorization;
    setSuccess(!success);

    setIsAdmin(false);
    navigate("/connexion");
  };

  return (
    <div className="admin-pannel">
      <div className="display-nav-admin">
        <h1>Panneau d'administration</h1>
      </div>
      <div className="display-nav-admin2">
        <div>
          <div className="user-connected">
            <AccountMenu2 userInfo={userInfo} reset={reset} />
            <p> Admin : {userInfo.name}</p>
            <p> {userInfo.email}</p>
            <button type="button" onClick={handleLogOut}>
              DECONNEXION
            </button>
          </div>
          <ul>
            <li>
              <Link to="/adminPanel/usersTable">Utilisateurs</Link>
            </li>
            <li>
              <Link to="/adminPanel/videosTable">Videos</Link>
            </li>
            <li>
              <Link to="/adminPanel/sectionsTable">Sections</Link>
            </li>
            <li>
              <Link to="/adminPanel/AdvertsTable">Pub</Link>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <Outlet name="adminPanel" />
      </div>
    </div>
  );
}
