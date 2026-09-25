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
  useTheme,
  alpha,
} from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HealingIcon from '@mui/icons-material/Healing';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function ProductCards({ products = [], onSelectProductToQuote }) {
  const theme = useTheme();

  // Función para obtener el ícono representativo de cada póliza
  const getProductIcon = (slug) => {
    switch (slug) {
      case 'seguro-salud':
        return <HealthAndSafetyIcon sx={{ fontSize: 28, color: '#0B4F9C' }} />;
      case 'seguro-vida':
        return <FavoriteIcon sx={{ fontSize: 28, color: '#0B4F9C' }} />;
      case 'seguro-odontologia':
        return <MedicalServicesIcon sx={{ fontSize: 28, color: '#0B4F9C' }} />;
      case 'seguro-accidentes':
        return <HealingIcon sx={{ fontSize: 28, color: '#0B4F9C' }} />;
      case 'seguro-hospitalizacion':
        return <LocalHospitalIcon sx={{ fontSize: 28, color: '#0B4F9C' }} />;
      default:
        return <HealthAndSafetyIcon sx={{ fontSize: 28, color: '#0B4F9C' }} />;
    }
  };

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 9 },
        bgcolor: theme.palette.mode === 'light' ? '#FAFCFE' : '#0E1626',
      }}
      id="servicios-coberturas"
    >
      <Container maxWidth="lg">
        {/* Encabezado Principal */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="overline"
            sx={{
              fontWeight: 800,
              color: '#FF6F22',
              letterSpacing: '0.12em',
              fontSize: '0.85rem',
            }}
          >
            NUESTRAS COBERTURAS
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.9rem', sm: '2.4rem', md: '2.8rem' },
              fontWeight: 800,
              mt: 0.5,
              mb: 1.5,
            }}
          >
            Planes diseñados para tu tranquilidad
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              maxWidth: 640,
              mx: 'auto',
              fontSize: { xs: '0.98rem', md: '1.05rem' },
              lineHeight: 1.6,
            }}
          >
            Representamos a las aseguradoras líderes en Florida para darte la mejor cobertura al menor costo.
          </Typography>
        </Box>

        {/* Tarjetas 100% Homogéneas, Simétricas y Responsivas */}
        <Grid container spacing={3} justifyContent="center" alignItems="stretch">
          {products.map((product) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={product.id}
              sx={{ display: 'flex' }}
            >
              <Card
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  p: { xs: 2.5, sm: 3 },
                  borderRadius: '16px',
                  bgcolor: theme.palette.mode === 'light' ? '#FFFFFF' : '#131C31',
                  border: '1.5px solid',
                  borderColor: theme.palette.mode === 'light' ? '#E2E8F0' : '#1E293B',
                  boxShadow:
                    theme.palette.mode === 'light'
                      ? '0 4px 16px rgba(11, 79, 156, 0.04)'
                      : '0 4px 16px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.25s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    borderColor: '#FF6F22',
                    boxShadow: '0 16px 32px -8px rgba(255, 111, 34, 0.22)',
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 0,
                    '&:last-child': { pb: 0 },
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Fila Superior: Ícono Estilizado y Badge de Marca Unificado */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2.2,
                      minHeight: 48,
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        bgcolor: alpha('#0B4F9C', 0.08),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {getProductIcon(product.slug)}
                    </Box>
                    <Chip
                      label={product.badge}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.73rem',
                        bgcolor: alpha('#FF6F22', 0.09),
                        color: '#FF6F22',
                        border: `1px solid ${alpha('#FF6F22', 0.22)}`,
                        borderRadius: '6px',
                        px: 0.5,
                      }}
                    />
                  </Box>

                  {/* Título de la Póliza (Altura Fija Homogénea) */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      fontSize: '1.2rem',
                      lineHeight: 1.3,
                      mb: 0.8,
                      minHeight: 48,
                      display: 'flex',
                      alignItems: 'center',
                      color: 'text.primary',
                    }}
                  >
                    {product.name}
                  </Typography>

                  {/* Aseguradoras Aliadas (Estilo Idéntico) */}
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#0B4F9C',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      mb: 1.5,
                      minHeight: 24,
                      display: 'flex',
                      alignItems: 'center',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {product.carriers}
                  </Typography>

                  {/* Descripción Breve (Límites de Línea Idénticos) */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                      fontSize: '0.9rem',
                      mb: 2.5,
                      flexGrow: 1,
                      minHeight: 72,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {product.long_desc}
                  </Typography>

                  {/* Beneficio de Asesoría Incluida */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.8,
                      mb: 2.5,
                      py: 0.8,
                      px: 1.2,
                      borderRadius: '8px',
                      bgcolor:
                        theme.palette.mode === 'light'
                          ? 'rgba(11, 79, 156, 0.04)'
                          : 'rgba(255, 255, 255, 0.04)',
                    }}
                  >
                    <CheckCircleIcon
                      sx={{ fontSize: 16, color: '#0B4F9C' }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: 'text.secondary',
                        fontSize: '0.78rem',
                      }}
                    >
                      Asesoría y trámite 100% gratuito
                    </Typography>
                  </Box>

                  {/* Botón de Acción Idéntico en Todas las Tarjetas */}
                  <Box sx={{ mt: 'auto' }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      endIcon={<ArrowDownwardIcon />}
                      onClick={() => onSelectProductToQuote(product.name)}
                      sx={{
                        borderColor: '#FF6F22',
                        color: '#FF6F22',
                        fontWeight: 700,
                        borderRadius: '10px',
                        py: 1.15,
                        fontSize: '0.88rem',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          borderColor: '#FF6F22',
                          bgcolor: '#FF6F22',
                          color: '#FFFFFF',
                          boxShadow: '0 6px 18px rgba(255, 111, 34, 0.3)',
                        },
                      }}
                    >
                      Seleccionar y Cotizar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

