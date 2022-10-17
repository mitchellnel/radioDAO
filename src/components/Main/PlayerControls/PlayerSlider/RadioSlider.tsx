import React from "react";

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
  duration: number;
  currentTime: number;
}

function PlayerSlider({ duration, currentTime }: PlayerSliderProps) {
  // if duration is NaN, just set to 0
  if (Number.isNaN(duration)) {
    duration = 0;
  }

  // if currentTime is NaN, just set to 0
  if (Number.isNaN(currentTime)) {
    currentTime = 0;
  }

  // const [paused, setPaused] = useState<boolean>(false);

  function formatDuration(value: number) {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }

  return (
    <div>
      <Slider
        aria-label="timestamp"
        size="small"
        color="secondary"
        value={currentTime}
        min={0}
        max={duration}
        step={1}
        sx={{
          "& .MuiSlider-thumb": {
            width: 8,
            height: 8,
            transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
            "&:before": {
              boxShadow: "0 2px 12px 0 rgba(232, 189, 48, 0.4)",
            },
            "&:hover, &.Mui-focusVisible": {
              boxShadow: `0px 0px 0px 8px ${"rgb(232 189 48 / 16%)"}`,
            },
          },
          "& .MuiSlider-rail": {
            height: "3px",
            opacity: 0.4,
          },
        }}
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
          {formatDuration(currentTime)}
        </TinyText>
        <TinyText sx={{ color: "secondary.main" }}>
          -{formatDuration(duration - currentTime)}
        </TinyText>
      </Box>
    </div>
  );
}

export default PlayerSlider;
