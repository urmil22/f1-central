import { useEffect, useMemo, useState } from "react";
import {
  CrownOutlined,
  FireOutlined,
  GlobalOutlined,
  ReloadOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Button, Spin, Statistic, Tag, Typography, notification } from "antd";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { fetchDriverStandings } from "../../api/f1";
import DriverCard from "../../components/DriverCard/DriverCard";
import "./drivers.css";

type ConstructorInfo = {
  colorCode: string;
  name: string;
};

type DriverInfo = {
  givenName: string;
  familyName: string;
  nationality: string;
  permanentNumber?: string;
  driverId?: string;
};

type DriverStanding = {
  position: string;
  points: string;
  wins: string;
  Driver: DriverInfo;
  Constructors: ConstructorInfo[];
};

const Drivers = () => {
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { Title, Paragraph, Text } = Typography;

  const loadStandings = async () => {
    setIsLoading(true);
    try {
      const response = await fetchDriverStandings();
      setDriverStandings(response ?? []);
    } catch {
      notification.error({
        message: "Unable to load standings",
        description:
          "We couldn’t retrieve the latest driver standings. Please check back in a moment.",
        placement: "bottomRight",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStandings().catch(() => undefined);
  }, []);

  const leader = driverStandings[0];
  const runnerUp = driverStandings[1];

  const championshipInsights = useMemo(() => {
    if (!driverStandings.length) {
      return {
        totalWins: "—",
        nationalities: 0,
        leadGap: "—",
        seasonYear: dayjs().format("YYYY"),
      };
    }

    const totalWins = driverStandings
      .reduce((acc, item) => acc + Number.parseInt(item.wins, 10), 0)
      .toString();

    const nationalities = new Set(
      driverStandings.map((item) => item.Driver.nationality),
    ).size;

    const leadGap =
      leader && runnerUp
        ? (Number(leader.points) - Number(runnerUp.points)).toString()
        : "—";

    return {
      totalWins,
      nationalities,
      leadGap,
      seasonYear: dayjs().format("YYYY"),
    };
  }, [driverStandings, leader, runnerUp]);

  return (
    <div className="drivers-page">
      <section className="drivers-hero">
        <div className="drivers-hero__background" aria-hidden="true">
          <div className="drivers-hero__glow drivers-hero__glow--left" />
          <div className="drivers-hero__glow drivers-hero__glow--right" />
        </div>

        <div className="drivers-hero__content">
          <div className="drivers-hero__eyebrow">
            <Tag color="volcano">Season {championshipInsights.seasonYear}</Tag>
            <Tag color="geekblue">World Championship Standings</Tag>
          </div>

          <Title level={1} className="drivers-hero__title">
            The Pinnacle of Driving Excellence
          </Title>

          <Paragraph className="drivers-hero__subtitle">
            Track every overtake, podium, and championship point with a rich
            dashboard dedicated to this season&apos;s fiercest competitors.
          </Paragraph>

          <div className="drivers-hero__cta">
            <Button
              size="large"
              type="primary"
              icon={<ReloadOutlined />}
              onClick={loadStandings}
            >
              Refresh Standings
            </Button>
            <Button
              size="large"
              ghost
              href="https://www.formula1.com/en/drivers.html"
              target="_blank"
              rel="noreferrer"
            >
              Official Driver Profiles
            </Button>
          </div>

          <div className="drivers-hero__metrics">
            <div className="drivers-hero__metric">
              <Statistic
                title="Leader's Advantage"
                value={championshipInsights.leadGap}
                suffix={
                  championshipInsights.leadGap !== "—" ? "pts" : undefined
                }
                prefix={<CrownOutlined />}
              />
              <Text type="secondary">Gap between P1 and P2</Text>
            </div>
            <div className="drivers-hero__metric">
              <Statistic
                title="Total Wins So Far"
                value={championshipInsights.totalWins}
                prefix={<TrophyOutlined />}
              />
              <Text type="secondary">Season victories across the grid</Text>
            </div>
            <div className="drivers-hero__metric">
              <Statistic
                title="Nationalities Represented"
                value={championshipInsights.nationalities}
                prefix={<GlobalOutlined />}
              />
              <Text type="secondary">A truly global championship</Text>
            </div>
          </div>
        </div>

        {leader && (
          <motion.aside
            className="drivers-hero__leader"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Text className="drivers-hero__leader-label" strong>
              Championship Leader
            </Text>
            <Title level={3} className="drivers-hero__leader-name">
              #{leader.position} {leader.Driver.givenName}{" "}
              {leader.Driver.familyName}
            </Title>
            <Paragraph className="drivers-hero__leader-meta">
              {leader.Constructors[0]?.name} • {leader.points} pts •{" "}
              {leader.wins} wins
            </Paragraph>
            <div className="drivers-hero__leader-tags">
              <Tag
                color={leader.Constructors[0]?.colorCode ?? "magenta"}
                className="drivers-hero__leader-constructor"
                bordered={false}
              >
                <FireOutlined /> {leader.Constructors[0]?.name ?? "Constructor"}
              </Tag>
              <Tag color="magenta" bordered={false}>
                {leader.Driver.nationality}
              </Tag>
            </div>
          </motion.aside>
        )}
      </section>

      <section className="drivers-section">
        <div className="drivers-section__header">
          <div>
            <Title level={2}>Full Championship Grid</Title>
            <Paragraph type="secondary">
              Dive into detailed statistics for every driver competing for this
              year&apos;s title. Hover over each card to reveal enriched
              insights.
            </Paragraph>
          </div>
          <div className="drivers-section__actions">
            <Tag color="gold" bordered={false}>
              <TrophyOutlined /> {driverStandings.length} Drivers
            </Tag>
          </div>
        </div>

        {isLoading ? (
          <div className="drivers-section__loading">
            <Spin size="large" />
          </div>
        ) : driverStandings.length ? (
          <div className="drivers-section__grid">
            {driverStandings.map((standing) => {
              const { Driver, Constructors, position, points, wins } = standing;
              const constructor = Constructors[0];

              return (
                <DriverCard
                  key={Driver.driverId ?? `${Driver.givenName}-${Driver.familyName}-${position}`}
                  name={`${Driver.givenName} ${Driver.familyName}`}
                  position={position}
                  points={points}
                  wins={wins}
                  nationality={Driver.nationality}
                  constructor_name={constructor?.name ?? "Constructor"}
                  colorCode={constructor?.colorCode ?? "#ffffff"}
                />
              );
            })}
          </div>
        ) : (
          <Paragraph type="secondary" className="drivers-section__empty">
            Driver standings are currently unavailable. Please return later for
            updated information straight from the paddock.
          </Paragraph>
        )}
      </section>
    </div>
  );
};

export default Drivers;
