import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HealingIcon from '@mui/icons-material/Healing';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CheckIcon from '@mui/icons-material/Check';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export default function ProductCards({ products, onSelectProductToQuote }) {
  const theme = useTheme();

  // Mapeo de íconos y detalles visuales específicos
  const getProductMeta = (slug) => {
    switch (slug) {
      case 'seguro-salud':
        return {
          icon: <HealthAndSafetyIcon sx={{ fontSize: 36, color: '#0B4F9C' }} />,
          color: '#0B4F9C',
          bgColor: 'rgba(11, 79, 156, 0.08)',
          badgeColor: 'secondary',
        };
      case 'seguro-vida':
        return {
          icon: <FavoriteIcon sx={{ fontSize: 36, color: '#FF6F22' }} />,
          color: '#FF6F22',
          bgColor: 'rgba(255, 111, 34, 0.08)',
          badgeColor: 'primary',
        };
      case 'seguro-odontologia':
        return {
          icon: <MedicalServicesIcon sx={{ fontSize: 36, color: '#00A896' }} />,
          color: '#00A896',
          bgColor: 'rgba(0, 168, 150, 0.08)',
          badgeColor: 'info',
        };
      case 'seguro-accidentes':
        return {
          icon: <HealingIcon sx={{ fontSize: 36, color: '#D97706' }} />,
          color: '#D97706',
          bgColor: 'rgba(217, 119, 6, 0.08)',
          badgeColor: 'warning',
        };
      case 'seguro-hospitalizacion':
        return {
          icon: <LocalHospitalIcon sx={{ fontSize: 36, color: '#DC2626' }} />,
          color: '#DC2626',
          bgColor: 'rgba(220, 38, 38, 0.08)',
          badgeColor: 'error',
        };
      default:
        return {
          icon: <HealthAndSafetyIcon sx={{ fontSize: 36, color: '#FF6F22' }} />,
          color: '#FF6F22',
          bgColor: 'rgba(255, 111, 34, 0.08)',
          badgeColor: 'primary',
        };
    }
  };

  return (
    <Box sx={{ py: { xs: 6, md: 10 } }} id="productos-coberturas">
      <Container maxWidth="lg">
        {/* Encabezado de Sección */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
          <Chip
            label="COBERTURAS DISPONIBLES"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 800, mb: 1.5, letterSpacing: '0.08em' }}
          />
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.6rem', md: '3rem' },
              fontWeight: 800,
              mb: 2,
            }}
          >
            Protección a tu medida, sin sorpresas
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              maxWidth: 700,
              mx: 'auto',
              fontSize: { xs: '0.95rem', md: '1.1rem' },
            }}
          >
            Descubre las 5 líneas de seguros que representamos directamente con las aseguradoras líderes en el mercado.
          </Typography>
        </Box>

        {/* Tarjetas de Cobertura */}
        <Grid container spacing={3.5}>
          {products.map((product) => {
            const meta = getProductMeta(product.slug);
            const features = product.features ? product.features.split(',') : [];

            return (
              <Grid item xs={12} md={product.slug === 'seguro-salud' || product.slug === 'seguro-vida' ? 6 : 4} key={product.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    border: '1px solid',
                    borderColor: theme.palette.mode === 'light' ? '#E2E8F0' : '#1E293B',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      borderColor: meta.color,
                      boxShadow: `0 16px 36px -12px ${meta.color}35`,
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.5, sm: 3.5 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Badge Superior */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                      <Box
                        sx={{
                          width: 58,
                          height: 58,
                          borderRadius: '16px',
                          backgroundColor: meta.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {meta.icon}
                      </Box>
                      <Chip
                        label={product.badge}
                        size="small"
                        color={meta.badgeColor}
                        sx={{ fontWeight: 700, px: 0.5 }}
                      />
                    </Box>

                    {/* Título y Aseguradoras */}
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
                      {product.name}
                    </Typography>

                    <Typography variant="caption" sx={{ color: meta.color, fontWeight: 700, mb: 2, display: 'block' }}>
                      Aseguradoras: {product.carriers}
                    </Typography>

                    {/* Descripción oficial del Flyer */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        mb: 2.5,
                        lineHeight: 1.6,
                        minHeight: 48,
                      }}
                    >
                      {product.long_desc}
                    </Typography>

                    {/* Lista de Beneficios */}
                    <Box sx={{ mt: 'auto', mb: 3 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          textTransform: 'uppercase',
                          fontWeight: 800,
                          letterSpacing: '0.06em',
                          color: 'text.secondary',
                          display: 'block',
                          mb: 1,
                        }}
                      >
                        Lo que incluye:
                      </Typography>
                      <List dense disablePadding>
                        {features.slice(0, 4).map((f, i) => (
                          <ListItem key={i} disableGutters sx={{ py: 0.4 }}>
                            <ListItemIcon sx={{ minWidth: 24 }}>
                              <CheckIcon sx={{ fontSize: 16, color: meta.color }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={f.trim()}
                              primaryTypographyProps={{
                                fontSize: '0.82rem',
                                color: 'text.primary',
                                fontWeight: 500,
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    {/* Botones de Acción */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => onSelectProductToQuote(product.name)}
                        sx={{
                          backgroundColor: meta.color,
                          '&:hover': {
                            backgroundColor: meta.color,
                            opacity: 0.9,
                          },
                        }}
                      >
                        Cotizar
                      </Button>
                      <Button
                        variant="outlined"
                        component="a"
                        href={`https://wa.me/17868722310?text=Hola%20Adriana,%20deseo%20m%C3%A1s%20detalles%20sobre%20el%20${encodeURIComponent(product.name)}`}
                        target="_blank"
                        rel="noreferrer"
                        sx={{
                          borderColor: '#25D366',
                          color: '#25D366',
                          minWidth: 44,
                          px: 1.5,
                          '&:hover': {
                            borderColor: '#1EBE5D',
                            backgroundColor: 'rgba(37, 211, 102, 0.08)',
                          },
                        }}
                      >
                        <WhatsAppIcon sx={{ fontSize: 18 }} />
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
