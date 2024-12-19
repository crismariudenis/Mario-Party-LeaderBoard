import React, { useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Button,
  Select,
  OutlinedInput,
  Chip,
  ThemeProvider,
  createTheme,
} from "@mui/material";

const players = [
  { label: "Langa" },
  { label: "Denis" },
  { label: "Marciuc" },
  { label: "Andrei" },
  { label: "Ciornei" },
  { label: "Pinzariu" },
  { label: "Mihnea" },
  { label: "Iannis" },
];

// Custom theme
const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000000",
    },
    text: {
      primary: "#ffffff",
    },
  },
});

export default function Form() {
  const [formData, setFormData] = useState([
    { place: 1, players: [], bonus: 0 },
    { place: 2, players: [], bonus: 0 },
    { place: 3, players: [], bonus: 0 },
    { place: 4, players: [], bonus: 0 },
  ]);

  const handleChange = (index, field, value) => {
    const updatedFormData = [...formData];
    updatedFormData[index][field] = value;
    setFormData(updatedFormData);
  };

  const handleSubmit = async () => {
    console.log("Form Data:", formData);

    // Send the form data to the backend
    const response = await fetch(
      "https://mario-party-leader-board-d4vm.vercel.app/submissions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ games: formData }),
      }
    );

    if (response.ok) {
      console.log("Submission saved!");
      // Reset the form after submission
      setFormData([
        { place: 1, players: [], bonus: 0 },
        { place: 2, players: [], bonus: 0 },
        { place: 3, players: [], bonus: 0 },
        { place: 4, players: [], bonus: 0 },
      ]);
    } else {
      console.error("Failed to save submission.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      sx={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {formData.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <Typography sx={{ color: "black", minWidth: "100px" }}>
            {item.place}
          </Typography>
          <Select
            multiple
            value={item.players}
            onChange={(e) => handleChange(index, "players", e.target.value)}
            input={<OutlinedInput label="Players" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    sx={{
                      backgroundColor: "#f0f0f0",
                      color: "black",
                      border: "1px solid #000000",
                    }}
                  />
                ))}
              </Box>
            )}
            sx={{
              width: "400px",
              "& .MuiInputLabel-root": { color: "black" },
              "& .MuiOutlinedInput-root": {
                color: "black",
                "& fieldset": {
                  borderColor: "black",
                },
              },
              "&:hover .MuiOutlinedInput-root fieldset": {
                borderColor: "#555555",
              },
            }}
          >
            {players.map((player) => (
              <MenuItem key={player.label} value={player.label}>
                {player.label}
              </MenuItem>
            ))}
          </Select>
          <OutlinedInput
            type="number"
            placeholder="Bonus Points"
            value={item.bonus}
            onChange={(e) => handleChange(index, "bonus", e.target.value)}
            sx={{
              width: "150px",
              color: "black",
              "& fieldset": {
                borderColor: "black",
              },
              "&:hover fieldset": {
                borderColor: "#555555",
              },
            }}
          />
        </Box>
      ))}
      <Button
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: "black",
          color: "white",
          "&:hover": { backgroundColor: "#333333" },
        }}
      >
        Submit
      </Button>
    </Box>
  );
}
