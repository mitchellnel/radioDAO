import { createTheme, PaletteColorOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface CustomPalette {
    voteFor: PaletteColorOptions;
    voteAgainst: PaletteColorOptions;
    voteAbstain: PaletteColorOptions;
  }
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    voteFor: true;
    voteAgainst: true;
    voteAbstain: true;
  }
}

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor: string) =>
  augmentColor({ color: { main: mainColor } });

const radioDAOTheme = createTheme({
  palette: {
    primary: {
      main: "#5506bf",
      light: "#7d57be",
      contrastText: "#e8bd30",
    },
    secondary: {
      main: "#e8bd30",
    },
    voteFor: createColor("#3f7a32"),
    voteAgainst: createColor("#df3633"),
    voteAbstain: createColor("#9867c5"),
  },
});

export default radioDAOTheme;
