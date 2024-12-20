"use client";
import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { GlobalStyles, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material";
import Form from "./Form";
const ChartColors = [
  "#4e79a7",
  "#f28e2c",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc949",
  "#af7aa1",
  "#ff9da7",
  "#9c755f",
  "#bab0ab",
];
const player_colors = {
  Langa: "#9c755f",
  Denis: "#76b7b2",
  Marciuc: "#59a14f",
  Andrei: "#f28e2c",
  Ciornei: "#af7aa1",
  Pinzariu: "#a46dc7",
  Mihnea: "#4e79a7",
  Iannis: "#edc949",
};

const player = {};

const placePoints = {
  1: 4,
  2: 2,
  3: 1,
  4: 0,
};

const dummyData = [
  {
    label: "Langa",
    data: [0, 1, 2, 3],
  },
  {
    label: "Denis",
    data: [0, 2, 3, 3],
  },
  {
    label: "Marciuc",
    data: [0, 2, 3, 3],
  },
  {
    label: "Andrei",
    data: [0, 1, 3, 3],
  },
  {
    label: "Ciornei",
    data: [0, 1, 4, 4],
  },
  {
    label: "Pinzariu",
    data: [0, 1, 4, 4],
  },
  {
    label: "Mihnea",
    data: [0, 1, 4, 4],
  },
  {
    label: "Iannis",
    data: [0, 1, 4, 4],
  },
];

function BasicLineChart() {
  const [chartData, setChartData] = useState({
    xAxis: [],
    series: [],
  });
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const response = await fetch(
        "https://mario-party-leader-board-d4vm.vercel.app/submissions"
      );
      const data = await response.json();
      setGames(data); // Assuming `players` is your state variable
    };
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (games.length === 0) return;

    // Initialize player scores
    const playerScores = {};
    const allPlayers = new Set();

    // Collect players and initialize their scores
    games.forEach((submission) =>
      submission.games.forEach(({ players }) =>
        players.forEach((player) => {
          allPlayers.add(player);
          if (!playerScores[player]) playerScores[player] = [0];
        })
      )
    );

    // Update scores for each game
    games.forEach((submission, gameIndex) => {
      const scoreUpdate = { ...playerScores };

      submission.games.forEach(({ place, players, bonus }) => {
        const points = placePoints[place] + bonus;

        players.forEach((player) => {
          const previousScore =
            scoreUpdate[player][scoreUpdate[player].length - 1] || 0;
          scoreUpdate[player].push(previousScore + points);
        });
      });

      // Add the current game’s scores for players who didn't participate
      for (const player of allPlayers) {
        if (scoreUpdate[player].length <= gameIndex + 1) {
          const previousScore =
            scoreUpdate[player][scoreUpdate[player].length - 1] || 0;
          scoreUpdate[player].push(previousScore);
        }
      }

      Object.assign(playerScores, scoreUpdate);
    });

    // Transform the scores into chart data
    const xAxis = Array.from(
      {
        length: Math.max(
          ...Object.values(playerScores).map((arr) => arr.length)
        ),
      },
      (_, i) => i + 1
    );
    const series = Object.entries(playerScores)
      .map(([player, scores], index) => ({
        label: player,
        data: scores,
        color: ChartColors[index % ChartColors.length],
        curve: "normal",
        totalPoints: scores[scores.length - 1], // Final score for sorting
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints); // Sort by total points in descending order

    setChartData({ xAxis: [{ data: xAxis }], series });
  }, [games]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div
        style={{
          width: "90vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LineChart
          xAxis={chartData.xAxis.data}
          yAxis={chartData.series.data}
          series={chartData.series}
          width={innerWidth}
          height={innerHeight}
          grid={{ vertical: true, horizontal: true }}
          slotProps={{
            legend: {
              labelStyle: {
                fontSize: "1.2em",
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures this runs only on the client.
  }, []);

  const theme = createTheme({
    components: {
      MuiChart: {
        styleOverrides: {
          root: {
            backgroundColor: "#0f1214",
            color: "white",
          },
        },
      },
    },
    typography: {
      fontFamily: "Arial",
      allVariants: {
        color: "#0f1214", // Change all text to white
      },
    },
  });

  return (
    <>
      <h1
        style={{
          fontFamily: "Arial",
          alignItems: "center",
          //center this header
          textAlign: "center",
        }}
      >
        Marciuc Party
      </h1>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {isClient && <BasicLineChart />}
      </ThemeProvider>

      <Form />
    </>
  );
}
