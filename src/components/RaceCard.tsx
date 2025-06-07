import { Typography } from "antd";
import { motion } from "framer-motion";
import { Statistic } from "antd";
import 'antd/dist/reset.css';

const { Timer } = Statistic;

const RaceCard = ({ race }: { race: any; }) => {
    const upcomingRaceTimer = new Date(`${race.date}T${race.time}`);
    // console.log('first');
    return (
        <motion.div
            className="card"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Typography.Title level={3}>{race.raceName}</Typography.Title>
            <Typography.Paragraph>{race.Circuit.circuitName}</Typography.Paragraph>
            <Typography.Paragraph>
                {race.date} – {race.Circuit.Location.locality}, {race.Circuit.Location.country}
            </Typography.Paragraph>
            <Timer
                // title='days hours minutes seconds'
                format="D HH:mm:ss"
                value={upcomingRaceTimer.getTime()}
                type="countdown"
                className="race-timer"
                rootClassName="race-timer"
            />
            <div className="timer-labels">
                <Typography.Paragraph>
                    days
                </Typography.Paragraph>
                <Typography.Paragraph>
                    hours
                </Typography.Paragraph>
                <Typography.Paragraph>
                    minutes
                </Typography.Paragraph>
                <Typography.Paragraph>
                    seconds
                </Typography.Paragraph>
            </div>
        </motion.div>
    );
};

export default RaceCard;
