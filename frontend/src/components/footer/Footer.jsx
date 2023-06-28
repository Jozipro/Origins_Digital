import { Link } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import logo from "../../assets/favicon.png";
import "../../styles/index.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer_container">
        <div className="footer_brand_logo">
          <img src={logo} alt="logo" className="footer_logo" />
        </div>
        <div className="footer_brand_text">
          <ul className="footer_list">
            <li>
              <Link
                component="a"
                href="/legal-conditions"
                underline="none"
                color="inherit"
              >
                Mentions légales | CGU | Politique de confidentialité
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer_socials">
          <a href="https://www.facebook.com" className="footer_link">
            <FacebookIcon />
          </a>
          <a href="https://www.instagram.com" className="footer_link">
            <InstagramIcon />
          </a>
          <a href="https://www.twitter.com" className="footer_link">
            <TwitterIcon />
          </a>
          <a href="https://www.youtube.com" className="footer_link">
            <YouTubeIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
