import { Typography } from "antd";
import { motion } from "framer-motion";
// import Timer from "./Timer/Timer";


const RaceCard = ({ race }: { race: any; }) => {
    // const upcomingRaceTimer = new Date(`${race.date}T${race.time}`);
    // console.log('race', race);

    const { Title } = Typography;

    return (
        <motion.div
            className="race-card"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Title level={3}>{race.raceName}</Title>
            <Title level={4}>{race.Circuit.circuitName}</Title>
            <Title level={5} type="secondary">
                {race.date} – {race.Circuit.Location.locality}, {race.Circuit.Location.country}
            </Title>
            {/* <Timer
                targetDate={upcomingRaceTimer}
            /> */}
        </motion.div>
    );
};

export default RaceCard;
