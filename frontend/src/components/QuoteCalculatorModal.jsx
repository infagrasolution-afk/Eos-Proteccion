import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Grid,
  Checkbox,
  FormControlLabel,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalculateIcon from '@mui/icons-material/Calculate';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

const steps = ['Coberturas', 'Datos de Elegibilidad', 'Cálculo Estimado', 'Confirmación'];

const PRODUCTS_LIST = [
  { name: 'Seguro de Salud (Obamacare/ACA)', key: 'salud', desc: 'Atención preventiva 100%, medicamentos, especialistas y urgencias' },
  { name: 'Seguro de Vida', key: 'vida', desc: 'Protección para tu familia y acumulación con beneficios en vida' },
  { name: 'Seguro de Odontología (Sun Health)', key: 'dental', desc: 'Sin plazos de espera para limpiezas, extracciones y tratamientos' },
  { name: 'Seguro de Accidentes', key: 'accidentes', desc: 'Indemnización en efectivo directa para ti 24 horas al día' },
  { name: 'Seguro de Hospitalización', key: 'hospital', desc: 'Dinero diario en efectivo ($250 a $1,000) por cada noche internado' },
];

export default function QuoteCalculatorModal({ open, onClose, defaultProduct = null }) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [selectedProducts, setSelectedProducts] = useState(
    defaultProduct ? [defaultProduct] : ['Seguro de Salud (Obamacare/ACA)']
  );
  const [formData, setFormData] = useState({
    client_name: '',
    phone: '',
    email: '',
    zip_code: '33101',
    age: 32,
    annual_income: 30000,
    household_members: 1,
    notes: '',
  });

  const [calculation, setCalculation] = useState({
    subsidy: 460,
    premium: 0,
    dentalCost: 0,
    hospitalPayoutPerDay: 300,
  });

  const handleToggleProduct = (productName) => {
    if (selectedProducts.includes(productName)) {
      setSelectedProducts(selectedProducts.filter((p) => p !== productName));
    } else {
      setSelectedProducts([...selectedProducts, productName]);
    }
  };

  const calculateEstimate = () => {
    const income = parseFloat(formData.annual_income) || 30000;
    const members = parseInt(formData.household_members) || 1;

    // FPL Benchmark
    const fpl = 15060 + (members - 1) * 5380;
    const ratio = income / fpl;

    let sub = 0;
    let basePrem = 0;

    if (selectedProducts.some((p) => p.includes('Salud') || p.includes('Obamacare'))) {
      if (ratio >= 1.0 && ratio <= 4.0) {
        sub = Math.max(250, Math.min(680, Math.round(720 - ratio * 105)));
        basePrem = ratio <= 1.5 ? 0 : Math.round((income * 0.028) / 12);
      } else {
        basePrem = 280;
      }
    }

    if (selectedProducts.some((p) => p.includes('Odontología'))) {
      basePrem += 19.99;
    }
    if (selectedProducts.some((p) => p.includes('Accidentes'))) {
      basePrem += 14.50;
    }
    if (selectedProducts.some((p) => p.includes('Hospitalización'))) {
      basePrem += 18.00;
    }

    setCalculation({
      subsidy: sub,
      premium: basePrem,
      dentalCost: 19.99,
      hospitalPayoutPerDay: 300,
    });
  };

  const handleNext = () => {
    if (activeStep === 1) {
      calculateEstimate();
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.submitQuote({
        client_name: formData.client_name || 'Prospecto Web',
        phone: formData.phone,
        email: formData.email,
        zip_code: formData.zip_code,
        age: parseInt(formData.age) || 30,
        annual_income: parseFloat(formData.annual_income) || 30000,
        household_members: parseInt(formData.household_members) || 1,
        interested_products: selectedProducts.join(', '),
        estimated_subsidy: calculation.subsidy,
        estimated_premium: calculation.premium,
        notes: `Cotización automática desde simulador web. Productos: ${selectedProducts.join(', ')}`,
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6F22', '#0B4F9C', '#00A896'],
      });

      setSuccess(true);
      setActiveStep(3);
    } catch (err) {
      console.error(err);
      alert('Hubo un detalle al enviar la cotización: ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setSuccess(false);
    onClose();
  };

  const getWhatsAppMessage = () => {
    const text = `¡Hola Adriana! Acabo de hacer una cotización en Eos Protección:
*Nombre:* ${formData.client_name || 'Cliente'}
*Teléfono:* ${formData.phone}
*Coberturas de interés:* ${selectedProducts.join(', ')}
*Ingreso estimado:* $${formData.annual_income}/año (${formData.household_members} personas)
*Subsidio estimado:* $${calculation.subsidy}/mes
*Prima estimada:* $${calculation.premium}/mes
¿Podrías ayudarme a tramitar mi póliza oficial? ¡Muchas gracias!`;
    return encodeURIComponent(text);
  };

  return (
    <Dialog open={open} onClose={handleReset} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              bgcolor: '#FF6F22',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CalculateIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              Cotizador Inteligente Eos Protección
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Calcula subsidios de Obamacare y coberturas en segundos
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleReset} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* PASO 1: SELECCIÓN DE COBERTURAS */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              ¿Qué tipo de protección necesitas para ti y tu familia?
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
              Puedes elegir una o varias coberturas complementarias:
            </Typography>

            <Grid container spacing={2}>
              {PRODUCTS_LIST.map((prod) => {
                const isSelected = selectedProducts.includes(prod.name);
                return (
                  <Grid item xs={12} key={prod.key}>
                    <Paper
                      variant="outlined"
                      onClick={() => handleToggleProduct(prod.name)}
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        borderColor: isSelected ? '#FF6F22' : 'divider',
                        backgroundColor: isSelected ? 'rgba(255, 111, 34, 0.05)' : 'background.paper',
                        transition: 'all 0.2s ease',
                        '&:hover': { borderColor: '#FF6F22' },
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleToggleProduct(prod.name)}
                            color="primary"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                              {prod.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {prod.desc}
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
          </Box>
        )}

        {/* PASO 2: DATOS DE ELEGIBILIDAD */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              Datos del hogar para estimar el subsidio del gobierno (ACA)
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Estos datos permiten calcular si calificas para planes de salud con $0 de prima mensual.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Código Postal (Florida)"
                  value={formData.zip_code}
                  onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                  placeholder="Ej: 33101, 33012"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Tu Edad"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Ingreso Anual Estimado ($ USD)"
                  helperText="Ingreso de tus taxes o formulario W2 / 1099"
                  value={formData.annual_income}
                  onChange={(e) => setFormData({ ...formData, annual_income: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Personas en tu Declaración de Impuestos"
                  helperText="Incluye cónyuge y dependientes"
                  value={formData.household_members}
                  onChange={(e) => setFormData({ ...formData, household_members: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* PASO 3: CÁLCULO ESTIMADO Y FORMULARIO DE CONTACTO */}
        {activeStep === 2 && (
          <Box>
            {/* Resumen del cálculo visual */}
            <Paper
              sx={{
                p: 3,
                borderRadius: '16px',
                background:
                  theme.palette.mode === 'light'
                    ? 'linear-gradient(135deg, #0B4F9C 0%, #1A5BB0 100%)'
                    : 'linear-gradient(135deg, #101F3B 0%, #071224 100%)',
                color: '#fff',
                mb: 3.5,
              }}
            >
              <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: '0.1em' }}>
                RESULTADO PRELIMINAR DE TU COTIZACIÓN
              </Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.85, display: 'block' }}>
                      Subsidio Gubernamental Estimado
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#38BDF8' }}>
                      ${calculation.subsidy} <span style={{ fontSize: '1rem', fontWeight: 500 }}>/ mes</span>
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Ayuda directa que paga el gobierno por ti
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.85, display: 'block' }}>
                      Tu Costo Mensual Estimado
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#4ADE80' }}>
                      ${calculation.premium} <span style={{ fontSize: '1rem', fontWeight: 500 }}>/ mes</span>
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {calculation.premium === 0 ? '¡Calificas para Plan con $0 Prima!' : 'Tarifa preferencial calculada'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              Para enviarte la propuesta formal con Cigna, Obamacare o Sun Health:
            </Typography>

            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Nombre Completo"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="Ej: Carlos Mendoza"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Teléfono / WhatsApp"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Ej: 786-872-2310"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Correo Electrónico (Opcional)"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ejemplo@correo.com"
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* PASO 4: ÉXITO Y ACCESO DIRECTO A ADRIANA */}
        {activeStep === 3 && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Box
              sx={{
                width: 72,
                height: 72,
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
              <CheckCircleIcon sx={{ fontSize: 44 }} />
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              ¡Cotización Registrada con Éxito!
            </Typography>

            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 500, mx: 'auto', mb: 3 }}>
              Adriana Martínez ha recibido tu solicitud y se comunicará contigo para confirmar los planes disponibles
              con red de médicos en tu área.
            </Typography>

            <Button
              variant="contained"
              size="large"
              startIcon={<WhatsAppIcon />}
              component="a"
              href={`https://wa.me/17868722310?text=${getWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                backgroundColor: '#25D366',
                color: '#fff',
                fontSize: '1.05rem',
                py: 1.5,
                px: 4,
                '&:hover': { backgroundColor: '#1EBE5D' },
              }}
            >
              Enviar Cotización por WhatsApp a Adriana
            </Button>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        {activeStep > 0 && activeStep < 3 && (
          <Button onClick={handleBack} disabled={loading}>
            Atrás
          </Button>
        )}

        {activeStep < 2 && (
          <Button variant="contained" onClick={handleNext} disabled={selectedProducts.length === 0}>
            Continuar
          </Button>
        )}

        {activeStep === 2 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !formData.phone}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <CalculateIcon />}
          >
            {loading ? 'Procesando...' : 'Finalizar y Recibir Propuesta'}
          </Button>
        )}

        {activeStep === 3 && (
          <Button variant="outlined" onClick={handleReset}>
            Cerrar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
