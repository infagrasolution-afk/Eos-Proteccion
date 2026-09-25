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
import NotificationsIcon from '@mui/icons-material/Notifications';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';

export default function Navbar({
  currentView,
  setCurrentView,
  mode,
  toggleColorMode,
  isMobileSim,
  setIsMobileSim,
  onOpenQuoteModal,
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
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  // Menú de Notificaciones
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const openNotif = Boolean(notifAnchorEl);

  // Menú de Usuario
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const openUser = Boolean(userAnchorEl);

  const handleAdminClick = () => {
    if (!currentUser) {
      onOpenLoginModal();
    } else {
      setCurrentView('admin');
    }
  };

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
                onClick={handleAdminClick}
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

            {/* Botón Cotizar Rápido */}
            <Button
              variant="outlined"
              size="small"
              startIcon={<SendIcon sx={{ fontSize: 16 }} />}
              onClick={() => {
                const el = document.getElementById('formulario-cotizacion');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setCurrentView('public');
                  setTimeout(() => {
                    document.getElementById('formulario-cotizacion')?.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }
              }}
              sx={{
                display: { xs: 'none', md: 'flex' },
                borderColor: '#FF6F22',
                color: '#FF6F22',
                fontWeight: 700,
                '&:hover': {
                  borderColor: '#E0530A',
                  backgroundColor: 'rgba(255, 111, 34, 0.05)',
                },
              }}
            >
              Solicitar Cotización
            </Button>

            {/* Botón Consultar Póliza */}
            <Button
              variant="text"
              size="small"
              onClick={onOpenClientPortal}
              sx={{
                display: { xs: 'none', md: 'flex' },
                color: '#0B4F9C',
                fontWeight: 700,
              }}
            >
              Mi Póliza
            </Button>

            {/* Centro de Notificaciones en la App (Campana con Badge) */}
            {currentUser && (
              <>
                <Tooltip title="Notificaciones en Tiempo Real">
                  <IconButton
                    color="inherit"
                    onClick={(e) => setNotifAnchorEl(e.currentTarget)}
                    sx={{ position: 'relative' }}
                  >
                    <Badge badgeContent={unreadNotifsCount} color="error">
                      <NotificationsIcon sx={{ color: unreadNotifsCount > 0 ? '#FF6F22' : 'inherit' }} />
                    </Badge>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={notifAnchorEl}
                  open={openNotif}
                  onClose={() => setNotifAnchorEl(null)}
                  PaperProps={{
                    sx: { width: 360, maxHeight: 420, borderRadius: '16px', p: 1 },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      Notificaciones ({unreadNotifsCount} nuevas)
                    </Typography>
                    {unreadNotifsCount > 0 && (
                      <Button size="small" onClick={onMarkAllNotificationsRead} sx={{ fontSize: '0.75rem' }}>
                        Marcar leídas
                      </Button>
                    )}
                  </Box>
                  <Divider sx={{ my: 0.5 }} />

                  {notifications.length === 0 ? (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        No hay notificaciones pendientes.
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
                          py: 1.2,
                          px: 1.5,
                          borderRadius: '10px',
                          mb: 0.5,
                          bgcolor: !n.is_read ? (theme.palette.mode === 'light' ? '#FFF5EE' : '#1F293D') : 'transparent',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 0.5 }}>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: '#FF6F22' }}>
                            {n.title}
                          </Typography>
                          {!n.is_read && <Chip label="Nuevo" color="primary" size="small" sx={{ height: 16, fontSize: '0.62rem' }} />}
                        </Box>
                        <Typography variant="body2" sx={{ fontSize: '0.82rem', color: 'text.primary', lineHeight: 1.3 }}>
                          {n.message}
                        </Typography>
                      </MenuItem>
                    ))
                  )}
                </Menu>
              </>
            )}

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
                  width: 36,
                  height: 36,
                }}
              >
                <WhatsAppIcon sx={{ fontSize: 18 }} />
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
                  width: 36,
                  height: 36,
                }}
              >
                <PhoneIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            {/* Perfil / Login */}
            {currentUser ? (
              <>
                <Chip
                  avatar={
                    <Avatar sx={{ bgcolor: currentUser.role === 'superadmin' ? '#0B4F9C' : '#FF6F22', color: '#fff' }}>
                      {currentUser.full_name ? currentUser.full_name.charAt(0) : 'U'}
                    </Avatar>
                  }
                  label={currentUser.role === 'superadmin' ? 'Superadmin' : 'Adriana (Admin)'}
                  onClick={(e) => setUserAnchorEl(e.currentTarget)}
                  color={currentUser.role === 'superadmin' ? 'secondary' : 'primary'}
                  variant="outlined"
                  sx={{ fontWeight: 700, cursor: 'pointer' }}
                />

                <Menu
                  anchorEl={userAnchorEl}
                  open={openUser}
                  onClose={() => setUserAnchorEl(null)}
                  PaperProps={{ sx: { width: 220, borderRadius: '14px', p: 0.5 } }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {currentUser.full_name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {currentUser.email}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem
                    onClick={() => {
                      setUserAnchorEl(null);
                      setCurrentView('admin');
                    }}
                  >
                    <ListItemIcon>
                      <DashboardIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Consola CRM" />
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setUserAnchorEl(null);
                      onLogout();
                    }}
                    sx={{ color: '#EF4444' }}
                  >
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" sx={{ color: '#EF4444' }} />
                    </ListItemIcon>
                    <ListItemText primary="Cerrar Sesión" />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                size="small"
                startIcon={<LockOpenIcon />}
                onClick={onOpenLoginModal}
                sx={{
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                }}
              >
                Ingresar
              </Button>
            )}

            {/* Simulador Móvil */}
            <Tooltip title={isMobileSim ? "Vista Escritorio" : "Simular Vista Móvil / App"}>
              <IconButton
                onClick={() => setIsMobileSim(!isMobileSim)}
                sx={{
                  color: isMobileSim ? '#FF6F22' : 'text.secondary',
                  border: isMobileSim ? '1px solid #FF6F22' : 'none',
                  display: { xs: 'none', sm: 'inline-flex' },
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
