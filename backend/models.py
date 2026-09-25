from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, Date, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(120), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    role = Column(String(30), default="admin") # "superadmin" o "admin"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="quote_request") # quote_request, policy_renewal, claim
    is_read = Column(Boolean, default=False)
    lead_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class AgentProfile(Base):
    __tablename__ = "agent_profiles"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), default="Adriana Martínez")
    title = Column(String(150), default="Health & Life Insurance Specialist")
    license_number = Column(String(50), default="Lic. G082442")
    slogan = Column(String(200), default="¡TU SEGURO, TU TRANQUILIDAD!")
    phone = Column(String(30), default="786-872-2310")
    whatsapp = Column(String(30), default="17868722310")
    instagram = Column(String(80), default="@seguroscon_adriana")
    email = Column(String(120), default="Adrianamhealth@gmail.com")
    location = Column(String(120), default="Florida, Estados Unidos")
    bio = Column(Text, default="Asesora certificada de seguros de salud (Obamacare/ACA), vida y seguros complementarios. Comprometida con brindar protección real y accesible a cada familia.")

class InsuranceProduct(Base):
    __tablename__ = "insurance_products"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(50), unique=True, index=True)
    name = Column(String(100), nullable=False)
    short_desc = Column(Text, nullable=False)
    long_desc = Column(Text, nullable=False)
    icon_name = Column(String(50), default="health")
    badge = Column(String(50), default="Popular")
    carriers = Column(String(200), default="Obamacare, Cigna, Sun Health & Dental")
    features = Column(Text) # JSON string or comma-separated
    base_starting_price = Column(Float, default=0.0)

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False, index=True)
    email = Column(String(120), index=True)
    phone = Column(String(30), nullable=False, index=True)
    id_document = Column(String(50)) # SSN last 4 or ID
    date_of_birth = Column(Date, nullable=True)
    city_state = Column(String(100), default="Miami, FL")
    status = Column(String(30), default="Activo") # Prospecto, Activo, En Renovación, Inactivo
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    policies = relationship("Policy", back_populates="client", cascade="all, delete-orphan")

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    policy_number = Column(String(80), unique=True, index=True, nullable=False)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    insurance_type = Column(String(80), nullable=False) # Salud (Obamacare), Vida, Odontología, Accidentes, Hospitalización
    carrier = Column(String(80), nullable=False) # Obamacare, Cigna, Sun Health & Dental, etc.
    plan_name = Column(String(150), nullable=False)
    monthly_premium = Column(Float, default=0.0)
    subsidy_amount = Column(Float, default=0.0)
    effective_date = Column(Date, nullable=False)
    renewal_date = Column(Date, nullable=False)
    status = Column(String(40), default="Activa") # Activa, Por Vencer, En Trámite, Vencida, Cancelada
    coverage_details = Column(Text, nullable=True)
    beneficiaries = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    client = relationship("Client", back_populates="policies")
    claims = relationship("Claim", back_populates="policy", cascade="all, delete-orphan")

class QuoteLead(Base):
    __tablename__ = "quote_leads"

    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String(150), nullable=False)
    phone = Column(String(30), nullable=False)
    email = Column(String(120), nullable=True)
    zip_code = Column(String(20), default="33101")
    age = Column(Integer, default=30)
    annual_income = Column(Float, default=30000.0)
    household_members = Column(Integer, default=1)
    interested_products = Column(String(200), default="Seguro de Salud")
    estimated_subsidy = Column(Float, default=0.0)
    estimated_premium = Column(Float, default=0.0)
    status = Column(String(40), default="Nuevo") # Nuevo, Contactado, Cotizado, Cerrado, No Interesado
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    claim_code = Column(String(50), unique=True, index=True)
    policy_id = Column(Integer, ForeignKey("policies.id"), nullable=True)
    client_name = Column(String(150), nullable=False)
    phone = Column(String(30), nullable=False)
    claim_type = Column(String(80), nullable=False) # Hospitalización, Accidente, Odontología, Consulta Preventiva
    hospital_days = Column(Integer, default=0)
    hospital_name = Column(String(150), nullable=True)
    estimated_payout = Column(Float, default=0.0)
    status = Column(String(40), default="En Revisión") # Registrado, En Revisión, Aprobado, Indemnizado, Rechazado
    incident_date = Column(Date, nullable=False)
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    policy = relationship("Policy", back_populates="claims")
