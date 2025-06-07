import { motion } from "framer-motion";
import { Typography } from "antd";

const HeroBanner = () => {
    return (
        <motion.div
            className="hero"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.03 }}
        >
            <Typography.Title level={1}>F1 Central</Typography.Title>
        </motion.div>
    );
};

export default HeroBanner;
