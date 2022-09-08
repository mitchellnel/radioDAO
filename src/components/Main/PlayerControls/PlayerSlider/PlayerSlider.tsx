import React, { useState } from "react";

import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

const TinyText = styled(Typography)({
  fontSize: "1rem",
  opacity: 0.75,
  fontWeight: 500,
  letterSpacing: 0.2,
});

interface PlayerSliderProps {
  currentTime: number;
  onTimeUpdate: Function;
}

function PlayerSlider({ currentTime, onTimeUpdate }: PlayerSliderProps) {
  const duration = 244; // seconds

  const [position, setPosition] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(false);

  function formatDuration(value: number) {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }

  const handleSliderChange = (_: any, value: number) => {
    setPosition(value as number);
    onTimeUpdate(value as number);
  };

  return (
    <div>
      <Slider
        aria-label="timestamp"
        size="small"
        color="secondary"
        value={position}
        min={0}
        max={duration}
        step={1}
        onChange={(_, value) => handleSliderChange(_, value as number)}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: -2,
        }}
      >
        <TinyText sx={{ color: "secondary.main" }}>
          {formatDuration(position)}
        </TinyText>
        <TinyText sx={{ color: "secondary.main" }}>
          -{formatDuration(duration - position)}
        </TinyText>
      </Box>
    </div>
  );
}

export default PlayerSlider;
