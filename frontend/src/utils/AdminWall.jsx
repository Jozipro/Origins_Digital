import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";
import "../styles/index.css";

export default function AdminWall({ children }) {
  const { isAdmin } = useAuth();
  return isAdmin ? (
    children
  ) : (
    <div id="img-admin-wall">
      <h1 className="access-denied"> Accès interdit</h1>
    </div>
  );
}

AdminWall.propTypes = {
  children: PropTypes.element.isRequired,
};
