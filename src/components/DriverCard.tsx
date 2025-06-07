import { Typography } from "antd";
import { motion } from "framer-motion";
// import "../styles/global.css";

type DriverCardProps = {
    name: string;
    position: string;
    points: string;
    constructor_name: string;
    wins: string;
    nationality: string;
};

const DriverCard = ({ name, position, points, wins, nationality, constructor_name }: DriverCardProps) => {

    return (
        <motion.div
            className="card driver-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.03 }}
        >
            <Typography.Title level={3} >
                {position === '1' ? "👑" : `#${position}`} {name}
            </Typography.Title>
            <Typography.Title level={4}>{constructor_name}</Typography.Title>
            <Typography.Paragraph>🏁 {points} pts · 🏆 {wins} wins</Typography.Paragraph>
            <Typography.Paragraph>🌍 {nationality}</Typography.Paragraph>
        </motion.div>
    );
};

export default DriverCard;
