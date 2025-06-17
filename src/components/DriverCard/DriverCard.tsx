import { Typography } from "antd";
import { motion } from "framer-motion";

type DriverCardProps = {
    name: string;
    position: string;
    points: string;
    constructor_name: string;
    wins: string;
    nationality: string;
    colorCode: string;
};

const DriverCard = ({ name, position, points, wins, nationality, constructor_name, colorCode }: DriverCardProps) => {

    const { Title } = Typography;

    return (
        <motion.div
            className="driver-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.03 }}
            style={{ borderLeft: `5px solid ${colorCode}` }}
        >
            <div>
                <Title level={3} >
                    #{position} {name}
                </Title>
                <Title level={4}>{constructor_name}</Title>
                <Title level={5}>🌍 {nationality}</Title>
            </div>
            <div>
                <Title level={4}>🏁 {points} points · 🏆 {wins} wins</Title>
            </div>
        </motion.div>
    );
};

export default DriverCard;
