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
import CalculateIcon from '@mui/icons-material/Calculate';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SecurityIcon from '@mui/icons-material/Security';

export default function HeroBanner({ onOpenQuoteModal, onOpenClientPortal, onScrollToProducts }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 4, md: 7 },
        pb: { xs: 6, md: 9 },
        background:
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #FFF6F0 0%, #FFFFFF 100%)'
            : 'linear-gradient(180deg, #131A2A 0%, #0B1120 100%)',
      }}
    >
      {/* Decorative ambient background glows */}
      <Box className="hero-glow-blob glow-orange" sx={{ top: -120, right: -100 }} />
      <Box className="hero-glow-blob glow-blue" sx={{ bottom: -120, left: -100 }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Column: Headlines & Call to Actions */}
          <Grid item xs={12} md={7}>
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label="¡TU SEGURO, TU TRANQUILIDAD!"
                color="primary"
                sx={{
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  letterSpacing: '0.04em',
                  px: 0.5,
                  boxShadow: '0 4px 14px rgba(255, 111, 34, 0.3)',
                }}
              />
              <Chip
                icon={<StarIcon sx={{ fontSize: '16px !important', color: '#F59E0B !important' }} />}
                label="Asesoría 100% Gratuita"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  backgroundColor: theme.palette.mode === 'light' ? '#FEF3C7' : '#2D2817',
                  color: '#B45309',
                }}
              />
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.4rem', sm: '3.2rem', md: '3.8rem' },
                lineHeight: 1.08,
                mb: 2,
                color: theme.palette.mode === 'light' ? '#0F172A' : '#F8FAFC',
              }}
            >
              Protege tu salud y el futuro de tu familia con{' '}
              <span className="gradient-text-orange">Eos Protección</span>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.18rem' },
                color: 'text.secondary',
                mb: 3.5,
                lineHeight: 1.6,
                maxWidth: 580,
              }}
            >
              Con la asesoría personalizada de <strong>Adriana Martínez</strong> (Lic. G082442), accede a planes de
              salud con subsidio <strong>Obamacare desde $0/mes</strong>, seguros de vida patrimoniales, odontología
              sin esperas, accidentes y rentas diarias por hospitalización.
            </Typography>

            {/* Main Action Buttons */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<CalculateIcon />}
                onClick={() => onOpenQuoteModal()}
                sx={{
                  fontSize: '1.05rem',
                  py: 1.4,
                  px: 3,
                  boxShadow: '0 10px 25px -4px rgba(255, 111, 34, 0.5)',
                }}
              >
                Cotizar Mi Plan Ahora
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#25D366',
                  color: '#fff',
                  fontSize: '1rem',
                  py: 1.4,
                  px: 2.8,
                  '&:hover': {
                    backgroundColor: '#1EBE5D',
                    boxShadow: '0 8px 20px -4px rgba(37, 211, 102, 0.4)',
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
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                startIcon={<SearchIcon />}
                onClick={onOpenClientPortal}
                sx={{
                  fontSize: '0.95rem',
                  borderWidth: 2,
                  '&:hover': { borderWidth: 2 },
                }}
              >
                Soy Cliente
              </Button>
            </Stack>

            {/* Trust Benefits List */}
            <Grid container spacing={2}>
              {[
                'Planes Obamacare con subsidio y $0 deducible',
                'Odontología Sun Health sin plazos de espera',
                'Cobro en efectivo por días de hospitalización',
              ].map((item, idx) => (
                <Grid item xs={12} sm={4} key={idx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon sx={{ color: '#00A896', fontSize: 18 }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.3 }}>
                      {item}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Right Column: Adriana's Official Brand Card */}
          <Grid item xs={12} md={5}>
            <Card
              sx={{
                background:
                  theme.palette.mode === 'light'
                    ? 'linear-gradient(145deg, #FFFFFF 0%, #FFF5ED 100%)'
                    : 'linear-gradient(145deg, #1A2438 0%, #111A2C 100%)',
                border: '2px solid rgba(255, 111, 34, 0.25)',
                p: { xs: 1.5, sm: 2 },
                position: 'relative',
                overflow: 'visible',
              }}
            >
              {/* Floating Shield Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -16,
                  right: 24,
                  backgroundColor: '#0B4F9C',
                  color: '#fff',
                  px: 2,
                  py: 0.6,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.8,
                  boxShadow: '0 6px 16px rgba(11, 79, 156, 0.4)',
                }}
              >
                <SecurityIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  Agente Certificada
                </Typography>
              </Box>

              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3 }}>
                  {/* Avatar Representativo de Adriana con Paleta Naranja/Azul */}
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      sx={{
                        width: 90,
                        height: 90,
                        bgcolor: '#FF6F22',
                        fontSize: '2rem',
                        fontWeight: 800,
                        boxShadow: '0 8px 24px rgba(255, 111, 34, 0.4)',
                        border: '3px solid #FFFFFF',
                      }}
                    >
                      AM
                    </Avatar>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: -4,
                        right: -4,
                        bgcolor: '#0B4F9C',
                        color: '#fff',
                        borderRadius: '50%',
                        p: 0.5,
                        display: 'flex',
                      }}
                    >
                      <LocalHospitalIcon sx={{ fontSize: 16 }} />
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#FF6F22' }}>
                      Adriana Martínez
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                      Health & Life Insurance
                    </Typography>
                    <Chip
                      label="Lic. G082442"
                      size="small"
                      color="secondary"
                      sx={{ mt: 0.8, fontWeight: 700, height: 22, fontSize: '0.72rem' }}
                    />
                  </Box>
                </Box>

                {/* Direct Contact List from Flyer */}
                <Box
                  sx={{
                    backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : '#101726',
                    p: 2,
                    borderRadius: '14px',
                    border: '1px solid',
                    borderColor: theme.palette.mode === 'light' ? '#F1F5F9' : '#1E293B',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <Box
                    component="a"
                    href="tel:7868722310"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:hover': { color: '#FF6F22' },
                    }}
                  >
                    <Avatar sx={{ bgcolor: 'rgba(255, 111, 34, 0.12)', color: '#FF6F22', width: 34, height: 34 }}>
                      <PhoneInTalkIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        Línea Telefónica Directa
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        786-872-2310
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    component="a"
                    href="https://instagram.com/seguroscon_adriana"
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:hover': { color: '#0B4F9C' },
                    }}
                  >
                    <Avatar sx={{ bgcolor: 'rgba(11, 79, 156, 0.12)', color: '#0B4F9C', width: 34, height: 34 }}>
                      <InstagramIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        Instagram Oficial
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        @seguroscon_adriana
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    component="a"
                    href="mailto:Adrianamhealth@gmail.com"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:hover': { color: '#FF6F22' },
                    }}
                  >
                    <Avatar sx={{ bgcolor: 'rgba(0, 168, 150, 0.12)', color: '#00A896', width: 34, height: 34 }}>
                      <EmailIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        Correo Electrónico
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.88rem' }}>
                        Adrianamhealth@gmail.com
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Slogan & QR callout */}
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 1.5,
                    px: 2,
                    borderRadius: '12px',
                    background: 'linear-gradient(90deg, #FF6F22 0%, #FF8F4D 100%)',
                    color: '#fff',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: '0.05em' }}>
                    ¡TU SEGURO, TU TRANQUILIDAD!
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Asesoría en español y en todo el estado de la Florida
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Carriers Trust Bar */}
        <Box
          sx={{
            mt: { xs: 5, md: 8 },
            p: 3,
            borderRadius: '20px',
            backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : '#141E30',
            border: '1px solid',
            borderColor: theme.palette.mode === 'light' ? '#E2E8F0' : '#1E293B',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              textTransform: 'uppercase',
              fontWeight: 800,
              letterSpacing: '0.1em',
              color: 'text.secondary',
              mb: 2.5,
            }}
          >
            Aseguradoras y Programas Aliados
          </Typography>

          <Grid container spacing={3} alignItems="center" justifyContent="center">
            {/* Obamacare */}
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: '12px',
                  backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1A2538',
                }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0B4F9C 0%, #D32F2F 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '0.75rem',
                  }}
                >
                  ACA
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0B4F9C' }}>
                    OBAMACARE
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Subsidios y Prima desde $0
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Cigna */}
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: '12px',
                  backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1A2538',
                }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00A896 0%, #0B4F9C 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '0.75rem',
                  }}
                >
                  CG
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#00A896' }}>
                    Cigna.
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Salud, Vida & Accidentes
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Sun Health & Dental */}
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: '12px',
                  backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1A2538',
                }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FF6F22 0%, #F59E0B 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '0.75rem',
                  }}
                >
                  SH
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FF6F22' }}>
                    Sun Health & Dental
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Sin Plazos de Espera
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
