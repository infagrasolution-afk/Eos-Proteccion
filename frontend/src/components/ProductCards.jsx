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
          icon: <HealthAndSafetyIcon sx={{ fontSize: 32, color: '#0B4F9C' }} />,
          color: '#0B4F9C',
          bgColor: 'rgba(11, 79, 156, 0.08)',
          badgeColor: 'secondary',
        };
      case 'seguro-vida':
        return {
          icon: <FavoriteIcon sx={{ fontSize: 32, color: '#FF6F22' }} />,
          color: '#FF6F22',
          bgColor: 'rgba(255, 111, 34, 0.08)',
          badgeColor: 'primary',
        };
      case 'seguro-odontologia':
        return {
          icon: <MedicalServicesIcon sx={{ fontSize: 32, color: '#00A896' }} />,
          color: '#00A896',
          bgColor: 'rgba(0, 168, 150, 0.08)',
          badgeColor: 'info',
        };
      case 'seguro-accidentes':
        return {
          icon: <HealingIcon sx={{ fontSize: 32, color: '#D97706' }} />,
          color: '#D97706',
          bgColor: 'rgba(217, 119, 6, 0.08)',
          badgeColor: 'warning',
        };
      case 'seguro-hospitalizacion':
        return {
          icon: <LocalHospitalIcon sx={{ fontSize: 32, color: '#DC2626' }} />,
          color: '#DC2626',
          bgColor: 'rgba(220, 38, 38, 0.08)',
          badgeColor: 'error',
        };
      default:
        return {
          icon: <HealthAndSafetyIcon sx={{ fontSize: 32, color: '#FF6F22' }} />,
          color: '#FF6F22',
          bgColor: 'rgba(255, 111, 34, 0.08)',
          badgeColor: 'primary',
        };
    }
  };

  return (
    <Box sx={{ py: { xs: 5, md: 8 }, bgcolor: theme.palette.mode === 'light' ? '#FAFCFE' : '#0E1626' }} id="servicios-coberturas">
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

        {/* Tarjetas Limpias y Organizadas */}
        <Grid container spacing={3}>
          {products.map((product) => {
            const meta = getProductMeta(product.slug);

            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={product.slug === 'seguro-salud' || product.slug === 'seguro-vida' ? 6 : 4}
                key={product.id}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 3,
                    borderRadius: '18px',
                    border: '1px solid',
                    borderColor: theme.palette.mode === 'light' ? '#E2E8F0' : '#1E293B',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: meta.color,
                      boxShadow: `0 12px 28px -10px ${meta.color}25`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
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

                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.8 }}>
                      {product.name}
                    </Typography>

                    <Typography variant="caption" sx={{ color: meta.color, fontWeight: 700, mb: 1.5, display: 'block' }}>
                      {product.carriers}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        mb: 3,
                        lineHeight: 1.6,
                        flexGrow: 1,
                      }}
                    >
                      {product.long_desc}
                    </Typography>

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
                        py: 1,
                        fontSize: '0.88rem',
                        '&:hover': {
                          borderColor: meta.color,
                          bgcolor: meta.bgColor,
                        },
                      }}
                    >
                      Seleccionar y Cotizar
                    </Button>
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
