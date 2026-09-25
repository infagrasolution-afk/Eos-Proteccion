import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PublicIcon from '@mui/icons-material/Public';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import ComputerIcon from '@mui/icons-material/Computer';
import BadgeIcon from '@mui/icons-material/VerifiedUser';

export default function Navbar({
  currentView,
  setCurrentView,
  mode,
  toggleColorMode,
  isMobileSim,
  setIsMobileSim,
  onOpenQuoteModal,
  onOpenClientPortal,
}) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 0.8 }}>
          {/* Logo & Marca */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
            }}
            onClick={() => setCurrentView('public')}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #FF6F22 0%, #0B4F9C 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(255, 111, 34, 0.35)',
              }}
            >
              <ShieldIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    color: theme.palette.mode === 'light' ? '#0F172A' : '#F8FAFC',
                  }}
                >
                  EOS <span style={{ color: '#FF6F22' }}>PROTECCIÓN</span>
                </Typography>
                <Chip
                  icon={<BadgeIcon sx={{ fontSize: '13px !important', color: '#0B4F9C !important' }} />}
                  label="Lic. G082442"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    backgroundColor: theme.palette.mode === 'light' ? '#EBF3FC' : '#1E293B',
                    color: '#0B4F9C',
                    border: '1px solid #BFDBFE',
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block' }}>
                Adriana Martínez • Health & Life Insurance
              </Typography>
            </Box>
          </Box>

          {/* Navegación y Modos */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Selector de Vista: Portal Público vs Panel CRM */}
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                backgroundColor: theme.palette.mode === 'light' ? '#F1F5F9' : '#1E293B',
                p: 0.5,
                borderRadius: '12px',
                gap: 0.5,
              }}
            >
              <Button
                size="small"
                startIcon={<PublicIcon sx={{ fontSize: 18 }} />}
                variant={currentView === 'public' ? 'contained' : 'text'}
                color={currentView === 'public' ? 'primary' : 'inherit'}
                onClick={() => setCurrentView('public')}
                sx={{
                  borderRadius: '9px',
                  px: 1.5,
                  py: 0.6,
                  fontSize: '0.82rem',
                }}
              >
                Portal Público
              </Button>
              <Button
                size="small"
                startIcon={<DashboardIcon sx={{ fontSize: 18 }} />}
                variant={currentView === 'admin' ? 'contained' : 'text'}
                color={currentView === 'admin' ? 'secondary' : 'inherit'}
                onClick={() => setCurrentView('admin')}
                sx={{
                  borderRadius: '9px',
                  px: 1.5,
                  py: 0.6,
                  fontSize: '0.82rem',
                }}
              >
                Gestión / CRM Agente
              </Button>
            </Box>

            {/* Botón Consultar Póliza */}
            <Button
              variant="outlined"
              size="small"
              onClick={onOpenClientPortal}
              sx={{
                display: { xs: 'none', md: 'flex' },
                borderColor: '#0B4F9C',
                color: '#0B4F9C',
                '&:hover': {
                  borderColor: '#07366E',
                  backgroundColor: 'rgba(11, 79, 156, 0.04)',
                },
              }}
            >
              Mi Póliza
            </Button>

            {/* Botón WhatsApp */}
            <Tooltip title="Chatear con Adriana por WhatsApp">
              <IconButton
                component="a"
                href="https://wa.me/17868722310?text=Hola%20Adriana,%20deseo%20informaci%C3%B3n%20sobre%20los%20seguros%20de%20Eos%20Protecci%C3%B3n"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  backgroundColor: '#25D366',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#1EBE5D' },
                  width: 38,
                  height: 38,
                }}
              >
                <WhatsAppIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>

            {/* Botón Llamada */}
            <Tooltip title="Llamar a Adriana: 786-872-2310">
              <IconButton
                component="a"
                href="tel:7868722310"
                sx={{
                  backgroundColor: '#FF6F22',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#E0530A' },
                  width: 38,
                  height: 38,
                }}
              >
                <PhoneIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>

            {/* Simulador Vista Móvil / Escritorio */}
            <Tooltip title={isMobileSim ? "Cambiar a Vista Pantalla Completa" : "Simular Vista Móvil / App"}>
              <IconButton
                onClick={() => setIsMobileSim(!isMobileSim)}
                sx={{
                  color: isMobileSim ? '#FF6F22' : 'text.secondary',
                  border: isMobileSim ? '1px solid #FF6F22' : 'none',
                }}
              >
                {isMobileSim ? <ComputerIcon /> : <SmartphoneIcon />}
              </IconButton>
            </Tooltip>

            {/* Dark Mode Toggle */}
            <Tooltip title={mode === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}>
              <IconButton onClick={toggleColorMode} color="inherit">
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
