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
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Chip,
  Divider,
  Paper,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import ShieldIcon from '@mui/icons-material/Shield';
import { api, setAuthToken } from '../services/api';

export default function LoginModal({ open, onClose, onLoginSuccess }) {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor ingresa correo y contraseña.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const data = await api.login(email, password);
      setAuthToken(data.access_token, data.user);
      onLoginSuccess(data.user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
    setErrorMsg('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              bgcolor: '#0B4F9C',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LockOutlinedIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Acceso Administrativo
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Eos Protección • Consola de Gestión
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2.5 }}>
            {errorMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Correo Electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ej: adrianamhealth@gmail.com"
            autoFocus
          />

          <TextField
            fullWidth
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{ mt: 1, py: 1.3, fontWeight: 700 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            ACCESOS RÁPIDOS DE PRUEBA
          </Typography>
        </Divider>

        {/* Cuentas de Acceso Rápido */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Botón Superadmin */}
          <Paper
            variant="outlined"
            onClick={() => handleQuickLogin('superadmin@eosproteccion.com', 'SuperAdmin2026!')}
            sx={{
              p: 1.5,
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: email === 'superadmin@eosproteccion.com' ? '1.5px solid #0B4F9C' : '1px solid #E2E8F0',
              bgcolor: email === 'superadmin@eosproteccion.com' ? 'rgba(11, 79, 156, 0.05)' : 'background.paper',
              '&:hover': { borderColor: '#0B4F9C' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <AdminPanelSettingsIcon sx={{ color: '#0B4F9C' }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  Superadministrador (CEO)
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  superadmin@eosproteccion.com
                </Typography>
              </Box>
            </Box>
            <Chip label="Superadmin" size="small" color="secondary" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }} />
          </Paper>

          {/* Botón Adriana Martínez */}
          <Paper
            variant="outlined"
            onClick={() => handleQuickLogin('adrianamhealth@gmail.com', 'Adriana2026!')}
            sx={{
              p: 1.5,
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: email === 'adrianamhealth@gmail.com' ? '1.5px solid #FF6F22' : '1px solid #E2E8F0',
              bgcolor: email === 'adrianamhealth@gmail.com' ? 'rgba(255, 111, 34, 0.05)' : 'background.paper',
              '&:hover': { borderColor: '#FF6F22' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <PersonIcon sx={{ color: '#FF6F22' }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  Adriana Martínez
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  adrianamhealth@gmail.com
                </Typography>
              </Box>
            </Box>
            <Chip label="Agente / Admin" size="small" color="primary" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }} />
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} size="small">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
