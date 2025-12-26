import { TrophyOutlined, FlagOutlined } from "@ant-design/icons";
import { Typography, Tag } from "antd";
import { motion } from "framer-motion";
import "./driver-card.css";

type DriverCardProps = {
  name: string;
  position: string;
  points: string;
  constructor_name: string;
  wins: string;
  nationality: string;
  colorCode: string;
};

const DriverCard = ({
  name,
  position,
  points,
  wins,
  nationality,
  constructor_name,
  colorCode,
}: DriverCardProps) => {
  const { Title, Text } = Typography;
  const numericPosition = Number.parseInt(position, 10);

  return (
    <motion.article
      className="driver-card driver-card--premium"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div
        className="driver-card__accent"
        style={{
          background: `linear-gradient(135deg, ${colorCode}, rgba(255,255,255,0.15))`,
        }}
      />

      <header className="driver-card__header">
        <div className="driver-card__position">
          <span className="driver-card__position-index">#{position}</span>
          {numericPosition === 1 && (
            <Tag
              color="gold"
              className="driver-card__position-tag"
              bordered={false}
            >
              Championship Leader
            </Tag>
          )}
        </div>

        <Title level={3} className="driver-card__name">
          {name}
        </Title>
        <div className="driver-card__meta">
          <Tag
            className="driver-card__constructor"
            style={{ borderColor: colorCode, color: colorCode }}
          >
            {constructor_name}
          </Tag>
          <Tag
            color="magenta"
            className="driver-card__nationality"
            bordered={false}
          >
            <FlagOutlined /> {nationality}
          </Tag>
        </div>
      </header>

      <section className="driver-card__stats">
        <div className="driver-card__stat">
          <span className="driver-card__stat-label">Points</span>
          <span className="driver-card__stat-value">{points}</span>
          <Text type="secondary" className="driver-card__stat-caption">
            Consistency across the season
          </Text>
        </div>
        <div className="driver-card__stat driver-card__stat--highlight">
          <span className="driver-card__stat-label">
            <TrophyOutlined /> Wins
          </span>
          <span className="driver-card__stat-value">{wins}</span>
          <Text type="secondary" className="driver-card__stat-caption">
            Victories secured so far
          </Text>
        </div>
      </section>
    </motion.article>
  );
};

export default DriverCard;
