import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const PlayerStats = () => {
  const [playerStats, setPlayerStats] = useState([]);
  useEffect(() => {
    // Fetch player statistics from the backend
    fetch("http://mario-party-leader-board-d4vm.vercel.app/player-stats")
      .then((response) => response.json())
      .then((data) => setPlayerStats(data))
      .catch((error) => console.error("Error fetching player stats:", error));
  }, []);
  return <PlayerStatsTable playerStats={playerStats} />;
};

const PlayerStatsTable = ({ playerStats }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Player</TableCell>
            <TableCell>Total Points</TableCell>
            <TableCell>Games Played</TableCell>
            <TableCell>Average Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {playerStats.map((player) => (
            <TableRow key={player.player}>
              <TableCell>{player.player}</TableCell>
              <TableCell>{player.totalPoints}</TableCell>
              <TableCell>{player.gamesPlayed}</TableCell>
              <TableCell>{player.averagePoints.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PlayerStats;
