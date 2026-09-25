import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SecurityIcon from '@mui/icons-material/Security';
import { api } from '../services/api';

export default function ClientPortalModal({ open, onClose }) {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Siniestro rápido
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimHospitalDays, setClaimHospitalDays] = useState(2);
  const [claimDesc, setClaimDesc] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const data = await api.lookupClientPortal(query);
      if (data.found) {
        setResult(data);
      } else {
        setErrorMsg('No se encontraron pólizas activas con ese número o teléfono. Verifica los datos o comunícate con Adriana.');
      }
    } catch (err) {
      setErrorMsg('Error al conectar con la base de datos de pólizas.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClaim = async (policyNumber, clientName, phone) => {
    try {
      setLoading(true);
      await api.submitClaim({
        client_name: clientName,
        phone: phone,
        claim_type: 'Hospitalización / Asistencia',
        hospital_days: parseInt(claimHospitalDays) || 1,
        hospital_name: 'Centro Médico Florida',
        incident_date: new Date().toISOString().split('T')[0],
        description: claimDesc || `Siniestro reportado desde portal del asegurado para póliza ${policyNumber}`,
      });
      setClaimSuccess(true);
      setShowClaimForm(false);
    } catch (err) {
      alert('Error registrando reporte: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setQuery('');
    setErrorMsg('');
    setShowClaimForm(false);
    setClaimSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              bgcolor: '#0B4F9C',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <VerifiedUserIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Portal del Asegurado • Eos Protección
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Consulta tu carnet digital, estado de cobertura y reporta asistencias
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        {/* Buscador */}
        <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
          <Grid container spacing={1.5} alignItems="center">
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                size="medium"
                label="Ingresa tu Teléfono o Número de Póliza"
                placeholder="Ej: 786-455-8912 o OBA-2026-99412"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                size="large"
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}
                disabled={loading || !query.trim()}
                sx={{ height: 54 }}
              >
                Buscar Póliza
              </Button>
            </Grid>
          </Grid>
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.8, display: 'block' }}>
            Prueba de demostración: ingresa <strong>786-455-8912</strong> (Carlos Mendoza) o <strong>305-671-3340</strong> (Mariana Gómez)
          </Typography>
        </Box>

        {errorMsg && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {errorMsg}
          </Alert>
        )}

        {claimSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            ¡Tu reporte de siniestro ha sido enviado exitosamente al equipo de Adriana Martínez! Nos contactaremos contigo de inmediato.
          </Alert>
        )}

        {/* Resultados: Carnet Digital del Cliente */}
        {result && (
          <Box>
            <Box
              sx={{
                p: 2,
                mb: 3,
                borderRadius: '12px',
                bgcolor: theme.palette.mode === 'light' ? '#F1F5F9' : '#1E293B',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  {result.client.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {result.client.city_state} • Teléfono registrado: {result.client.phone}
                </Typography>
              </Box>
              <Chip label="Asegurado Activo" color="success" size="small" sx={{ fontWeight: 700 }} />
            </Box>

            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#FF6F22' }}>
              Pólizas Vinculadas ({result.policies.length}):
            </Typography>

            <Grid container spacing={2.5}>
              {result.policies.map((p, idx) => {
                const isDueSoon = p.days_remaining <= 30;
                return (
                  <Grid item xs={12} key={idx}>
                    <Card
                      sx={{
                        background:
                          theme.palette.mode === 'light'
                            ? 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)'
                            : 'linear-gradient(135deg, #131C2E 0%, #0F172A 100%)',
                        border: '1.5px solid',
                        borderColor: isDueSoon ? '#FF6F22' : '#0B4F9C',
                        position: 'relative',
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                          <Box>
                            <Chip
                              label={p.carrier}
                              size="small"
                              color={p.carrier === 'Obamacare' ? 'primary' : 'secondary'}
                              sx={{ fontWeight: 800, mb: 0.8 }}
                            />
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                              {p.plan_name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                              Póliza Nº: {p.policy_number}
                            </Typography>
                          </Box>

                          <Box sx={{ textAlign: 'right' }}>
                            <Chip
                              icon={isDueSoon ? <WarningAmberIcon /> : <VerifiedUserIcon />}
                              label={isDueSoon ? `Vence en ${p.days_remaining} días` : 'Cobertura Activa'}
                              color={isDueSoon ? 'warning' : 'success'}
                              size="small"
                              sx={{ fontWeight: 700 }}
                            />
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}>
                              Renovación: {p.renewal_date}
                            </Typography>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 1.5 }} />

                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                              Detalles de Cobertura:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {p.coverage_details}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                              Prima Mensual:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: p.monthly_premium === 0 ? '#10B981' : 'inherit' }}>
                              {p.monthly_premium === 0 ? '$0.00 / mes (100% Subsidio)' : `$${p.monthly_premium.toFixed(2)} / mes`}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 2.5 }}>
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            startIcon={<LocalHospitalIcon />}
                            onClick={() => setShowClaimForm(!showClaimForm)}
                          >
                            Reportar Hospitalización / Siniestro
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="secondary"
                            startIcon={<WhatsAppIcon />}
                            component="a"
                            href={`https://wa.me/17868722310?text=Hola%20Adriana,%20soy%20${encodeURIComponent(result.client.name)},%20tengo%20la%20p%C3%B3liza%20${p.policy_number}%20y%20necesito%20asistencia.`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            WhatsApp con Adriana
                          </Button>
                        </Box>

                        {/* Formulario rápido de reporte de siniestro */}
                        {showClaimForm && (
                          <Box sx={{ mt: 2.5, p: 2, bgcolor: theme.palette.mode === 'light' ? '#FFF5EE' : '#1A2333', borderRadius: '12px' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FF6F22', mb: 1 }}>
                              Reporte de Hospitalización / Asistencia Directa
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
                              Según el flyer oficial: "Recibes dinero por cada día internado en el hospital ($250 a $1,000/día)".
                            </Typography>

                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  type="number"
                                  label="Días internado en Hospital"
                                  value={claimHospitalDays}
                                  onChange={(e) => setClaimHospitalDays(e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={12} sm={8}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Motivo o centro médico"
                                  placeholder="Ej: Ingreso por apendicitis en Baptist Hospital"
                                  value={claimDesc}
                                  onChange={(e) => setClaimDesc(e.target.value)}
                                />
                              </Grid>
                            </Grid>

                            <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                              <Button size="small" onClick={() => setShowClaimForm(false)}>
                                Cancelar
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                onClick={() => handleRegisterClaim(p.policy_number, result.client.name, result.client.phone)}
                                disabled={loading}
                              >
                                {loading ? 'Enviando...' : 'Enviar Reporte para Indemnización'}
                              </Button>
                            </Box>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
