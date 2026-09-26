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
      <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2.5, md: 3 } }}>
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: { xs: 0.6, sm: 1 }, minHeight: { xs: 54, sm: 64 } }}>
          {/* Logo Corporativo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 1.5 },
              cursor: 'pointer',
              minWidth: 0,
            }}
            onClick={() => {
              setCurrentView('public');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Box
              sx={{
                width: { xs: 36, sm: 42 },
                height: { xs: 36, sm: 42 },
                minWidth: { xs: 36, sm: 42 },
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #FF6F22 0%, #0B4F9C 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(255, 111, 34, 0.25)',
              }}
            >
              <ShieldIcon sx={{ fontSize: { xs: 22, sm: 26 } }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    fontSize: { xs: '1.02rem', sm: '1.25rem' },
                    whiteSpace: 'nowrap',
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
                    display: { xs: 'none', sm: 'inline-flex' },
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                  display: 'block',
                  fontSize: { xs: '0.7rem', sm: '0.78rem' },
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Adriana Martínez • Health & Life Insurance
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                  Adriana Martínez • <span style={{ color: '#0B4F9C', fontWeight: 700 }}>Lic. G082442</span>
                </Box>
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.6, sm: 1.2 } }}>
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
                    aria-label="Ver notificaciones del sistema"
                    onClick={(e) => setNotifAnchorEl(e.currentTarget)}
                    size="small"
                    sx={{ p: { xs: 0.6, sm: 1 } }}
                  >
                    <Badge badgeContent={unreadNotifsCount} color="error">
                      <NotificationsIcon sx={{ fontSize: { xs: 20, sm: 22 }, color: unreadNotifsCount > 0 ? '#FF6F22' : 'inherit' }} />
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

                {/* Botón CRM en Desktop */}
                <Button
                  variant={currentView === 'admin' ? 'contained' : 'outlined'}
                  color="secondary"
                  size="small"
                  startIcon={<DashboardIcon />}
                  onClick={() => setCurrentView('admin')}
                  sx={{
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    display: { xs: 'none', sm: 'inline-flex' },
                  }}
                >
                  {currentUser.role === 'superadmin' ? 'CRM Superadmin' : 'CRM Agente'}
                </Button>

                {/* Botón CRM en Móvil */}
                <Tooltip title="Panel CRM">
                  <IconButton
                    color="secondary"
                    size="small"
                    onClick={() => setCurrentView('admin')}
                    sx={{
                      bgcolor: currentView === 'admin' ? 'secondary.main' : 'rgba(11, 79, 156, 0.1)',
                      color: currentView === 'admin' ? '#fff' : 'secondary.main',
                      borderRadius: '8px',
                      p: 0.7,
                      display: { xs: 'inline-flex', sm: 'none' },
                      '&:hover': { bgcolor: 'secondary.main', color: '#fff' },
                    }}
                  >
                    <DashboardIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Cerrar sesión">
                  <IconButton size="small" color="error" aria-label="Cerrar sesión de usuario" onClick={onLogout} sx={{ p: { xs: 0.6, sm: 1 } }}>
                    <LogoutIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                {/* Botón Acceso Agente en Desktop */}
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
                    display: { xs: 'none', sm: 'inline-flex' },
                  }}
                >
                  Acceso Agente
                </Button>

                {/* Botón Compacto en Móvil para que no se desborde */}
                <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  startIcon={<LockOutlinedIcon sx={{ fontSize: 15 }} />}
                  onClick={onOpenLoginModal}
                  sx={{
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.74rem',
                    py: 0.5,
                    px: 1.1,
                    minWidth: 'auto',
                    whiteSpace: 'nowrap',
                    display: { xs: 'inline-flex', sm: 'none' },
                  }}
                >
                  Acceso
                </Button>
              </>
            )}

            {/* Selector Modo Oscuro */}
            <Tooltip title={mode === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}>
              <IconButton onClick={toggleColorMode} color="inherit" size="small" aria-label="Cambiar tema de color" sx={{ p: { xs: 0.6, sm: 1 } }}>
                {mode === 'dark' ? <Brightness7Icon sx={{ fontSize: { xs: 18, sm: 20 } }} /> : <Brightness4Icon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
