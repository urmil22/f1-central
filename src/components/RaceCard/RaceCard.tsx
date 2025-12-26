import dayjs from "dayjs";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  FieldTimeOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Divider, Tag, Typography } from "antd";
import { motion } from "framer-motion";
import Timer from "../Timer/Timer";
import "./race-card.css";

type RaceLocation = {
  locality: string;
  country: string;
};

type RaceCircuit = {
  circuitName: string;
  Location: RaceLocation;
};

type Race = {
  season: string;
  round: string;
  raceName: string;
  date: string;
  time?: string;
  Circuit: RaceCircuit;
  url?: string;
};

type RaceCardProps = {
  race: Race;
  animationDelay?: number;
};

const RaceCard = ({ race, animationDelay = 0 }: RaceCardProps) => {
  const { Title, Text } = Typography;

  const location = race?.Circuit?.Location;
  const formattedLocation = location
    ? `${location.locality}, ${location.country}`
    : "Location to be confirmed";

  const isoDateTime = race.time
    ? race.time.includes("Z")
      ? `${race.date}T${race.time}`
      : `${race.date}T${race.time}Z`
    : undefined;

  const eventDate = isoDateTime ? dayjs(isoDateTime) : null;
  const fallbackDate = dayjs(race.date);
  const formattedDate = eventDate?.isValid()
    ? eventDate.format("ddd, MMM D YYYY")
    : fallbackDate.isValid()
      ? fallbackDate.format("ddd, MMM D YYYY")
      : race.date;
  const formattedTime = eventDate?.isValid()
    ? eventDate.format("HH:mm")
    : "TBD";

  const localTimeZoneLabel =
    new Intl.DateTimeFormat(undefined, {
      timeZoneName: "short",
    })
      .formatToParts(new Date())
      .find((part) => part.type === "timeZoneName")?.value ?? "Local Time";

  const championshipTag = `Round ${race.round}`;
  const seasonTag = `Season ${race.season}`;

  return (
    <motion.article
      className="race-card race-card--premium"
      whileHover={{ y: -6, scale: 1.02 }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: animationDelay }}
    >
      <header className="race-card__header">
        <div className="race-card__tags">
          <Tag color="volcano">{championshipTag}</Tag>
          <Tag color="geekblue">{seasonTag}</Tag>
        </div>

        <Title level={3} className="race-card__title">
          {race.raceName}
        </Title>
        <Text type="secondary" className="race-card__subtitle">
          {race.Circuit?.circuitName ?? "Circuit TBA"}
        </Text>
      </header>

      <div className="race-card__meta">
        <div className="race-card__meta-item">
          <CalendarOutlined />
          <div className="race-card__meta-copy">
            <Text type="secondary">Event Date</Text>
            <Text strong>{formattedDate}</Text>
          </div>
        </div>
        <div className="race-card__meta-item">
          <FieldTimeOutlined />
          <div className="race-card__meta-copy">
            <Text type="secondary">{localTimeZoneLabel}</Text>
            <Text strong>{formattedTime}</Text>
          </div>
        </div>
        <div className="race-card__meta-item">
          <EnvironmentOutlined />
          <div className="race-card__meta-copy">
            <Text type="secondary">Grand Prix Venue</Text>
            <Text strong>{formattedLocation}</Text>
          </div>
        </div>
      </div>

      <Divider className="race-card__divider" />

      <section className="race-card__countdown">
        <Title level={5} className="race-card__countdown-title">
          <TrophyOutlined /> Countdown to lights out
        </Title>
        <Timer utcDateTime={isoDateTime} label="Lights out in" />
      </section>

      {race.url && (
        <footer className="race-card__footer">
          <a
            className="race-card__link"
            href={race.url}
            target="_blank"
            rel="noreferrer"
          >
            Official event guide ↗
          </a>
        </footer>
      )}
    </motion.article>
  );
};

export default RaceCard;
