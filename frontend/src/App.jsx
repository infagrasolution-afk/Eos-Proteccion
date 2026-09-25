import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, CssBaseline, Box, Fab, Tooltip } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { getAppTheme } from './theme';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ProductCards from './components/ProductCards';
import PublicQuoteSection from './components/PublicQuoteSection';
import QuoteCalculatorModal from './components/QuoteCalculatorModal';
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
    short_desc: 'Asequible y adaptado a tus necesidades con subsidios del gobierno (ACA/Obamacare).',
    long_desc: 'Asequible y adaptado a tus necesidades, cubre atención preventiva y no preventiva, servicios de salud mental, medicamentos y más.',
    badge: 'Obamacare / $0 Prima',
    carriers: 'Obamacare, Cigna',
    features: 'Atención preventiva 100% cubierta,Consultas médicas y especialistas,Medicamentos recetados,Salud mental y terapias',
  },
  {
    id: 2,
    slug: 'seguro-vida',
    name: 'Seguro de Vida',
    short_desc: 'Protege el patrimonio y el porvenir de tus seres queridos.',
    long_desc: 'Proteger tu patrimonio y el futuro de tu familia es un acto de amor y responsabilidad.',
    badge: 'Patrimonial',
    carriers: 'Cigna, National Life',
    features: 'Protección financiera familiar,Beneficios en vida por enfermedades graves,Opciones a término o con acumulación,Trámite ágil',
  },
  {
    id: 3,
    slug: 'seguro-odontologia',
    name: 'Seguro de Odontología',
    short_desc: 'Sin plazos de espera para cuidar la salud de tu sonrisa.',
    long_desc: 'Sin plazos de espera, la salud de tu sonrisa es importante para tu bienestar y confianza.',
    badge: 'Sin Plazos de Espera',
    carriers: 'Sun Health & Dental',
    features: 'Cero períodos de espera,Tratamientos de ortodoncia y extracciones,Red extensa de dentistas,Sin deducibles elevados',
  },
  {
    id: 4,
    slug: 'seguro-accidentes',
    name: 'Seguro de Accidentes',
    short_desc: 'Protege tus ingresos cuando la vida da un giro inesperado.',
    long_desc: 'Los accidentes no avisan, pero tú sí puedes estar preparado, protege tus ingresos y tu familia cuando la vida da un giro inesperado.',
    badge: 'Protección 24/7',
    carriers: 'Cigna, Sun Health',
    features: 'Indemnización en efectivo directa para ti,Cobertura de fracturas y urgencias,Pagos rápidos para gastos diarios,Válido 24 horas',
  },
  {
    id: 5,
    slug: 'seguro-hospitalizacion',
    name: 'Seguro de Hospitalización',
    short_desc: 'Recibes dinero en efectivo por cada día internado en el hospital.',
    long_desc: 'Recibes dinero por cada día internado, así puedes enfocarte en lo más importante, sanar sin preocuparte por lo demás.',
    badge: 'Dinero Diario en Efectivo',
    carriers: 'Cigna, Sun Health & Dental',
    features: 'Pagos directos de $250 a $1,000 por día de hospitalización,Dinero de libre disponibilidad para renta o gastos,Compatible con tu seguro médico actual,Sin deducible previo',
  },
];

