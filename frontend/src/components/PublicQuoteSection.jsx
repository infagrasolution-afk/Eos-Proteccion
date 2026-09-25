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
  Checkbox,
  FormControlLabel,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  useTheme,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircle';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EmailIcon from '@mui/icons-material/Email';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

const SERVICES_LIST = [
  { name: 'Seguro de Salud (Obamacare / ACA)', desc: 'Subsidios del gobierno y planes desde $0 prima', color: '#0B4F9C' },
  { name: 'Seguro de Vida', desc: 'Protección patrimonial y beneficios en vida', color: '#FF6F22' },
  { name: 'Seguro de Odontología (Sun Health)', desc: 'Sin plazos de espera para limpiezas y tratamientos', color: '#00A896' },
  { name: 'Seguro de Accidentes', desc: 'Indemnización en efectivo directa para ti 24 horas', color: '#D97706' },
  { name: 'Seguro de Hospitalización', desc: 'Dinero diario en efectivo por cada día internado', color: '#DC2626' },
];

export default function PublicQuoteSection() {
  const theme = useTheme();
  const [selectedServices, setSelectedServices] = useState(['Seguro de Salud (Obamacare / ACA)']);
  const [formData, setFormData] = useState({
    client_name: '',
    phone: '',
    email: '',
    zip_code: '33101',
    annual_income: 32000,
    household_members: 1,
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleService = (serviceName) => {
    if (selectedServices.includes(serviceName)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== serviceName));
      }
    } else {
      setSelectedServices([...selectedServices, serviceName]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.client_name.trim() || !formData.phone.trim()) {
      setErrorMsg('Por favor ingresa al menos tu nombre y número de teléfono.');
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
        notes: formData.notes || 'Solicitud enviada desde el formulario público de la web',
      });

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF6F22', '#0B4F9C', '#00A896'],
      });

      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Error al enviar la solicitud. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppUrl = () => {
    const text = `¡Hola Adriana! Acabo de enviar una solicitud de cotización en Eos Protección:
*Nombre:* ${formData.client_name}
*Teléfono:* ${formData.phone}
*Servicios:* ${selectedServices.join(', ')}
*Ingreso Est.:* $${formData.annual_income} (${formData.household_members} pers.)
Quedo a la espera de tu asesoría para cerrar la póliza. ¡Gracias!`;
    return `https://wa.me/17868722310?text=${encodeURIComponent(text)}`;
  };

  return (
    <Box
      id="formulario-cotizacion"
      sx={{
        py: { xs: 7, md: 10 },
        background:
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #FFFFFF 0%, #FFF7F2 100%)'
            : 'linear-gradient(180deg, #0B1120 0%, #111A2E 100%)',
      }}
    >
      <Container maxWidth="lg">
        {/* Cabecera del Módulo */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Chip
            icon={<NotificationsActiveIcon sx={{ fontSize: '16px !important', color: '#FF6F22 !important' }} />}
            label="SOLICITUD DIRECTA SIN REGISTRO PREVIO"
            sx={{
              fontWeight: 800,
              bgcolor: theme.palette.mode === 'light' ? '#FFF0E6' : '#2D1B10',
              color: '#FF6F22',
              border: '1px solid #FFD0B3',
              mb: 1.5,
              letterSpacing: '0.05em',
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2.1rem', sm: '2.8rem', md: '3.2rem' },
              fontWeight: 800,
              mb: 2,
            }}
          >
            Solicita tu Cotización con <span className="gradient-text-orange">Adriana Martínez</span>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              maxWidth: 720,
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.15rem' },
            }}
          >
            Elige los servicios de tu interés y coloca tus datos. Al presionar <strong>Enviar</strong>, se enviará una
            notificación a la aplicación de Adriana y un correo electrónico para que se comunique contigo y cerrar tu póliza.
          </Typography>
        </Box>

        {/* Tarjeta del Formulario */}
        <Card
          sx={{
            maxWidth: 900,
            mx: 'auto',
            border: '2px solid rgba(255, 111, 34, 0.25)',
            boxShadow: '0 20px 40px -15px rgba(255, 111, 34, 0.15)',
            borderRadius: '24px',
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            {submitted ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'rgba(0, 168, 150, 0.12)',
                    color: '#00A896',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2.5,
                  }}
                >
                  <CheckCircleOutlineIcon sx={{ fontSize: 52 }} />
                </Box>

                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>
                  ¡Solicitud Enviada con Éxito!
                </Typography>

                <Box
                  sx={{
                    maxWidth: 550,
                    mx: 'auto',
                    bgcolor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1A2538',
                    p: 2.5,
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    mb: 3,
                    textAlign: 'left',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <EmailIcon sx={{ color: '#0B4F9C', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Correo enviado a: <strong>Adrianamhealth@gmail.com</strong>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NotificationsActiveIcon sx={{ color: '#FF6F22', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Notificación en app: <strong>Registrada en tiempo real para Adriana</strong>
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto', mb: 3.5 }}>
                  Adriana Martínez revisará tu solicitud y se pondrá en contacto contigo a través de tu teléfono (
                  <strong>{formData.phone}</strong>) para resolver dudas y cerrar tu cobertura.
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<WhatsAppIcon />}
                    component="a"
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      bgcolor: '#25D366',
                      color: '#fff',
                      px: 3.5,
                      py: 1.4,
                      fontWeight: 700,
                      '&:hover': { bgcolor: '#1EBE5D' },
                    }}
                  >
                    Abrir Chat con Adriana por WhatsApp
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
                        annual_income: 32000,
                        household_members: 1,
                        notes: '',
                      });
                    }}
                  >
                    Nueva Solicitud
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit}>
                {errorMsg && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {errorMsg}
                  </Alert>
                )}

                {/* Paso 1: Selección de Servicios */}
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, color: '#FF6F22' }}>
                  1. Selecciona los servicios que deseas cotizar:
                </Typography>
                <Grid container spacing={1.5} sx={{ mb: 3.5 }}>
                  {SERVICES_LIST.map((srv, idx) => {
                    const isSelected = selectedServices.includes(srv.name);
                    return (
                      <Grid item xs={12} sm={6} key={idx}>
                        <Paper
                          variant="outlined"
                          onClick={() => toggleService(srv.name)}
                          sx={{
                            p: 1.8,
                            borderRadius: '14px',
                            cursor: 'pointer',
                            borderColor: isSelected ? srv.color : 'divider',
                            bgcolor: isSelected ? `${srv.color}0D` : 'background.paper',
                            transition: 'all 0.2s ease',
                            '&:hover': { borderColor: srv.color },
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={isSelected}
                                onChange={() => toggleService(srv.name)}
                                sx={{ color: srv.color, '&.Mui-checked': { color: srv.color } }}
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                  {srv.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                  {srv.desc}
                                </Typography>
                              </Box>
                            }
                            sx={{ width: '100%', m: 0 }}
                          />
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>

                {/* Paso 2: Datos de Contacto y Elegibilidad */}
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5, color: '#0B4F9C' }}>
                  2. Tus datos de contacto y hogar (para calcular subsidio ACA):
                </Typography>

                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Tu Nombre Completo"
                      placeholder="Ej: José Fernández"
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Teléfono / Celular (WhatsApp)"
                      placeholder="Ej: 786-872-2310"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Correo Electrónico (Opcional)"
                      placeholder="ejemplo@correo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Código Postal (Florida)"
                      placeholder="Ej: 33101, 33012"
                      value={formData.zip_code}
                      onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Ingreso Anual Aproximado ($ USD)"
                      helperText="Para calcular ayuda del gobierno en Obamacare"
                      value={formData.annual_income}
                      onChange={(e) => setFormData({ ...formData, annual_income: e.target.value })}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Personas en tu Declaración de Taxes"
                      helperText="Tú, cónyuge y dependientes"
                      value={formData.household_members}
                      onChange={(e) => setFormData({ ...formData, household_members: e.target.value })}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Comentarios o mejor horario para llamarte (Opcional)"
                      placeholder="Ej: Me gustaría información para mí y mi hijo, por favor llamarme por la tarde."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </Grid>
                </Grid>

                {/* Botón de Envío */}
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading || selectedServices.length === 0}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    sx={{
                      fontSize: '1.1rem',
                      py: 1.5,
                      px: 5,
                      boxShadow: '0 12px 28px -6px rgba(255, 111, 34, 0.5)',
                    }}
                  >
                    {loading ? 'Enviando solicitud...' : 'Enviar Solicitud a Adriana Martínez'}
                  </Button>
                  <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: 'text.secondary' }}>
                    🔒 Tus datos están protegidos y serán tratados de manera confidencial por Adriana Martínez (Lic. G082442).
                  </Typography>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
