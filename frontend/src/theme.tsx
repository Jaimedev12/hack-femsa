import { createTheme } from '@mui/material/styles';

// Define the OXXO color palette
const colors = {
  primary: {
    main: '#C8102E', // OXXO Red
    light: '#E13F5A',
    dark: '#9C0A23',
  },
  secondary: {
    main: '#FFD100', // OXXO Yellow
    light: '#FFDC4C',
    dark: '#DBAF00',
  },
  neutral: {
    white: '#FFFFFF',
    lightGray: '#f5f5f5', // Soft beige/light gray as suggested
    mediumGray: '#E0E0E0',
    darkGray: '#333333', // OXXO dark gray
    black: '#000000',
  },
  status: {
    success: '#4CAF50',
    warning: '#FFD100', // Using OXXO yellow for warnings
    error: '#C8102E', // Using OXXO red for errors
  }
};

// Create the theme
const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
      contrastText: colors.neutral.white,
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
      contrastText: colors.neutral.darkGray, // Better contrast with yellow
    },
    error: {
      main: colors.status.error,
    },
    warning: {
      main: colors.status.warning,
    },
    success: {
      main: colors.status.success,
    },
    background: {
      default: colors.neutral.white,
      paper: colors.neutral.lightGray,
    },
    text: {
      primary: colors.neutral.darkGray,
      secondary: colors.neutral.darkGray,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '0.02em' },
    h5: { fontWeight: 700, letterSpacing: '0.01em' },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, letterSpacing: '0.03em' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 6px rgba(0,0,0,0.2)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: colors.primary.light,
          },
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: colors.secondary.light,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 3px 15px rgba(0,0,0,0.05)',
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
        },
        elevation2: {
          boxShadow: '0px 3px 10px rgba(0,0,0,0.1)',
        },
        elevation3: {
          boxShadow: '0px 5px 15px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.primary.main,
          boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
          transition: 'transform 0.2s ease, box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0px 6px 20px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        colorPrimary: {
          color: colors.primary.main,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
});

export { colors };
export default theme;