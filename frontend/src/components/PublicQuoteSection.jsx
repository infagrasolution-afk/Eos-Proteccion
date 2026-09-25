import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  useTheme,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckIcon from '@mui/icons-material/Check';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

const AVAILABLE_SERVICES = [
  { name: 'Seguro de Salud (Obamacare)', desc: 'Prima desde $0', color: '#0B4F9C' },
  { name: 'Seguro de Vida', desc: 'Patrimonial & Término', color: '#FF6F22' },
  { name: 'Seguro de Odontología', desc: 'Sin plazos de espera', color: '#00A896' },
  { name: 'Seguro de Accidentes', desc: 'Protección 24/7', color: '#D97706' },
  { name: 'Seguro de Hospitalización', desc: 'Dinero diario en efectivo', color: '#DC2626' },
];

export default function PublicQuoteSection({ selectedServices = [], setSelectedServices }) {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    client_name: '',
    phone: '',
    email: '',
    zip_code: '33101',
    annual_income: 30000,
    household_members: 1,
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleService = (srvName) => {
    if (selectedServices.includes(srvName)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== srvName));
      }
    } else {
      setSelectedServices([...selectedServices, srvName]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.client_name.trim() || !formData.phone.trim()) {
      setErrorMsg('Por favor completa tu nombre y número de teléfono.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await api.submitQuote({
        client_name: formData.client_name,
        phone: formData.phone,
        email: formData.email,
        zip_code: formData.zip_code,
        age: 35,
        annual_income: parseFloat(formData.annual_income) || 30000,
        household_members: parseInt(formData.household_members) || 1,
        interested_products: selectedServices.join(', '),
        notes: formData.notes || 'Solicitud enviada desde el portal web',
      });

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6F22', '#0B4F9C', '#00A896'],
      });

      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Error al enviar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppUrl = () => {
    const text = `¡Hola Adriana! Acabo de enviar una solicitud de cotización en Eos Protección:
*Nombre:* ${formData.client_name}
*Teléfono:* ${formData.phone}
*Servicios:* ${selectedServices.join(', ')}
Quedo atento a tu respuesta para cerrar la póliza. ¡Muchas gracias!`;
    return `https://wa.me/17868722310?text=${encodeURIComponent(text)}`;
  };

  return (
    <Box
      id="formulario-cotizacion"
      sx={{
        py: { xs: 6, md: 9 },
        bgcolor: theme.palette.mode === 'light' ? '#FFFFFF' : '#0B1120',
      }}
    >
      <Container maxWidth="md">
        {/* Encabezado Conciso */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Chip
            label="COTIZACIÓN RÁPIDA SIN COMPROMISO"
            size="small"
            color="primary"
            sx={{ fontWeight: 800, mb: 1, letterSpacing: '0.05em' }}
          />
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
            Solicita tu Asesoría con <span style={{ color: '#FF6F22' }}>Adriana Martínez</span>
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 540, mx: 'auto' }}>
            Selecciona tus seguros de interés y déjanos tus datos. Recibirás contacto directo de Adriana para
            asesorarte y emitir tu póliza.
          </Typography>
        </Box>

        <Card
          sx={{
            borderRadius: '20px',
            border: '1.5px solid',
            borderColor: theme.palette.mode === 'light' ? '#E2E8F0' : '#1E293B',
            boxShadow: '0 12px 30px -10px rgba(0,0,0,0.06)',
            p: { xs: 2.5, sm: 4 },
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {submitted ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    bgcolor: 'rgba(0, 168, 150, 0.12)',
                    color: '#00A896',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <CheckCircleOutlineIcon sx={{ fontSize: 44 }} />
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                  ¡Solicitud Enviada a Adriana Martínez!
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 500, mx: 'auto', mb: 3 }}>
                  Se ha generado una notificación inmediata en la aplicación de Adriana y se envió un correo a{' '}
                  <strong>Adrianamhealth@gmail.com</strong>. Se comunicará contigo pronto.
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    startIcon={<WhatsAppIcon />}
                    component="a"
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ bgcolor: '#25D366', color: '#fff', '&:hover': { bgcolor: '#1EBE5D' } }}
                  >
                    Abrir Chat en WhatsApp
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        client_name: '',
                        phone: '',
                        email: '',
                        zip_code: '33101',
                        annual_income: 30000,
                        household_members: 1,
                        notes: '',
                      });
                    }}
                  >
                    Otra Consulta
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit}>
                {errorMsg && (
                  <Alert severity="error" sx={{ mb: 2.5 }}>
                    {errorMsg}
                  </Alert>
                )}

                {/* 1. Selección de Coberturas en Chips Grandes */}
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#FF6F22' }}>
                  1. Selecciona las coberturas que deseas:
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {AVAILABLE_SERVICES.map((srv) => {
                    const isSelected = selectedServices.includes(srv.name);
                    return (
                      <Chip
                        key={srv.name}
                        label={`${srv.name} • ${srv.desc}`}
                        icon={isSelected ? <CheckIcon sx={{ fontSize: '16px !important' }} /> : undefined}
                        onClick={() => toggleService(srv.name)}
                        color={isSelected ? 'primary' : 'default'}
                        variant={isSelected ? 'filled' : 'outlined'}
                        sx={{
                          py: 2,
                          px: 0.5,
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          borderColor: isSelected ? '#FF6F22' : 'divider',
                        }}
                      />
                    );
                  })}
                </Box>

                {/* 2. Datos de Contacto */}
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#0B4F9C' }}>
                  2. Tus datos para comunicarnos contigo:
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      size="small"
                      label="Tu Nombre Completo"
                      placeholder="Ej: Roberto Rivas"
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      size="small"
                      label="Teléfono Móvil (WhatsApp)"
                      placeholder="Ej: 786-872-2310"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Correo Electrónico (Opcional)"
                      placeholder="ejemplo@correo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Ingreso Anual Est. ($ USD)"
                      helperText="Opcional: ayuda a calcular tu subsidio Obamacare"
                      value={formData.annual_income}
                      onChange={(e) => setFormData({ ...formData, annual_income: e.target.value })}
                    />
                  </Grid>
                </Grid>

                {/* Botón de Envío */}
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading || selectedServices.length === 0}
                    startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                    sx={{
                      py: 1.3,
                      px: 4.5,
                      fontWeight: 700,
                      fontSize: '1rem',
                      boxShadow: '0 8px 20px -4px rgba(255, 111, 34, 0.4)',
                    }}
                  >
                    {loading ? 'Enviando...' : 'Enviar Solicitud a Adriana Martínez'}
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
