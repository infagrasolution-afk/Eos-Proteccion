import { createTheme } from '@mui/material/styles';

export const getAppTheme = (mode = 'light') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#FF6F22',      // Naranja Vibrante del Flyer de Adriana
        light: '#FF8F4D',
        dark: '#E0530A',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#0B4F9C',      // Azul Real Corporativo / Cigna / Obamacare
        light: '#2574D8',
        dark: '#07366E',
        contrastText: '#FFFFFF',
      },
      info: {
        main: '#028090',      // Verde azulado / Teal médico
        light: '#00A896',
        dark: '#015B66',
      },
      success: {
        main: '#10B981',
        light: '#34D399',
        dark: '#059669',
      },
      warning: {
        main: '#F59E0B',
      },
      background: {
        default: mode === 'light' ? '#F8FAFC' : '#0B1120',
        paper: mode === 'light' ? '#FFFFFF' : '#131C31',
        alt: mode === 'light' ? '#FFF5EE' : '#17233D',
      },
      text: {
        primary: mode === 'light' ? '#0F172A' : '#F8FAFC',
        secondary: mode === 'light' ? '#64748B' : '#94A3B8',
      },
    },
    typography: {
      fontFamily: "'Plus Jakarta Sans', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
      h1: {
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 800,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 800,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 700,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 700,
      },
      h5: {
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 700,
      },
      h6: {
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 600,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 14,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '10px 22px',
            boxShadow: 'none',
            fontSize: '0.95rem',
            transition: 'all 0.25s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 20px -4px rgba(255, 111, 34, 0.35)',
            },
          },
          containedSecondary: {
            '&:hover': {
              boxShadow: '0 8px 20px -4px rgba(11, 79, 156, 0.35)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            border: mode === 'light' ? '1px solid #F1F5F9' : '1px solid #1E293B',
            boxShadow:
              mode === 'light'
                ? '0 10px 30px -10px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)'
                : '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '0.78rem',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: {
            borderRadius: 18,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(16px)',
            backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.88)' : 'rgba(11, 17, 32, 0.88)',
            borderBottom: mode === 'light' ? '1px solid #E2E8F0' : '1px solid #1E293B',
            color: mode === 'light' ? '#0F172A' : '#F8FAFC',
          },
        },
      },
    },
  });
