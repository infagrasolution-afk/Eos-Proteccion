from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, Field

# --- Perfil de Agente ---
class AgentProfileBase(BaseModel):
    full_name: str
    title: str
    license_number: str
    slogan: str
    phone: str
    whatsapp: str
    instagram: str
    email: str
    location: str
    bio: str

class AgentProfileOut(AgentProfileBase):
    id: int
    class Config:
        from_attributes = True

# --- Productos de Seguro ---
class InsuranceProductBase(BaseModel):
    slug: str
    name: str
    short_desc: str
    long_desc: str
    icon_name: str
    badge: str
    carriers: str
    features: str
    base_starting_price: float

class InsuranceProductOut(InsuranceProductBase):
    id: int
    class Config:
        from_attributes = True

# --- Clientes ---
class ClientBase(BaseModel):
    full_name: str
    email: Optional[str] = None
    phone: str
    id_document: Optional[str] = None
    date_of_birth: Optional[date] = None
    city_state: Optional[str] = "Miami, FL"
    status: Optional[str] = "Activo"
    notes: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    id_document: Optional[str] = None
    date_of_birth: Optional[date] = None
    city_state: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

# --- Pólizas ---
class PolicyBase(BaseModel):
    policy_number: str
    client_id: int
    insurance_type: str
    carrier: str
    plan_name: str
    monthly_premium: float
    subsidy_amount: Optional[float] = 0.0
    effective_date: date
    renewal_date: date
    status: Optional[str] = "Activa"
    coverage_details: Optional[str] = None
    beneficiaries: Optional[str] = None

class PolicyCreate(PolicyBase):
    pass

class PolicyOut(PolicyBase):
    id: int
    created_at: datetime
    client_name: Optional[str] = None
    days_until_renewal: Optional[int] = None
    class Config:
        from_attributes = True

class ClientWithPolicies(ClientBase):
    id: int
    created_at: datetime
    policies: List[PolicyOut] = []
    class Config:
        from_attributes = True

# --- Cotizaciones y Leads ---
class QuoteLeadCreate(BaseModel):
    client_name: str
    phone: str
    email: Optional[str] = None
    zip_code: Optional[str] = "33101"
    age: Optional[int] = 30
    annual_income: Optional[float] = 32000.0
    household_members: Optional[int] = 1
    interested_products: str
    estimated_subsidy: Optional[float] = 0.0
    estimated_premium: Optional[float] = 0.0
    notes: Optional[str] = None

class QuoteLeadOut(QuoteLeadCreate):
    id: int
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class QuoteLeadStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

# --- Siniestros e Indemnizaciones ---
class ClaimCreate(BaseModel):
    policy_id: Optional[int] = None
    client_name: str
    phone: str
    claim_type: str
    hospital_days: Optional[int] = 0
    hospital_name: Optional[str] = None
    incident_date: date
    description: str

class ClaimOut(ClaimCreate):
    id: int
    claim_code: str
    estimated_payout: float
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class ClaimStatusUpdate(BaseModel):
    status: str
    estimated_payout: Optional[float] = None

# --- Estadísticas Generales ---
class DashboardStats(BaseModel):
    total_clients: int
    active_policies: int
    policies_due_soon: int
    new_leads: int
    total_monthly_volume: float
    carrier_breakdown: dict
    product_distribution: dict
