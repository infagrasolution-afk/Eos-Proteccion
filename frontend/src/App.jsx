import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, CssBaseline, Box, Fab, Tooltip } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { getAppTheme } from './theme';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ProductCards from './components/ProductCards';
import PublicQuoteSection from './components/PublicQuoteSection';
import ClientPortalModal from './components/ClientPortalModal';
import AdminDashboard from './components/AdminDashboard';
import BottomNavMobile from './components/BottomNavMobile';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';
import { api, getCurrentUser, setAuthToken } from './services/api';

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    slug: 'seguro-salud',
    name: 'Seguro de Salud',
    badge: 'Obamacare / $0 Prima',
    carriers: 'Obamacare, Cigna',
    long_desc: 'Asequible y adaptado a tus necesidades con subsidios gubernamentales (ACA), cubre atención preventiva y no preventiva, medicamentos y salud mental.',
  },
  {
    id: 2,
    slug: 'seguro-vida',
    name: 'Seguro de Vida',
    badge: 'Patrimonial',
    carriers: 'Cigna, National Life',
    long_desc: 'Proteger tu patrimonio y el futuro de tu familia es un acto de amor y responsabilidad, con opciones a término o con acumulación de valor.',
  },
  {
    id: 3,
    slug: 'seguro-odontologia',
    name: 'Seguro de Odontología',
    badge: 'Sin Esperas',
    carriers: 'Sun Health & Dental',
    long_desc: 'Sin plazos de espera para limpiezas, extracciones y tratamientos. La salud de tu sonrisa es clave para tu bienestar y confianza.',
  },
  {
    id: 4,
    slug: 'seguro-accidentes',
    name: 'Seguro de Accidentes',
    badge: 'Protección 24/7',
    carriers: 'Cigna, Sun Health',
    long_desc: 'Los accidentes no avisan, pero tú sí puedes estar preparado: protege tus ingresos y tu hogar cuando la vida da un giro inesperado.',
  },
  {
    id: 5,
    slug: 'seguro-hospitalizacion',
    name: 'Seguro de Hospitalización',
    badge: 'Efectivo Diario',
    carriers: 'Cigna, Sun Health & Dental',
    long_desc: 'Recibes dinero directo en efectivo por cada día internado en el hospital, así puedes enfocarte en lo más importante: sanar sin deudas.',
  },
];

export default function App() {
  const [mode, setMode] = useState('light');
  const [currentView, setCurrentView] = useState('public'); // 'public' | 'admin'
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);

  // Servicios seleccionados en el cotizador
  const [selectedServices, setSelectedServices] = useState(['Seguro de Salud (Obamacare)']);

  // Autenticación de Usuarios (Superadmin y Adriana)
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Notificaciones en Tiempo Real
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);

  // Modal Portal del Asegurado (Consulta de Póliza)
  const [clientPortalOpen, setClientPortalOpen] = useState(false);

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const loadNotifications = () => {
    api
      .getNotifications()
      .then((data) => {
        if (data) {
          setNotifications(data.notifications || []);
          setUnreadNotifsCount(data.unread_count || 0);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    api
      .getProducts()
      .then((data) => {
        if (data && data.length > 0) setProducts(data);
      })
      .catch(() => {});

    loadNotifications();
    const interval = setInterval(loadNotifications, 8000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentView('admin');
    loadNotifications();
  };

  const handleLogout = () => {
    setAuthToken(null, null);
    setCurrentUser(null);
    setCurrentView('public');
  };

  const handleNotificationClick = async (notif) => {
    try {
      await api.markNotificationRead(notif.id);
      loadNotifications();
    } catch (e) {}
    setCurrentView('admin');
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      loadNotifications();
    } catch (e) {}
  };

  const handleSelectProductToQuote = (productName) => {
    // Normalizar nombre para coincidir con la lista de servicios del cotizador
    const matched =
      productName.includes('Salud')
        ? 'Seguro de Salud (Obamacare)'
        : productName.includes('Vida')
        ? 'Seguro de Vida'
        : productName.includes('Odonto')
        ? 'Seguro de Odontología'
        : productName.includes('Accidente')
        ? 'Seguro de Accidentes'
        : 'Seguro de Hospitalización';

    setSelectedServices([matched]);
    document.getElementById('formulario-cotizacion')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Barra Superior Limpia y Despejada */}
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          mode={mode}
          toggleColorMode={toggleColorMode}
          onOpenClientPortal={() => setClientPortalOpen(true)}
          currentUser={currentUser}
          onOpenLoginModal={() => setLoginModalOpen(true)}
          onLogout={handleLogout}
          notifications={notifications}
          unreadNotifsCount={unreadNotifsCount}
          onNotificationClick={handleNotificationClick}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        />

        {/* Vista Pública o Panel Administrativo */}
        <Box sx={{ flexGrow: 1 }}>
          {currentView === 'public' ? (
            <>
              {/* Portada Hero con foco claro */}
              <HeroBanner onOpenClientPortal={() => setClientPortalOpen(true)} />

              {/* Catálogo de Seguros limpio */}
              <ProductCards
                products={products}
                onSelectProductToQuote={handleSelectProductToQuote}
              />

              {/* Único Módulo Central de Cotización Directa */}
              <PublicQuoteSection
                selectedServices={selectedServices}
                setSelectedServices={setSelectedServices}
              />
            </>
          ) : (
            <AdminDashboard currentUser={currentUser} onLogout={handleLogout} />
          )}
        </Box>

        {/* Pie de Página */}
        <Footer onOpenClientPortal={() => setClientPortalOpen(true)} />

        {/* Barra Móvil Inferior Táctil */}
        <BottomNavMobile
          currentView={currentView}
          setCurrentView={setCurrentView}
          onOpenClientPortal={() => setClientPortalOpen(true)}
          currentUser={currentUser}
          onOpenLoginModal={() => setLoginModalOpen(true)}
        />

        {/* Botón Flotante Discreto de WhatsApp */}
        <Tooltip title="Chatear con Adriana">
          <Fab
            aria-label="whatsapp"
            component="a"
            href="https://wa.me/17868722310?text=Hola%20Adriana,%20estoy%20viendo%20la%20p%C3%A1gina%20de%20Eos%20Protecci%C3%B3n%20y%20deseo%20asesor%C3%ADa."
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              position: 'fixed',
              bottom: { xs: 72, md: 24 },
              right: 20,
              zIndex: 1050,
              bgcolor: '#25D366',
              color: '#fff',
              '&:hover': { bgcolor: '#1EBE5D' },
              boxShadow: '0 6px 20px rgba(37, 211, 102, 0.4)',
              width: 52,
              height: 52,
            }}
          >
            <WhatsAppIcon sx={{ fontSize: 28 }} />
          </Fab>
        </Tooltip>

        {/* Modal Portal del Asegurado (Consulta de Póliza) */}
        <ClientPortalModal
          open={clientPortalOpen}
          onClose={() => setClientPortalOpen(false)}
        />

        {/* Modal de Inicio de Sesión */}
        <LoginModal
          open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </Box>
    </ThemeProvider>
  );
}