export default function App() {
  const [mode, setMode] = useState('light');
  const [currentView, setCurrentView] = useState('public'); // 'public' | 'admin'
  const [isMobileSim, setIsMobileSim] = useState(false);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);

  // Autenticación de Usuarios (Superadmin y Adriana)
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Notificaciones en Tiempo Real
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);

  // Modales
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedProductForQuote, setSelectedProductForQuote] = useState(null);
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
      .catch((err) => {
        // Ignorar si no está autenticado o en modo offline
      });
  };

  useEffect(() => {
    // Cargar productos
    api
      .getProducts()
      .then((data) => {
        if (data && data.length > 0) setProducts(data);
      })
      .catch((err) => {
        console.log('Utilizando catálogo local de respaldo:', err);
      });

    // Cargar notificaciones y activar polling cada 8 segundos
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

  const handleOpenQuoteWithProduct = (productName) => {
    setSelectedProductForQuote(productName);
    setQuoteModalOpen(true);
  };

  const handleScrollToProducts = () => {
    const el = document.getElementById('productos-coberturas');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const mainContent = (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Barra de Navegación */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        mode={mode}
        toggleColorMode={toggleColorMode}
        isMobileSim={isMobileSim}
        setIsMobileSim={setIsMobileSim}
        onOpenQuoteModal={() => {
          setSelectedProductForQuote(null);
          setQuoteModalOpen(true);
        }}
        onOpenClientPortal={() => setClientPortalOpen(true)}
        currentUser={currentUser}
        onOpenLoginModal={() => setLoginModalOpen(true)}
        onLogout={handleLogout}
        notifications={notifications}
        unreadNotifsCount={unreadNotifsCount}
        onNotificationClick={handleNotificationClick}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
      />

      {/* Contenido Principal según Vista */}
      <Box sx={{ flexGrow: 1 }}>
        {currentView === 'public' ? (
          <>
            <HeroBanner
              onOpenQuoteModal={() => {
                setSelectedProductForQuote(null);
                setQuoteModalOpen(true);
              }}
              onOpenClientPortal={() => setClientPortalOpen(true)}
              onScrollToProducts={handleScrollToProducts}
            />
            <ProductCards
              products={products}
              onSelectProductToQuote={handleOpenQuoteWithProduct}
            />
            {/* Formulario Público para solicitar cotización antes de loguearse */}
            <PublicQuoteSection />
          </>
        ) : (
          <AdminDashboard
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}
      </Box>

      {/* Pie de Página */}
      <Footer
        onOpenQuoteModal={() => setQuoteModalOpen(true)}
        onOpenClientPortal={() => setClientPortalOpen(true)}
      />

      {/* Barra Móvil Inferior */}
      <BottomNavMobile
        currentView={currentView}
        setCurrentView={(view) => {
          if (view === 'admin' && !currentUser) {
            setLoginModalOpen(true);
          } else {
            setCurrentView(view);
          }
        }}
        onOpenQuoteModal={() => {
          setSelectedProductForQuote(null);
          setQuoteModalOpen(true);
        }}
        onOpenClientPortal={() => setClientPortalOpen(true)}
        onScrollToProducts={handleScrollToProducts}
      />

      {/* Botón Flotante de WhatsApp */}
      <Tooltip title="Chatear con Adriana Martínez">
        <Fab
          color="success"
          aria-label="whatsapp"
          component="a"
          href="https://wa.me/17868722310?text=Hola%20Adriana,%20estoy%20viendo%20la%20p%C3%A1gina%20de%20Eos%20Protecci%C3%B3n%20y%20deseo%20asesor%C3%ADa."
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            position: 'fixed',
            bottom: { xs: 75, md: 30 },
            right: 24,
            zIndex: 1050,
            bgcolor: '#25D366',
            color: '#fff',
            '&:hover': { bgcolor: '#1EBE5D', transform: 'scale(1.08)' },
            transition: 'all 0.2s ease-in-out',
            boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
          }}
        >
          <WhatsAppIcon sx={{ fontSize: 32 }} />
        </Fab>
      </Tooltip>

      {/* Modal Cotizador Rápido */}
      <QuoteCalculatorModal
        open={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        defaultProduct={selectedProductForQuote}
      />

      {/* Modal Portal del Asegurado */}
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
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isMobileSim ? (
        <Box
          sx={{
            minHeight: '100vh',
            bgcolor: '#0F172A',
            py: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box className="mobile-device-frame" sx={{ width: '100%', height: '90vh', overflowY: 'auto' }}>
            {mainContent}
          </Box>
        </Box>
      ) : (
        mainContent
      )}
    </ThemeProvider>
  );
}
