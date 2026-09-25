import { createTheme, responsiveFontSizes, alpha } from '@mui/material/styles';

export const getAppTheme = (mode = 'light') => {
  const isLight = mode === 'light';

  const baseTheme = createTheme({
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
        default: isLight ? '#F8FAFC' : '#0B1120',
        paper: isLight ? '#FFFFFF' : '#131C31',
      },
      text: {
        primary: isLight ? '#0F172A' : '#F8FAFC',
        secondary: isLight ? '#64748B' : '#94A3B8',
      },
      divider: isLight ? '#E2E8F0' : '#1E293B',
    },
    typography: {
      fontFamily: "'Plus Jakarta Sans', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
      h1: {
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 800,
        letterSpacing: '-0.025em',
      },
      h2: {
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 800,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 700,
        letterSpacing: '-0.015em',
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
      subtitle1: {
        fontWeight: 600,
      },
      subtitle2: {
        fontWeight: 600,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '8px 20px',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
          },
          containedPrimary: {
            '&:hover': {
              boxShadow: '0 6px 18px -4px rgba(255, 111, 34, 0.4)',
            },
          },
          containedSecondary: {
            '&:hover': {
              boxShadow: '0 6px 18px -4px rgba(11, 79, 156, 0.4)',
            },
          },
        },
      },
      MuiCard: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: isLight ? '1px solid #E2E8F0' : '1px solid #1E293B',
            boxShadow: isLight
              ? '0 4px 20px -4px rgba(0, 0, 0, 0.04)'
              : '0 4px 20px -4px rgba(0, 0, 0, 0.4)',
            transition: 'border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
            },
          },
        },
      },
      MuiAppBar: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backdropFilter: 'blur(16px)',
            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.88)' : 'rgba(11, 17, 32, 0.88)',
            color: isLight ? '#0F172A' : '#F8FAFC',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 18,
          },
        },
      },
    },
  });

  return responsiveFontSizes(baseTheme);
};
