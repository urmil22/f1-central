import { Typography } from "antd";
import './footer.css';

const Footer = () => {

  const { Text } = Typography;

  return (
    <footer className="footer">
      <Text className="footer-text" strong>Made with ❤️ by Urmil Bhavsar</Text>
      <Text className="footer-text" underline>
        This project/website is unofficial and is not associated in any way with the Formula 1 companies. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP AND GRAND PRIX.
      </Text>
    </footer>
  );
};

export default Footer;