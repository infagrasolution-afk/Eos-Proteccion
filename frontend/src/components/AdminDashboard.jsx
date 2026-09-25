import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip,
  Avatar,
  Divider,
  useTheme,
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PolicyIcon from '@mui/icons-material/Policy';
import WarningIcon from '@mui/icons-material/Warning';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import LockIcon from '@mui/icons-material/Lock';

import { api } from '../services/api';

export default function AdminDashboard({ currentUser, onLogout, initialTab = 0 }) {
  const theme = useTheme();
  const [tabIndex, setTabIndex] = useState(initialTab);

  // Datos
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [claims, setClaims] = useState([]);
  const [systemUsers, setSystemUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Filtros
  const [clientSearch, setClientSearch] = useState('');
  const [policyCarrierFilter, setPolicyCarrierFilter] = useState('Todos');
  const [policyExpiringFilter, setPolicyExpiringFilter] = useState(false);

  // Modales
  const [openClientModal, setOpenClientModal] = useState(false);
  const [openPolicyModal, setOpenPolicyModal] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);

  // Form State Cliente
  const [clientForm, setClientForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    id_document: '',
    city_state: 'Miami, FL',
    notes: '',
  });

  // Form State Póliza
  const [policyForm, setPolicyForm] = useState({
    client_id: '',
    policy_number: '',
    insurance_type: 'Seguro de Salud',
    carrier: 'Obamacare',
    plan_name: '',
    monthly_premium: 0,
    subsidy_amount: 0,
    effective_date: new Date().toISOString().split('T')[0],
    renewal_date: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    coverage_details: '',
  });

  // Form State Nuevo Usuario (Superadmin)
  const [userForm, setUserForm] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'admin',
  });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [sData, cData, pData, qData, clData] = await Promise.all([
        api.getStats().catch(() => null),
        api.getClients().catch(() => []),
        api.getPolicies().catch(() => []),
        api.getQuotes().catch(() => []),
        api.getClaims().catch(() => []),
      ]);
      setStats(sData);
      setClients(cData);
      setPolicies(pData);
      setQuotes(qData);
      setClaims(clData);

      if (currentUser?.role === 'superadmin') {
        const uData = await api.getUsers().catch(() => []);
        setSystemUsers(uData);
      }
    } catch (err) {
      console.error('Error loading CRM data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [currentUser]);

  // Crear Cliente
  const handleSaveClient = async () => {
    if (!clientForm.full_name || !clientForm.phone) {
      alert('Nombre y teléfono son requeridos');
      return;
    }
    try {
      await api.createClient(clientForm);
      setOpenClientModal(false);
      setClientForm({ full_name: '', phone: '', email: '', id_document: '', city_state: 'Miami, FL', notes: '' });
      setActionSuccessMsg('¡Cliente registrado exitosamente!');
      setTimeout(() => setActionSuccessMsg(''), 4000);
      loadAllData();
    } catch (err) {
      alert('Error al guardar cliente: ' + err.message);
    }
  };

  // Crear Póliza
  const handleSavePolicy = async () => {
    if (!policyForm.client_id || !policyForm.policy_number || !policyForm.plan_name) {
      alert('Por favor completa los campos requeridos');
      return;
    }
    try {
      await api.createPolicy({
        ...policyForm,
        client_id: parseInt(policyForm.client_id),
        monthly_premium: parseFloat(policyForm.monthly_premium) || 0,
        subsidy_amount: parseFloat(policyForm.subsidy_amount) || 0,
      });
      setOpenPolicyModal(false);
      setActionSuccessMsg('¡Póliza emitida y cerrada exitosamente!');
      setTimeout(() => setActionSuccessMsg(''), 4000);
      loadAllData();
    } catch (err) {
      alert('Error creando póliza: ' + err.message);
    }
  };

  // Convertir Lead en Cliente y Preparar Emisión de Póliza
  const handleConvertLead = async (lead) => {
    try {
      setLoading(true);
      const newClient = await api.convertLeadToClient(lead.id);

      // Pre-llenar formulario de póliza para cerrar el contrato de inmediato
      const defaultCarrier = lead.interested_products.includes('Odontología')
        ? 'Sun Health & Dental'
        : lead.interested_products.includes('Cigna')
        ? 'Cigna'
        : 'Obamacare';

      setPolicyForm({
        client_id: newClient.id,
        policy_number: `POL-${Date.now().toString().slice(-6)}`,
        insurance_type: lead.interested_products.split(',')[0].trim(),
        carrier: defaultCarrier,
        plan_name: 'Plan Titular Eos',
        monthly_premium: lead.estimated_premium || 0,
        subsidy_amount: lead.estimated_subsidy || 0,
        effective_date: new Date().toISOString().split('T')[0],
        renewal_date: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
        coverage_details: `Póliza generada a partir de cotización #${lead.id}`,
      });

      setActionSuccessMsg(`¡Prospecto ${lead.client_name} convertido en Cliente! Procediendo a emisión de póliza.`);
      setOpenPolicyModal(true);
      loadAllData();
    } catch (err) {
      alert('Error al convertir prospecto: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Crear Usuario (Superadmin)
  const handleCreateUser = async () => {
    if (!userForm.email || !userForm.password || !userForm.full_name) {
      alert('Todos los campos son requeridos');
      return;
    }
    try {
      await api.createUser(userForm);
      setOpenUserModal(false);
      setUserForm({ email: '', password: '', full_name: '', role: 'admin' });
      setActionSuccessMsg('¡Nuevo administrador creado exitosamente!');
      setTimeout(() => setActionSuccessMsg(''), 4000);
      loadAllData();
    } catch (err) {
      alert('Error creando usuario: ' + err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      await api.deleteUser(userId);
      loadAllData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleUpdateQuoteStatus = async (id, newStatus) => {
    try {
      await api.updateQuoteStatus(id, newStatus);
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateClaimStatus = async (id, newStatus) => {
    try {
      await api.updateClaimStatus(id, newStatus);
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.full_name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.phone.includes(clientSearch) ||
      (c.email && c.email.toLowerCase().includes(clientSearch.toLowerCase()))
  );

  const filteredPolicies = policies.filter((p) => {
    if (policyCarrierFilter !== 'Todos' && p.carrier !== policyCarrierFilter) return false;
    if (policyExpiringFilter && p.days_until_renewal > 30) return false;
    return true;
  });

  const isSuperadmin = currentUser?.role === 'superadmin';

  return (
    <Box sx={{ py: { xs: 3, md: 5 }, minHeight: '85vh' }}>
      <Container maxWidth="xl">
        {/* Banner de Usuario Activo */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            mb: 3,
            borderRadius: '16px',
            bgcolor: isSuperadmin ? 'rgba(11, 79, 156, 0.08)' : 'rgba(255, 111, 34, 0.08)',
            border: isSuperadmin ? '1px solid #BFDBFE' : '1px solid #FED7AA',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: isSuperadmin ? '#0B4F9C' : '#FF6F22' }}>
              {isSuperadmin ? <AdminPanelSettingsIcon /> : <HowToRegIcon />}
            </Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  {currentUser ? currentUser.full_name : 'Adriana Martínez'}
                </Typography>
                <Chip
                  label={isSuperadmin ? 'Superadministrador (CEO)' : 'Administradora / Agente'}
                  size="small"
                  color={isSuperadmin ? 'secondary' : 'primary'}
                  sx={{ fontWeight: 800, height: 22 }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Sesión activa: {currentUser ? currentUser.email : 'adrianamhealth@gmail.com'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="outlined" startIcon={<RefreshIcon />} onClick={loadAllData}>
              Actualizar
            </Button>
            <Button size="small" color="error" variant="outlined" startIcon={<LogoutIcon />} onClick={onLogout}>
              Salir
            </Button>
          </Box>
        </Box>

        {actionSuccessMsg && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {actionSuccessMsg}
          </Alert>
        )}

        {/* Cabecera del CRM */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Consola de Operaciones • <span style={{ color: '#FF6F22' }}>Eos Protección</span>
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Gestión comercial de prospectos, clientes, pólizas, aseguradoras y siniestros.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenClientModal(true)}
              size="small"
            >
              Nuevo Cliente
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<PolicyIcon />}
              onClick={() => setOpenPolicyModal(true)}
              size="small"
            >
              Nueva Póliza
            </Button>
          </Box>
        </Box>

        {/* Métricas Ejecutivas / KPI Cards */}
        {stats && (
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card sx={{ borderLeft: '5px solid #0B4F9C' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                    Clientes Registrados
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: '#0B4F9C' }}>
                    {stats.total_clients}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    En cartera activa
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Card sx={{ borderLeft: '5px solid #10B981' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                    Pólizas Vigentes
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: '#10B981' }}>
                    {stats.active_policies}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Obamacare, Cigna, Sun
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Card sx={{ borderLeft: '5px solid #EF4444' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                    Renovaciones Próximas
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: '#EF4444' }}>
                    {stats.policies_due_soon}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#EF4444', fontWeight: 700 }}>
                    Vencen en &lt; 30 días
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Card sx={{ borderLeft: '5px solid #FF6F22' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                    Prospectos / Cotizaciones
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: '#FF6F22' }}>
                    {stats.new_leads}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#FF6F22', fontWeight: 700 }}>
                    Pendientes de contacto
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Card sx={{ borderLeft: '5px solid #8B5CF6' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                    Primas Gestionadas
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: '#8B5CF6' }}>
                    ${stats.total_monthly_volume}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Volumen mensual
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Pestañas de Navegación del CRM */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabIndex}
            onChange={(e, v) => setTabIndex(v)}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
            sx={{ px: 2 }}
          >
            <Tab icon={<PolicyIcon />} iconPosition="start" label={`Pólizas & Renovaciones (${policies.length})`} />
            <Tab icon={<PeopleAltIcon />} iconPosition="start" label={`Directorio de Clientes (${clients.length})`} />
            <Tab icon={<AssignmentIcon />} iconPosition="start" label={`Prospectos / Cotizador (${quotes.length})`} />
            <Tab icon={<LocalHospitalIcon />} iconPosition="start" label={`Siniestros & Hospitalización (${claims.length})`} />
            {isSuperadmin && (
              <Tab icon={<AdminPanelSettingsIcon />} iconPosition="start" label={`Gestión de Usuarios (${systemUsers.length})`} />
            )}
          </Tabs>
        </Paper>

        {/* TAB 0: PÓLIZAS */}
        {tabIndex === 0 && (
          <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                select
                size="small"
                label="Filtrar por Aseguradora"
                value={policyCarrierFilter}
                onChange={(e) => setPolicyCarrierFilter(e.target.value)}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="Todos">Todas las Aseguradoras</MenuItem>
                <MenuItem value="Obamacare">Obamacare</MenuItem>
                <MenuItem value="Cigna">Cigna</MenuItem>
                <MenuItem value="Sun Health & Dental">Sun Health & Dental</MenuItem>
              </TextField>

              <Button
                variant={policyExpiringFilter ? 'contained' : 'outlined'}
                color="error"
                size="small"
                startIcon={<WarningIcon />}
                onClick={() => setPolicyExpiringFilter(!policyExpiringFilter)}
              >
                {policyExpiringFilter ? 'Mostrando solo por vencer' : 'Ver solo por vencer (<30 días)'}
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ bgcolor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1A2538' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Póliza Nº</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Cliente</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Tipo de Seguro</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Aseguradora</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Plan</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Prima / Subsidio</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Vencimiento</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 800 }} align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPolicies.map((pol) => {
                    const isDue = pol.days_until_renewal <= 30;
                    return (
                      <TableRow key={pol.id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{pol.policy_number}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{pol.client_name}</TableCell>
                        <TableCell>{pol.insurance_type}</TableCell>
                        <TableCell>
                          <Chip
                            label={pol.carrier}
                            size="small"
                            color={pol.carrier === 'Obamacare' ? 'primary' : pol.carrier === 'Cigna' ? 'secondary' : 'warning'}
                            sx={{ fontWeight: 700 }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.85rem' }}>{pol.plan_name}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            ${pol.monthly_premium.toFixed(2)}/m
                          </Typography>
                          {pol.subsidy_amount > 0 && (
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Subsidio: ${pol.subsidy_amount}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: isDue ? 800 : 500, color: isDue ? '#EF4444' : 'inherit' }}>
                            {pol.renewal_date}
                          </Typography>
                          <Chip
                            label={pol.days_until_renewal < 0 ? 'Vencida' : `En ${pol.days_until_renewal} días`}
                            size="small"
                            color={isDue ? 'error' : 'default'}
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={pol.status}
                            size="small"
                            color={pol.status === 'Activa' ? 'success' : isDue ? 'warning' : 'default'}
                            sx={{ fontWeight: 700 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Avisar renovación por WhatsApp">
                            <IconButton
                              size="small"
                              component="a"
                              href={`https://wa.me/17868722310?text=Hola%20${encodeURIComponent(pol.client_name)},%20te%20saluda%20Adriana%20Mart%C3%ADnez%20de%20Eos%20Protecci%C3%B3n.%20Tu%20p%C3%B3liza%20${pol.policy_number}%20est%C3%A1%20pr%C3%B3xima%20a%20vencer.`}
                              target="_blank"
                              sx={{ color: '#25D366' }}
                            >
                              <WhatsAppIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* TAB 1: CLIENTES */}
        {tabIndex === 1 && (
          <Box>
            <Box sx={{ mb: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <TextField
                size="small"
                label="Buscar cliente por nombre, teléfono o email"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                sx={{ width: { xs: '100%', sm: 380 } }}
              />
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenClientModal(true)}>
                Agregar Cliente
              </Button>
            </Box>

            <Grid container spacing={2.5}>
              {filteredClients.map((client) => (
                <Grid item xs={12} sm={6} md={4} key={client.id}>
                  <Card>
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          {client.full_name}
                        </Typography>
                        <Chip label={client.status} size="small" color={client.status === 'Activo' ? 'success' : 'warning'} />
                      </Box>

                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                        {client.city_state} • {client.id_document || 'Sin Doc'}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<PhoneIcon />}
                          component="a"
                          href={`tel:${client.phone}`}
                          sx={{ flexGrow: 1 }}
                        >
                          {client.phone}
                        </Button>
                        <IconButton
                          size="small"
                          component="a"
                          href={`https://wa.me/1${client.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(client.full_name)},%20te%20escribe%20Adriana%20Mart%C3%ADnez%20de%20Eos%20Protecci%C3%B3n.`}
                          target="_blank"
                          sx={{ bgcolor: '#25D366', color: '#fff', '&:hover': { bgcolor: '#1EBE5D' } }}
                        >
                          <WhatsAppIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>

                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#FF6F22', display: 'block', mb: 0.5 }}>
                        Pólizas asociadas ({client.policies ? client.policies.length : 0}):
                      </Typography>
                      {client.policies && client.policies.length > 0 ? (
                        client.policies.map((p, i) => (
                          <Typography key={i} variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                            • {p.carrier} - {p.insurance_type} ({p.policy_number})
                          </Typography>
                        ))
                      ) : (
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                          Sin pólizas registradas aún.
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* TAB 2: PROSPECTOS / COTIZADOR (CON BOTÓN CONVERTIR A CLIENTE) */}
        {tabIndex === 2 && (
          <Box>
            <Alert severity="info" sx={{ mb: 2.5 }}>
              Estos son los prospectos que han solicitado cotización en la web. Al contactarlos y llegar a un acuerdo, presiona <strong>"Convertir en Cliente y Emitir Póliza"</strong> para crear automáticamente su ficha de cliente y cerrar el contrato.
            </Alert>

            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ bgcolor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1A2538' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Fecha</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Prospecto</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Contacto Rápido</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Servicios de Interés</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Ingreso Est.</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 800 }} align="right">Cierre de Póliza</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quotes.map((q) => {
                    const isClosed = q.status.includes('Cerrado') || q.status.includes('Cliente');
                    return (
                      <TableRow key={q.id} hover>
                        <TableCell sx={{ fontSize: '0.82rem' }}>
                          {new Date(q.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                            {q.client_name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Zip: {q.zip_code} • {q.household_members} pers.
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<WhatsAppIcon />}
                              component="a"
                              href={`https://wa.me/1${q.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(q.client_name)},%20te%20saluda%20Adriana%20Mart%C3%ADnez%20de%20Eos%20Protecci%C3%B3n.%20Recib%C3%AD%20tu%20solicitud%20de%20cotizaci%C3%B3n%20para%20${encodeURIComponent(q.interested_products)}.`}
                              target="_blank"
                              sx={{
                                color: '#25D366',
                                borderColor: '#25D366',
                                textTransform: 'none',
                                fontSize: '0.78rem',
                              }}
                            >
                              WhatsApp
                            </Button>
                            <IconButton size="small" component="a" href={`tel:${q.phone}`} color="primary">
                              <PhoneIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 220 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#0B4F9C', fontSize: '0.85rem' }}>
                            {q.interested_products}
                          </Typography>
                          {q.notes && (
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                              Nota: {q.notes}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.85rem' }}>
                          ${q.annual_income.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={q.status}
                            size="small"
                            color={isClosed ? 'success' : q.status === 'Contactado' ? 'secondary' : 'warning'}
                            sx={{ fontWeight: 700 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            {!isClosed ? (
                              <Button
                                variant="contained"
                                size="small"
                                color="success"
                                startIcon={<HowToRegIcon />}
                                onClick={() => handleConvertLead(q)}
                                sx={{ fontWeight: 700, textTransform: 'none', fontSize: '0.78rem' }}
                              >
                                Convertir en Cliente y Emitir
                              </Button>
                            ) : (
                              <Chip label="Cliente Creado" color="success" variant="outlined" size="small" />
                            )}

                            <TextField
                              select
                              size="small"
                              value={q.status}
                              onChange={(e) => handleUpdateQuoteStatus(q.id, e.target.value)}
                              sx={{ minWidth: 110 }}
                            >
                              <MenuItem value="Pendiente de Contacto">Pendiente</MenuItem>
                              <MenuItem value="Contactado">Contactado</MenuItem>
                              <MenuItem value="Cotizado">Cotizado</MenuItem>
                              <MenuItem value="Cerrado / Cliente Creado">Cerrado</MenuItem>
                              <MenuItem value="No Interesado">No Interesado</MenuItem>
                            </TextField>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* TAB 3: SINIESTROS */}
        {tabIndex === 3 && (
          <Box>
            <Alert severity="info" sx={{ mb: 2.5 }}>
              <strong>Cobertura de Hospitalización:</strong> Indemnizaciones por días de internación calculadas a razón de $300 USD / día.
            </Alert>

            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ bgcolor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1A2538' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Código</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Asegurado</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Tipo de Asistencia</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Días Internado</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Indemnización</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Fecha Incidente</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 800 }} align="right">Gestión</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {claims.map((cl) => (
                    <TableRow key={cl.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{cl.claim_code}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{cl.client_name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{cl.phone}</Typography>
                      </TableCell>
                      <TableCell>{cl.claim_type}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{cl.hospital_days} días</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#10B981', fontSize: '1.05rem' }}>
                        ${cl.estimated_payout.toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{cl.incident_date}</TableCell>
                      <TableCell>
                        <Chip
                          label={cl.status}
                          size="small"
                          color={cl.status === 'Aprobado' ? 'success' : cl.status === 'En Revisión' ? 'warning' : 'primary'}
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          select
                          size="small"
                          value={cl.status}
                          onChange={(e) => handleUpdateClaimStatus(cl.id, e.target.value)}
                          sx={{ minWidth: 130 }}
                        >
                          <MenuItem value="Registrado">Registrado</MenuItem>
                          <MenuItem value="En Revisión">En Revisión</MenuItem>
                          <MenuItem value="Aprobado">Aprobado</MenuItem>
                          <MenuItem value="Indemnizado">Indemnizado</MenuItem>
                          <MenuItem value="Rechazado">Rechazado</MenuItem>
                        </TextField>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* TAB 4: GESTIÓN DE USUARIOS (SUPERADMIN ONLY) */}
        {isSuperadmin && tabIndex === 4 && (
          <Box>
            <Box sx={{ mb: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Control de Usuarios y Administradores del Sistema
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<PersonAddIcon />}
                onClick={() => setOpenUserModal(true)}
              >
                Nuevo Administrador
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ bgcolor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1A2538' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Nombre Completo</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Correo Electrónico</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Rol</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Fecha Registro</TableCell>
                    <TableCell sx={{ fontWeight: 800 }} align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {systemUsers.map((u) => (
                    <TableRow key={u.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>#{u.id}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{u.full_name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={u.role === 'superadmin' ? 'Superadministrador' : 'Administradora'}
                          color={u.role === 'superadmin' ? 'secondary' : 'primary'}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip label={u.is_active ? 'Activo' : 'Inactivo'} color={u.is_active ? 'success' : 'default'} size="small" />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        {u.role !== 'superadmin' && (
                          <IconButton size="small" color="error" onClick={() => handleDeleteUser(u.id)}>
                            <DeleteIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* MODAL CREAR CLIENTE */}
        <Dialog open={openClientModal} onClose={() => setOpenClientModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800 }}>Registrar Nuevo Asegurado</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Nombre Completo"
                  value={clientForm.full_name}
                  onChange={(e) => setClientForm({ ...clientForm, full_name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Teléfono Móvil"
                  value={clientForm.phone}
                  onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Documento / SSN (Últimos 4)"
                  value={clientForm.id_document}
                  onChange={(e) => setClientForm({ ...clientForm, id_document: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ciudad / Estado"
                  value={clientForm.city_state}
                  onChange={(e) => setClientForm({ ...clientForm, city_state: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Notas de la Asesora"
                  value={clientForm.notes}
                  onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenClientModal(false)}>Cancelar</Button>
            <Button variant="contained" color="primary" onClick={handleSaveClient}>
              Guardar Asegurado
            </Button>
          </DialogActions>
        </Dialog>

        {/* MODAL CREAR / EMITIR PÓLIZA */}
        <Dialog open={openPolicyModal} onClose={() => setOpenPolicyModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800 }}>Emitir y Cerrar Póliza</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  required
                  label="Asignar a Cliente"
                  value={policyForm.client_id}
                  onChange={(e) => setPolicyForm({ ...policyForm, client_id: e.target.value })}
                >
                  {clients.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.full_name} ({c.phone})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Número de Póliza"
                  placeholder="Ej: OBA-2026-11802"
                  value={policyForm.policy_number}
                  onChange={(e) => setPolicyForm({ ...policyForm, policy_number: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Aseguradora"
                  value={policyForm.carrier}
                  onChange={(e) => setPolicyForm({ ...policyForm, carrier: e.target.value })}
                >
                  <MenuItem value="Obamacare">Obamacare (ACA)</MenuItem>
                  <MenuItem value="Cigna">Cigna</MenuItem>
                  <MenuItem value="Sun Health & Dental">Sun Health & Dental</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Línea de Seguro"
                  value={policyForm.insurance_type}
                  onChange={(e) => setPolicyForm({ ...policyForm, insurance_type: e.target.value })}
                >
                  <MenuItem value="Seguro de Salud">Seguro de Salud</MenuItem>
                  <MenuItem value="Seguro de Vida">Seguro de Vida</MenuItem>
                  <MenuItem value="Seguro de Odontología">Seguro de Odontología</MenuItem>
                  <MenuItem value="Seguro de Accidentes">Seguro de Accidentes</MenuItem>
                  <MenuItem value="Seguro de Hospitalización">Seguro de Hospitalización</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Nombre del Plan"
                  placeholder="Ej: Silver HMO Advantage"
                  value={policyForm.plan_name}
                  onChange={(e) => setPolicyForm({ ...policyForm, plan_name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Prima Mensual ($)"
                  value={policyForm.monthly_premium}
                  onChange={(e) => setPolicyForm({ ...policyForm, monthly_premium: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Subsidio Mensual ($)"
                  value={policyForm.subsidy_amount}
                  onChange={(e) => setPolicyForm({ ...policyForm, subsidy_amount: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de Inicio"
                  InputLabelProps={{ shrink: true }}
                  value={policyForm.effective_date}
                  onChange={(e) => setPolicyForm({ ...policyForm, effective_date: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de Renovación"
                  InputLabelProps={{ shrink: true }}
                  value={policyForm.renewal_date}
                  onChange={(e) => setPolicyForm({ ...policyForm, renewal_date: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Detalles de Cobertura"
                  placeholder="Deducible $0, Cobertura preventiva 100%, red de especialistas"
                  value={policyForm.coverage_details}
                  onChange={(e) => setPolicyForm({ ...policyForm, coverage_details: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenPolicyModal(false)}>Cancelar</Button>
            <Button variant="contained" color="secondary" onClick={handleSavePolicy}>
              Guardar y Emitir Póliza
            </Button>
          </DialogActions>
        </Dialog>

        {/* MODAL CREAR USUARIO (SUPERADMIN) */}
        <Dialog open={openUserModal} onClose={() => setOpenUserModal(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 800 }}>Crear Nuevo Administrador</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                fullWidth
                label="Nombre Completo"
                value={userForm.full_name}
                onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
              />
              <TextField
                fullWidth
                label="Correo Electrónico"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              />
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
              />
              <TextField
                select
                fullWidth
                label="Rol del Usuario"
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
              >
                <MenuItem value="admin">Administrador / Agente</MenuItem>
                <MenuItem value="superadmin">Superadministrador</MenuItem>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenUserModal(false)}>Cancelar</Button>
            <Button variant="contained" color="secondary" onClick={handleCreateUser}>
              Crear Usuario
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
