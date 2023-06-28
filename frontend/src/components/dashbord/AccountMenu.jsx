import React from "react";
import { Link, Outlet } from "react-router-dom";
import PropTypes, { number } from "prop-types";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import EditIcon from "@mui/icons-material/Edit";
import VideoSettingsIcon from "@mui/icons-material/VideoSettings";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import HomeIcon from "@mui/icons-material/Home";
import dashbordStyles from "./dashbord";
import profilImageFirst from "../../assets/profilDefault3.svg.png";

export default function AccountMenu({ userInfo, reset }) {
  const logout = () => {
    reset();
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const userConnected = Boolean(userInfo?.email);

  return userConnected ? (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          color: "white",
        }}
      >
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              alt="Image de l'utilisateur"
              src={
                userInfo.avatar
                  ? `${import.meta.env.VITE_APP_API_URL}${userInfo.avatar}`
                  : profilImageFirst
              }
              sx={{ width: 100, height: 100 }}
            />
          </IconButton>
        </Tooltip>
        <h2
          className="user-profil-name"
          style={{ color: "#10bcdd", margin: "1%" }}
        >
          {userInfo.name}
        </h2>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            bgcolor: "#10bcdd",
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "black",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          sx={dashbordStyles}
          component={Link}
          state={{ userInfo }}
          to="/profile/userid"
          onClick={handleClose}
        >
          <Avatar
            alt="Image de l'utilisateur"
            src={
              userInfo.avatar
                ? `${import.meta.env.VITE_APP_API_URL}${userInfo.avatar}`
                : profilImageFirst
            }
          />
          Informations
        </MenuItem>
        <MenuItem
          sx={dashbordStyles}
          component={Link}
          state={{ userInfo }}
          to="/"
          onClick={handleClose}
        >
          <HomeIcon sx={{ margin: "5%" }} /> Accueil
        </MenuItem>
        <MenuItem
          sx={dashbordStyles}
          component={Link}
          state={{ userInfo }}
          to="/profile/userfavorite"
          onClick={handleClose}
        >
          <VideoSettingsIcon sx={{ margin: "5%" }} /> Mes Videos
        </MenuItem>
        <Divider />
        <MenuItem
          sx={dashbordStyles}
          component={Link}
          state={{ userInfo }}
          onClick={handleClose}
          to="/profile/useredit"
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Editer Profil
        </MenuItem>
        <MenuItem
          sx={dashbordStyles}
          component={Link}
          state={{ userInfo }}
          to="/profile/aboedit"
          onClick={handleClose}
        >
          <ListItemIcon>
            <AdminPanelSettingsIcon fontSize="small" />
          </ListItemIcon>
          Abonnement
        </MenuItem>
        <MenuItem sx={dashbordStyles} to="/Contact" onClick={handleClose}>
          <ListItemIcon>
            <SupportAgentIcon fontSize="small" />
          </ListItemIcon>
          Contact
        </MenuItem>
        <MenuItem
          component={Link}
          to="/aboutPage"
          sx={dashbordStyles}
          onClick={handleClose}
        >
          <ListItemIcon>
            <ContactSupportIcon fontSize="small" />
          </ListItemIcon>
          A propos
        </MenuItem>
        <MenuItem sx={dashbordStyles} onClick={(handleClose, logout)}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Déconnexion
        </MenuItem>
      </Menu>
      <div className="div-savoir-tu-esqui">
        <Outlet name="accountDisplay" />
      </div>
    </>
  ) : (
    <div className="veuillez-vous-log">
      <p>Veuillez vous connecter</p>
      <Link to="/connexion" style={{ color: "white" }}>
        Connexion
      </Link>
    </div>
  );
}

AccountMenu.propTypes = {
  userInfo: PropTypes.shape({
    name: PropTypes.string,
    firstname: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    isVideoPlus: PropTypes.number,
  }),
  reset: PropTypes.func,
};
AccountMenu.defaultProps = {
  userInfo: {
    name: "",
    firstname: "",
    email: "",
    avatar: "",
    isVideoPlus: number,
  },
  reset: () => {},
};
