import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const dashboardTheme = createTheme({
  // Customize only for dashboard
  palette: {
    primary: {
      main: '#4f46e5', // Match your Tailwind indigo-600
    },
  },
  components: {
    // Component overrides specific to dashboard
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Disable uppercase
        },
      },
    },
  },
});

export default function DashboardThemeProvider({ children }) {
  return (
    <ThemeProvider theme={dashboardTheme}>
      <CssBaseline /> {/* Optional: resets only for dashboard */}
      {children}
    </ThemeProvider>
  );
}