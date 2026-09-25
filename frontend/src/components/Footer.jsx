import React from 'react';
import { Box, Container, Typography, Grid, Link, Chip, IconButton, useTheme } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function Footer({ onOpenQuoteModal, onOpenClientPortal }) {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.mode === 'light' ? '#0F172A' : '#070B14',
        color: '#F8FAFC',
        pt: 8,
        pb: 12, // Espacio para la barra móvil inferior
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* Columna 1: Marca & Datos de la Agente */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #FF6F22 0%, #0B4F9C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShieldIcon sx={{ color: '#fff', fontSize: 24 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                EOS <span style={{ color: '#FF6F22' }}>PROTECCIÓN</span>
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2, lineHeight: 1.6 }}>
              <strong>Adriana Martínez</strong> • Health & Life Insurance Specialist.<br />
              Licencia Oficial del Estado de la Florida: <strong>Lic. G082442</strong>.
            </Typography>

            <Typography variant="subtitle2" sx={{ color: '#FF6F22', fontWeight: 800, mb: 2 }}>
              "¡TU SEGURO, TU TRANQUILIDAD!"
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                component="a"
                href="https://wa.me/17868722310"
                target="_blank"
                sx={{ bgcolor: '#25D366', color: '#fff', '&:hover': { bgcolor: '#1EBE5D' } }}
              >
                <WhatsAppIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton
                component="a"
                href="https://instagram.com/seguroscon_adriana"
                target="_blank"
                sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', '&:hover': { bgcolor: '#E1306C' } }}
              >
                <InstagramIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton
                component="a"
                href="tel:7868722310"
                sx={{ bgcolor: '#FF6F22', color: '#fff', '&:hover': { bgcolor: '#E0530A' } }}
              >
                <PhoneIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Grid>

          {/* Columna 2: Coberturas */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#F8FAFC', mb: 2 }}>
              Líneas de Protección
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                • Seguro de Salud (Obamacare / ACA)
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                • Seguro de Vida (Patrimonial & Término)
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                • Seguro de Odontología (Sun Health & Dental)
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                • Seguro de Accidentes (Protección de Ingresos)
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                • Seguro de Hospitalización (Efectivo por día internado)
              </Typography>
            </Box>
          </Grid>

          {/* Columna 3: Contacto Directo */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#F8FAFC', mb: 2 }}>
              Atención Personalizada
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>
              <strong>Teléfono Directo:</strong> 786-872-2310
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>
              <strong>Instagram:</strong> @seguroscon_adriana
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
              <strong>Correo:</strong> Adrianamhealth@gmail.com
            </Typography>

            <Chip
              label="Cobertura en todo Florida, EE.UU."
              sx={{ bgcolor: 'rgba(255, 111, 34, 0.15)', color: '#FF8F4D', fontWeight: 700 }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#64748B', display: 'block', maxWidth: 800, mx: 'auto', mb: 1 }}>
            Aviso de Transparencia: Adriana Martínez es una agente de seguros licenciada independiente (Lic. G082442) en el estado de Florida. No está afiliada de manera exclusiva al gobierno federal ni al Mercado de Seguros de Salud, operando conforme a las regulaciones de CMS y el Departamento de Servicios Financieros de Florida.
          </Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
            © {new Date().getFullYear()} Eos Protección • Adriana Martínez. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
