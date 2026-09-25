import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Chip,
  Card,
  CardContent,
  Avatar,
  Stack,
  useTheme,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function HeroBanner({ onOpenClientPortal }) {
  const theme = useTheme();

  const scrollToQuote = () => {
    document.getElementById('formulario-cotizacion')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 4, md: 7 },
        pb: { xs: 6, md: 8 },
        background:
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #FFF8F3 0%, #FFFFFF 100%)'
            : 'linear-gradient(180deg, #131A2A 0%, #0B1120 100%)',
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Columna Izquierda: Mensaje Principal */}
          <Grid item xs={12} md={7}>
            <Box sx={{ mb: 2 }}>
              <Chip
                label="¡TU SEGURO, TU TRANQUILIDAD!"
                color="primary"
                sx={{
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  letterSpacing: '0.04em',
                  boxShadow: '0 4px 12px rgba(255, 111, 34, 0.25)',
                }}
              />
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.3rem', sm: '3rem', md: '3.5rem' },
                lineHeight: 1.1,
                mb: 2.5,
              }}
            >
              Protege a tu familia con la asesoría de{' '}
              <span className="gradient-text-orange">Adriana Martínez</span>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.15rem' },
                color: 'text.secondary',
                mb: 3.5,
                lineHeight: 1.6,
                maxWidth: 560,
              }}
            >
              Especialista certificada (<strong>Lic. G082442</strong>) en seguros de salud con subsidios del gobierno{' '}
              <strong>(Obamacare desde $0/mes)</strong>, vida patrimonial, odontología sin esperas, accidentes y rentas en efectivo por hospitalización.
            </Typography>

            {/* Dos Botones Claros y Directos */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SendIcon />}
                onClick={scrollToQuote}
                sx={{
                  fontSize: '1rem',
                  py: 1.4,
                  px: 3.5,
                  boxShadow: '0 8px 20px -4px rgba(255, 111, 34, 0.4)',
                }}
              >
                Solicitar Cotización Gratuita
              </Button>

              <Button
                variant="outlined"
                sx={{
                  borderColor: '#25D366',
                  color: '#25D366',
                  fontSize: '0.95rem',
                  py: 1.4,
                  px: 3,
                  fontWeight: 700,
                  '&:hover': {
                    borderColor: '#1EBE5D',
                    bgcolor: 'rgba(37, 211, 102, 0.08)',
                  },
                }}
                startIcon={<WhatsAppIcon />}
                component="a"
                href="https://wa.me/17868722310?text=Hola%20Adriana,%20quiero%20cotizar%20un%20seguro%20con%20Eos%20Protecci%C3%B3n"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Directo
              </Button>
            </Stack>

            {/* Enlace discreto a carnet / cliente */}
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.88rem' }}>
              ¿Ya estás asegurado con nosotros?{' '}
              <span
                style={{ color: '#0B4F9C', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                onClick={onOpenClientPortal}
              >
                Consulta tu carnet digital aquí
              </span>
            </Typography>
          </Grid>

          {/* Columna Derecha: Tarjeta Ejecutiva de la Agente */}
          <Grid item xs={12} md={5}>
            <Card
              sx={{
                background:
                  theme.palette.mode === 'light'
                    ? '#FFFFFF'
                    : 'linear-gradient(145deg, #1A2438 0%, #111A2C 100%)',
                border: '1.5px solid rgba(255, 111, 34, 0.25)',
                boxShadow: '0 15px 35px -10px rgba(0,0,0,0.08)',
                p: { xs: 2, sm: 3 },
              }}
            >
              <CardContent sx={{ p: 0 }}>
                {/* Cabecera Agente */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                  <Avatar
                    sx={{
                      width: 72,
                      height: 72,
                      bgcolor: '#FF6F22',
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      boxShadow: '0 6px 18px rgba(255, 111, 34, 0.35)',
                    }}
                  >
                    AM
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#FF6F22' }}>
                      Adriana Martínez
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      Health & Life Insurance Agent
                    </Typography>
                    <Chip
                      label="Lic. G082442 • Florida"
                      size="small"
                      color="secondary"
                      sx={{ mt: 0.5, fontWeight: 700, height: 22, fontSize: '0.7rem' }}
                    />
                  </Box>
                </Box>

                {/* 3 Beneficios Clave */}
                <Box
                  sx={{
                    bgcolor: theme.palette.mode === 'light' ? '#FFF9F5' : '#172236',
                    p: 2,
                    borderRadius: '12px',
                    mb: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <CheckCircleIcon sx={{ color: '#00A896', fontSize: 18 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Planes Obamacare con subsidio desde <strong>$0/mes</strong>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <CheckCircleIcon sx={{ color: '#00A896', fontSize: 18 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Odontología Sun Health <strong>sin plazos de espera</strong>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <CheckCircleIcon sx={{ color: '#00A896', fontSize: 18 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Hospitalización con <strong>dinero diario en efectivo</strong>
                    </Typography>
                  </Box>
                </Box>

                {/* Contacto Directo */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box component="a" href="tel:7868722310" sx={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      Llamada directa:
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0B4F9C' }}>
                      786-872-2310
                    </Typography>
                  </Box>
                  <Box
                    component="a"
                    href="https://instagram.com/seguroscon_adriana"
                    target="_blank"
                    rel="noreferrer"
                    sx={{ textDecoration: 'none', color: 'inherit', textAlign: 'right' }}
                  >
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      Instagram:
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      @seguroscon_adriana
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Barra de Aseguradoras Aliadas (Limpia y Compacta) */}
        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: { xs: 2.5, sm: 5 },
            opacity: 0.85,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: '0.08em', color: 'text.secondary' }}>
            ASEGURADORAS ALIADAS:
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0B4F9C' }}>
            OBAMACARE (ACA)
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#00A896' }}>
            Cigna.
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FF6F22' }}>
            Sun Health & Dental
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
