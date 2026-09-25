import React, { useState } from 'react';
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
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  useTheme,
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import BadgeIcon from '@mui/icons-material/VerifiedUser';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';

export default function Navbar({
  currentView,
  setCurrentView,
  mode,
  toggleColorMode,
  onOpenClientPortal,
  currentUser,
  onOpenLoginModal,
  onLogout,
  notifications = [],
  unreadNotifsCount = 0,
  onNotificationClick,
  onMarkAllNotificationsRead,
}) {
  const theme = useTheme();

  // Menús flotantes
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [userAnchorEl, setUserAnchorEl] = useState(null);

  const scrollToSection = (id) => {
    if (currentView !== 'public') {
      setCurrentView('public');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo Corporativo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
            }}
            onClick={() => {
              setCurrentView('public');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #FF6F22 0%, #0B4F9C 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 14px rgba(255, 111, 34, 0.3)',
              }}
            >
              <ShieldIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
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
                    bgcolor: theme.palette.mode === 'light' ? '#EBF3FC' : '#1E293B',
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

          {/* Enlaces de Navegación Simples y Limpios (Solo escritorio/tablet) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
            <Button
              color="inherit"
              onClick={() => scrollToSection('servicios-coberturas')}
              sx={{ fontWeight: 600, color: 'text.secondary', '&:hover': { color: '#FF6F22' } }}
            >
              Servicios
            </Button>
            <Button
              color="inherit"
              onClick={() => scrollToSection('formulario-cotizacion')}
              sx={{ fontWeight: 600, color: 'text.secondary', '&:hover': { color: '#FF6F22' } }}
            >
              Cotizar
            </Button>
            <Button
              color="inherit"
              onClick={onOpenClientPortal}
              sx={{ fontWeight: 600, color: 'text.secondary', '&:hover': { color: '#0B4F9C' } }}
            >
              Mi Póliza
            </Button>
          </Box>

          {/* Acciones del Extremo Derecho */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            {/* WhatsApp Directo */}
            <Button
              variant="outlined"
              size="small"
              startIcon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
              component="a"
              href="https://wa.me/17868722310?text=Hola%20Adriana,%20deseo%20asesor%C3%ADa%20sobre%20un%20seguro%20de%20Eos%20Protecci%C3%B3n"
              target="_blank"
              rel="noreferrer"
              sx={{
                borderColor: '#25D366',
                color: theme.palette.mode === 'light' ? '#1E293B' : '#F8FAFC',
                fontWeight: 700,
                fontSize: '0.82rem',
                borderRadius: '10px',
                display: { xs: 'none', sm: 'inline-flex' },
                '&:hover': { borderColor: '#1EBE5D', bgcolor: 'rgba(37, 211, 102, 0.06)' },
              }}
            >
              WhatsApp
            </Button>

            {/* Si está autenticado: Notificaciones y Perfil */}
            {currentUser ? (
              <>
                <Tooltip title="Notificaciones">
                  <IconButton
                    color="inherit"
                    onClick={(e) => setNotifAnchorEl(e.currentTarget)}
                    size="small"
                  >
                    <Badge badgeContent={unreadNotifsCount} color="error">
                      <NotificationsIcon sx={{ color: unreadNotifsCount > 0 ? '#FF6F22' : 'inherit' }} />
                    </Badge>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={notifAnchorEl}
                  open={Boolean(notifAnchorEl)}
                  onClose={() => setNotifAnchorEl(null)}
                  PaperProps={{ sx: { width: 340, maxHeight: 400, borderRadius: '14px', p: 1 } }}
                >
                  <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      Notificaciones ({unreadNotifsCount})
                    </Typography>
                    {unreadNotifsCount > 0 && (
                      <Button size="small" onClick={onMarkAllNotificationsRead} sx={{ fontSize: '0.72rem' }}>
                        Limpiar
                      </Button>
                    )}
                  </Box>
                  <Divider sx={{ my: 0.5 }} />
                  {notifications.length === 0 ? (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Sin notificaciones pendientes.
                      </Typography>
                    </Box>
                  ) : (
                    notifications.map((n) => (
                      <MenuItem
                        key={n.id}
                        onClick={() => {
                          setNotifAnchorEl(null);
                          onNotificationClick(n);
                        }}
                        sx={{
                          py: 1,
                          borderRadius: '8px',
                          mb: 0.5,
                          bgcolor: !n.is_read ? 'rgba(255, 111, 34, 0.08)' : 'transparent',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#FF6F22' }}>
                          {n.title}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem', lineHeight: 1.3 }}>
                          {n.message}
                        </Typography>
                      </MenuItem>
                    ))
                  )}
                </Menu>

                <Button
                  variant={currentView === 'admin' ? 'contained' : 'outlined'}
                  color="secondary"
                  size="small"
                  startIcon={<DashboardIcon />}
                  onClick={() => setCurrentView('admin')}
                  sx={{ borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700 }}
                >
                  {currentUser.role === 'superadmin' ? 'CRM Superadmin' : 'CRM Agente'}
                </Button>

                <Tooltip title="Cerrar sesión">
                  <IconButton size="small" color="error" onClick={onLogout}>
                    <LogoutIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              /* Botón único de Acceso para Adriana o Superadmin */
              <Button
                variant="contained"
                size="small"
                color="secondary"
                startIcon={<LockOutlinedIcon />}
                onClick={onOpenLoginModal}
                sx={{
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  px: 2,
                }}
              >
                Acceso Agente
              </Button>
            )}

            {/* Selector Modo Oscuro */}
            <Tooltip title={mode === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}>
              <IconButton onClick={toggleColorMode} color="inherit" size="small">
                {mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
