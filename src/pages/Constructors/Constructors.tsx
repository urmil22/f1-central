import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChartOutlined,
  ReloadOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Button, Spin, Statistic, Tag, Typography, notification } from "antd";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { fetchConstructorStandings } from "../../api/f1";
import "./constructors.css";

type ConstructorMeta = {
  colorCode: string;
  constructorId?: string;
  name?: string;
  nationality?: string;
};

type ConstructorStanding = {
  constructorId?: string;
  position: string;
  points: string;
  wins: string;
  Constructor: {
    constructorId?: string;
    name: string;
    nationality: string;
  };
  Constructors: ConstructorMeta[];
};

type CSSCustomProperties = CSSProperties & {
  "--team-accent"?: string;
  "--team-accent-soft"?: string;
  "--performance-ratio"?: string;
};

const Constructors = () => {
  const [standings, setStandings] = useState<ConstructorStanding[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { Title, Paragraph, Text } = Typography;

  const loadStandings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchConstructorStandings();
      setStandings(response ?? []);
    } catch {
      notification.error({
        message: "Unable to load constructor standings",
        description:
          "The latest constructor standings could not be retrieved. Please try again shortly.",
        placement: "bottomRight",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStandings().catch(() => undefined);
  }, [loadStandings]);

  const championshipYear = dayjs().format("YYYY");
  const leader = standings[0];
  const runnerUp = standings[1];

  const insights = useMemo(() => {
    if (!standings.length) {
      return {
        totalPoints: "—",
        gridDepth: 0,
        winningMargin: "—",
      };
    }

    const totalPointsValue = standings.reduce(
      (acc, team) => acc + Number.parseFloat(team.points ?? "0"),
      0,
    );

    const winningMarginValue =
      leader && runnerUp
        ? Math.max(
            Number.parseFloat(leader.points ?? "0") -
              Number.parseFloat(runnerUp.points ?? "0"),
            0,
          )
        : null;

    return {
      totalPoints: totalPointsValue.toString(),
      gridDepth: standings.length,
      winningMargin:
        winningMarginValue !== null ? winningMarginValue.toString() : "—",
    };
  }, [standings, leader, runnerUp]);

  const leaderColor = leader?.Constructors?.[0]?.colorCode ?? "#ff1e1e";

  const renderStandingsGrid = () => {
    if (isLoading) {
      return (
        <div className="constructors-section__loading">
          <Spin size="large" />
        </div>
      );
    }

    if (!standings.length) {
      return (
        <Paragraph type="secondary" className="constructors-section__empty">
          Constructor standings are currently unavailable. Return later to
          follow the battle for engineering supremacy.
        </Paragraph>
      );
    }

    const leaderPoints = Number.parseFloat(standings[0].points ?? "0");

    return (
      <div className="constructors-section__grid">
        {standings.map((team, index) => {
          const accent = team.Constructors?.[0]?.colorCode ?? "#ffffff";
          const normalizedPoints = Number.parseFloat(team.points ?? "0");
          const performanceRatio = leaderPoints
            ? Math.max(
                8,
                Math.min(
                  100,
                  Math.round((normalizedPoints / leaderPoints) * 100),
                ),
              )
            : 0;
          const wins = Number.parseInt(team.wins ?? "0", 10);
          const key =
            team.constructorId ??
            team.Constructor.constructorId ??
            team.Constructor.name;

          return (
            <motion.article
              key={`${key}-${team.position}`}
              className="constructors-card"
              style={
                {
                  "--team-accent": accent,
                  "--team-accent-soft": `${accent}33`,
                  "--performance-ratio": `${performanceRatio}%`,
                } as CSSCustomProperties
              }
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              // Faster stagger (0.04s) for constructor cards to handle ~10 teams efficiently
              transition={{ duration: 0.45, delay: index * 0.04 }}
              whileHover={{ y: -6, scale: 1.015 }}
            >
              <header className="constructors-card__header">
                <span className="constructors-card__position">
                  P{team.position}
                </span>
                <Tag color="gold" bordered={false}>
                  {team.points} pts
                </Tag>
              </header>

              <Title level={3} className="constructors-card__name">
                {team.Constructor.name}
              </Title>

              <Paragraph className="constructors-card__meta">
                {team.Constructor.nationality}
              </Paragraph>

              <div className="constructors-card__stats">
                <div className="constructors-card__stat">
                  <span className="constructors-card__stat-label">Wins</span>
                  <strong>{wins}</strong>
                </div>
                <div className="constructors-card__stat">
                  <span className="constructors-card__stat-label">
                    Points Share
                  </span>
                  <strong>{performanceRatio}%</strong>
                </div>
                <div className="constructors-card__stat">
                  <span className="constructors-card__stat-label">
                    Position
                  </span>
                  <strong>{team.position}</strong>
                </div>
              </div>

              <div className="constructors-card__performance">
                <div className="constructors-card__progress" />
              </div>

              <footer className="constructors-card__footer">
                <Text type="secondary">
                  {wins > 0
                    ? `${wins} victories secured this season.`
                    : "Hunting for their first win this year."}
                </Text>
              </footer>
            </motion.article>
          );
        })}
      </div>
    );
  };

  return (
    <div className="constructors-page">
      <section className="constructors-hero">
        <div className="constructors-hero__background" aria-hidden="true">
          <div className="constructors-hero__glow constructors-hero__glow--left" />
          <div className="constructors-hero__glow constructors-hero__glow--right" />
        </div>

        <div className="constructors-hero__content">
          <div className="constructors-hero__eyebrow">
            <Tag color="magenta">Season {championshipYear}</Tag>
            <Tag color="geekblue">Constructors Championship</Tag>
          </div>

          <Title level={1} className="constructors-hero__title">
            Engineering Supremacy on the Global Stage
          </Title>

          <Paragraph className="constructors-hero__subtitle">
            Track the relentless pursuit of performance as the world&apos;s most
            talented engineers and strategists push their machines to the limit.
            Every point counts in the race for the Constructors&apos; Crown.
          </Paragraph>

          <div className="constructors-hero__cta">
            <Button
              size="large"
              type="primary"
              icon={<ReloadOutlined />}
              loading={isLoading}
              onClick={loadStandings}
            >
              Refresh Standings
            </Button>
            <Button
              size="large"
              ghost
              href="https://www.formula1.com/en/teams.html"
              target="_blank"
              rel="noreferrer"
              icon={<TeamOutlined />}
            >
              Official Team Profiles
            </Button>
          </div>

          <div className="constructors-hero__metrics">
            <div className="constructors-hero__metric">
              <Statistic
                title="Total Championship Points"
                value={insights.totalPoints}
                prefix={<TrophyOutlined />}
              />
              <Text type="secondary">
                Combined tally across all manufacturers
              </Text>
            </div>
            <div className="constructors-hero__metric">
              <Statistic
                title="Teams in the Hunt"
                value={insights.gridDepth}
                prefix={<TeamOutlined />}
              />
              <Text type="secondary">Constructors battling for the title</Text>
            </div>
            <div className="constructors-hero__metric">
              <Statistic
                title="Leader Advantage"
                value={insights.winningMargin}
                suffix={insights.winningMargin !== "—" ? "pts" : undefined}
                prefix={<ThunderboltOutlined />}
              />
              <Text type="secondary">Gap between the top two contenders</Text>
            </div>
          </div>
        </div>

        {leader && (
          <motion.aside
            className="constructors-hero__leader"
            style={
              {
                "--team-accent": leaderColor,
                "--team-accent-soft": `${leaderColor}33`,
              } as CSSCustomProperties
            }
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <Text className="constructors-hero__leader-label" strong>
              Championship Leader
            </Text>
            <Title level={3} className="constructors-hero__leader-name">
              #{leader.position} {leader.Constructor.name}
            </Title>
            <Paragraph className="constructors-hero__leader-meta">
              {leader.points} points • {leader.wins} wins •{" "}
              {leader.Constructor.nationality}
            </Paragraph>
            <div className="constructors-hero__leader-tags">
              <Tag
                color={leaderColor}
                bordered={false}
                className="constructors-hero__leader-tag"
              >
                <BarChartOutlined /> Momentum Leader
              </Tag>
              <Tag color="gold" bordered={false}>
                <TrophyOutlined /> {leader.points} pts
              </Tag>
            </div>
          </motion.aside>
        )}
      </section>

      <section className="constructors-section">
        <div className="constructors-section__header">
          <div>
            <Title level={2}>Full Constructors Grid</Title>
            <Paragraph type="secondary">
              Explore the complete standings and see how each team stacks up
              against the competition. Hover over the cards to reveal dynamic
              highlights and performance insights.
            </Paragraph>
          </div>
          <div className="constructors-section__actions">
            <Tag color="geekblue" bordered={false}>
              {standings.length} Teams
            </Tag>
          </div>
        </div>

        {renderStandingsGrid()}
      </section>
    </div>
  );
};

export default Constructors;