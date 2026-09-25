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
} from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HealingIcon from '@mui/icons-material/Healing';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export default function ProductCards({ products = [], onSelectProductToQuote }) {
  const theme = useTheme();

  const getProductMeta = (slug) => {
    switch (slug) {
      case 'seguro-salud':
        return {
          icon: <HealthAndSafetyIcon sx={{ fontSize: 30, color: '#0B4F9C' }} />,
          color: '#0B4F9C',
          bgColor: 'rgba(11, 79, 156, 0.08)',
          badgeColor: 'secondary',
        };
      case 'seguro-vida':
        return {
          icon: <FavoriteIcon sx={{ fontSize: 30, color: '#FF6F22' }} />,
          color: '#FF6F22',
          bgColor: 'rgba(255, 111, 34, 0.08)',
          badgeColor: 'primary',
        };
      case 'seguro-odontologia':
        return {
          icon: <MedicalServicesIcon sx={{ fontSize: 30, color: '#00A896' }} />,
          color: '#00A896',
          bgColor: 'rgba(0, 168, 150, 0.08)',
          badgeColor: 'info',
        };
      case 'seguro-accidentes':
        return {
          icon: <HealingIcon sx={{ fontSize: 30, color: '#D97706' }} />,
          color: '#D97706',
          bgColor: 'rgba(217, 119, 6, 0.08)',
          badgeColor: 'warning',
        };
      case 'seguro-hospitalizacion':
        return {
          icon: <LocalHospitalIcon sx={{ fontSize: 30, color: '#DC2626' }} />,
          color: '#DC2626',
          bgColor: 'rgba(220, 38, 38, 0.08)',
          badgeColor: 'error',
        };
      default:
        return {
          icon: <HealthAndSafetyIcon sx={{ fontSize: 30, color: '#FF6F22' }} />,
          color: '#FF6F22',
          bgColor: 'rgba(255, 111, 34, 0.08)',
          badgeColor: 'primary',
        };
    }
  };

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 5, md: 8 },
        bgcolor: theme.palette.mode === 'light' ? '#FAFCFE' : '#0E1626',
      }}
      id="servicios-coberturas"
    >
      <Container maxWidth="lg">
        {/* Encabezado */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="overline"
            sx={{ fontWeight: 800, color: '#FF6F22', letterSpacing: '0.1em' }}
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
              maxWidth: 620,
              mx: 'auto',
              fontSize: { xs: '0.95rem', md: '1.05rem' },
            }}
          >
            Representamos a las aseguradoras líderes en Florida para darte la mejor cobertura al menor costo.
          </Typography>
        </Box>

        {/* Tarjetas 100% Homogéneas en Tamaño y Responsive */}
        <Grid container spacing={3} justifyContent="center" alignItems="stretch">
          {products.map((product) => {
            const meta = getProductMeta(product.slug);

            return (
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
                    borderRadius: '18px',
                    border: '1.5px solid',
                    borderColor: theme.palette.mode === 'light' ? '#E2E8F0' : '#1E293B',
                    transition: 'all 0.25s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      borderColor: meta.color,
                      boxShadow: `0 14px 28px -10px ${meta.color}30`,
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
                    {/* Fila Superior: Ícono y Badge */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          bgcolor: meta.bgColor,
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
                        sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                      />
                    </Box>

                    {/* Título de Póliza */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        fontSize: '1.15rem',
                        lineHeight: 1.25,
                        mb: 0.8,
                        minHeight: 30,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {product.name}
                    </Typography>

                    {/* Aseguradoras */}
                    <Typography
                      variant="caption"
                      sx={{
                        color: meta.color,
                        fontWeight: 700,
                        mb: 1.5,
                        display: 'block',
                        minHeight: 20,
                      }}
                    >
                      {product.carriers}
                    </Typography>

                    {/* Descripción Homogénea */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.6,
                        mb: 3,
                        flexGrow: 1,
                        minHeight: 72,
                      }}
                    >
                      {product.long_desc}
                    </Typography>

                    {/* Botón Alineado al Fondo de Cada Tarjeta */}
                    <Box sx={{ mt: 'auto', pt: 1 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        endIcon={<ArrowDownwardIcon />}
                        onClick={() => onSelectProductToQuote(product.name)}
                        sx={{
                          borderColor: meta.color,
                          color: meta.color,
                          fontWeight: 700,
                          borderRadius: '10px',
                          py: 1.1,
                          fontSize: '0.88rem',
                          '&:hover': {
                            borderColor: meta.color,
                            bgcolor: meta.bgColor,
                          },
                        }}
                      >
                        Seleccionar y Cotizar
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
