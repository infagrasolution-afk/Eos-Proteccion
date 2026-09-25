# 🛡️ Eos Protección — Sistema Web & Móvil para Agente de Seguros

> **Adriana Martínez** | Health & Life Insurance Specialist  
> **Lic. G082442** • Miami & Florida, EE.UU.  
> *"¡TU SEGURO, TU TRANQUILIDAD!"*

Plataforma integral web y móvil diseñada para la gestión de seguros de salud (**Obamacare / ACA**), vida patrimonial y seguros complementarios (**Sun Health & Dental**, **Cigna**). Incluye portal público interactivo con cotizador inteligente, portal de autoservicio del asegurado y consola administrativa CRM para la agente.

---

## 🚀 Tecnologías

* **Backend:** Python 3.14 + **FastAPI** + **SQLAlchemy** + **Pydantic**
* **Base de Datos:** **PostgreSQL** (con fallback a SQLite local)
* **Frontend:** **React** + **Vite** + **Material UI (MUI v5)**
* **Diseño & UX:** Paleta oficial corporativa (Naranja Atardecer `#FF6F22`, Azul Real `#0B4F9C`, Verde Vitalidad `#00A896`), soporte responsive y simulador móvil PWA.

---

## ✨ Características Principales

1. **Portal Público y Landing Page:**
   * Hero banner interactivo con credenciales oficiales (Lic. G082442) y llamada directa (`786-872-2310`).
   * Catálogo interactivo de las 5 líneas de seguros:
     * *Seguro de Salud* (Obamacare con subsidios y $0 prima).
     * *Seguro de Vida* (Protección patrimonial y beneficios en vida).
     * *Seguro de Odontología* (Sun Health & Dental sin plazos de espera).
     * *Seguro de Accidentes* (Indemnización 24/7 y cobertura de ingresos).
     * *Seguro de Hospitalización* (Dinero diario en efectivo por día internado).
   * Alianzas destacadas con **Obamacare (ACA)**, **Cigna** y **Sun Health & Dental**.

2. **Cotizador Inteligente con Cálculo en Vivo:**
   * Estimador interactivo de subsidio gubernamental según ingresos y dependientes.
   * Generación automática de mensaje pre-redactado para enviar a WhatsApp de Adriana con 1 clic.

3. **Portal del Asegurado ("Mi Póliza"):**
   * Carnet digital accesible ingresando número de póliza o teléfono.
   * Semáforo de días restantes para renovación (<30 días en alerta).
   * Módulo de reporte rápido de hospitalización y siniestros con cálculo de indemnización diaria.

4. **Consola CRM y Backoffice para la Agente:**
   * KPIs ejecutivos en tiempo real (Pólizas vigentes, renovaciones por vencer, volumen mensual bajo gestión).
   * Pestaña de Pólizas con filtros por aseguradora y alertas de vencimiento.
   * Directorio de clientes con contacto directo a WhatsApp.
   * Gestión de prospectos recibidos desde el cotizador web.
   * Registro y seguimiento de siniestros e indemnizaciones.

---

## 🌐 Despliegue en Render (Automático con Blueprint)

Este repositorio incluye el archivo [`render.yaml`](file:///c:/Users/USER/OneDrive/Desktop/Eos-Protección/render.yaml) preconfigurado para desplegar en Render con 1 clic:
1. **Base de Datos PostgreSQL:** Aprovisionada automáticamente en el plan de Render.
2. **Backend Web Service (FastAPI):** Configura Python 3.11, instala `requirements.txt`, ejecuta `uvicorn` y se enlaza automáticamente a la base de datos PostgreSQL.
3. **Frontend Static Site (React/Vite):** Compila la aplicación y se conecta al Web Service del backend mediante la variable `VITE_API_URL`.

### Pasos para desplegar en Render:
1. Inicia sesión en tu cuenta de [Render Dashboard](https://dashboard.render.com).
2. Haz clic en **New +** > **Blueprint**.
3. Conecta este repositorio: `https://github.com/infagrasolution-afk/Eos-Proteccion.git`.
4. Render detectará automáticamente el archivo `render.yaml` y creará la base de datos PostgreSQL, el servicio de FastAPI y el sitio web en React.
5. Haz clic en **Apply** y listo. ¡Tu sistema estará en línea con HTTPS gratuito!

---

## 🛠️ Instalación y Puesta en Marcha Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/infagrasolution-afk/Eos-Proteccion.git
cd Eos-Proteccion
```

### 2. Backend (FastAPI + Python)
```bash
cd backend
# Instalar dependencias
pip install -r requirements.txt

# (Opcional) Configurar PostgreSQL en .env:
# DATABASE_URL=postgresql://usuario:password@localhost:5432/eos_proteccion

# Iniciar servidor
uvicorn main:app --reload --port 8000
```
* API Docs interactiva: `http://localhost:8000/docs`

### 3. Frontend (React + Material UI)
```bash
cd ../frontend
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```
* Acceso frontend: `http://localhost:5173`

---

## 📞 Contacto del Agente

* **Teléfono:** 786-872-2310
* **Instagram:** [@seguroscon_adriana](https://instagram.com/seguroscon_adriana)
* **Correo:** Adrianamhealth@gmail.com
