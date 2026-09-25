import os
from datetime import date, timedelta
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import engine, get_db, Base
from models import AgentProfile, InsuranceProduct, Client, Policy, QuoteLead, Claim
from schemas import (
    AgentProfileOut, InsuranceProductOut,
    ClientCreate, ClientUpdate, ClientBase,
    ClientWithPolicies,
    PolicyCreate, PolicyOut,
    QuoteLeadCreate, QuoteLeadOut, QuoteLeadStatusUpdate,
    ClaimCreate, ClaimOut, ClaimStatusUpdate,
    DashboardStats
)
from seed_data import seed

# Inicializar tablas y datos de prueba
Base.metadata.create_all(bind=engine)
try:
    seed()
except Exception as e:
    print("Seed skipped or already done:", e)

app = FastAPI(
    title="Eos Protección API",
    description="Backend oficial para Eos Protección - Agente Adriana Martínez Lic. G082442",
    version="1.0.0"
)

# Permitir conexiones desde cualquier puerto frontend local o remoto
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint de verificación de estado y bienvenida para Render
@app.get("/")
@app.get("/health")
def health_check():
    return {
        "status": "online",
        "app": "Eos Protección API",
        "agent": "Adriana Martínez",
        "license": "Lic. G082442"
    }

# ----------------- PERFIL DE AGENTE -----------------
@app.get("/api/profile", response_model=AgentProfileOut)
def get_agent_profile(db: Session = Depends(get_db)):
    profile = db.query(AgentProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Perfil no configurado")
    return profile

# ----------------- CATÁLOGO DE PRODUCTOS -----------------
@app.get("/api/products", response_model=List[InsuranceProductOut])
def get_products(db: Session = Depends(get_db)):
    return db.query(InsuranceProduct).all()

# ----------------- DASHBOARD & ESTADÍSTICAS -----------------
@app.get("/api/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    today = date.today()
    in_30_days = today + timedelta(days=30)

    total_clients = db.query(Client).count()
    active_policies = db.query(Policy).filter(Policy.status.in_(["Activa", "Por Vencer"])).count()
    policies_due_soon = db.query(Policy).filter(
        Policy.renewal_date >= today,
        Policy.renewal_date <= in_30_days,
        Policy.status != "Cancelada"
    ).count()
    new_leads = db.query(QuoteLead).filter(QuoteLead.status == "Nuevo").count()

    # Suma de primas
    monthly_vol = db.query(func.sum(Policy.monthly_premium)).scalar() or 0.0

    # Distribución por aseguradora
    carriers_raw = db.query(Policy.carrier, func.count(Policy.id)).group_by(Policy.carrier).all()
    carrier_breakdown = {c[0]: c[1] for c in carriers_raw}

    # Distribución por tipo de seguro
    types_raw = db.query(Policy.insurance_type, func.count(Policy.id)).group_by(Policy.insurance_type).all()
    product_distribution = {t[0]: t[1] for t in types_raw}

    return {
        "total_clients": total_clients,
        "active_policies": active_policies,
        "policies_due_soon": policies_due_soon,
        "new_leads": new_leads,
        "total_monthly_volume": round(monthly_vol, 2),
        "carrier_breakdown": carrier_breakdown,
        "product_distribution": product_distribution
    }

# ----------------- CLIENTES -----------------
@app.get("/api/clients", response_model=List[ClientWithPolicies])
def list_clients(search: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Client)
    if search:
        s = f"%{search}%"
        query = query.filter((Client.full_name.ilike(s)) | (Client.phone.ilike(s)) | (Client.email.ilike(s)))
    if status and status != "Todos":
        query = query.filter(Client.status == status)

    clients = query.order_by(Client.id.desc()).all()
    today = date.today()

    result = []
    for c in clients:
        policies_out = []
        for p in c.policies:
            days = (p.renewal_date - today).days
            policies_out.append(PolicyOut(
                id=p.id,
                policy_number=p.policy_number,
                client_id=p.client_id,
                insurance_type=p.insurance_type,
                carrier=p.carrier,
                plan_name=p.plan_name,
                monthly_premium=p.monthly_premium,
                subsidy_amount=p.subsidy_amount,
                effective_date=p.effective_date,
                renewal_date=p.renewal_date,
                status=p.status,
                coverage_details=p.coverage_details,
                beneficiaries=p.beneficiaries,
                created_at=p.created_at,
                client_name=c.full_name,
                days_until_renewal=days
            ))
        result.append(ClientWithPolicies(
            id=c.id,
            full_name=c.full_name,
            email=c.email,
            phone=c.phone,
            id_document=c.id_document,
            date_of_birth=c.date_of_birth,
            city_state=c.city_state,
            status=c.status,
            notes=c.notes,
            created_at=c.created_at,
            policies=policies_out
        ))
    return result

@app.post("/api/clients", response_model=ClientWithPolicies)
def create_client(client_in: ClientCreate, db: Session = Depends(get_db)):
    c = Client(**client_in.dict())
    db.add(c)
    db.commit()
    db.refresh(c)
    return ClientWithPolicies(
        id=c.id,
        full_name=c.full_name,
        email=c.email,
        phone=c.phone,
        id_document=c.id_document,
        date_of_birth=c.date_of_birth,
        city_state=c.city_state,
        status=c.status,
        notes=c.notes,
        created_at=c.created_at,
        policies=[]
    )

@app.put("/api/clients/{client_id}")
def update_client(client_id: int, update_in: ClientUpdate, db: Session = Depends(get_db)):
    c = db.query(Client).filter(Client.id == client_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    for key, value in update_in.dict(exclude_unset=True).items():
        setattr(c, key, value)
    db.commit()
    return {"message": "Cliente actualizado exitosamente"}

@app.delete("/api/clients/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    c = db.query(Client).filter(Client.id == client_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    db.delete(c)
    db.commit()
    return {"message": "Cliente eliminado exitosamente"}

# ----------------- PÓLIZAS -----------------
@app.get("/api/policies", response_model=List[PolicyOut])
def list_policies(
    carrier: Optional[str] = None,
    status: Optional[str] = None,
    expiring_soon: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Policy).join(Client)
    today = date.today()

    if carrier and carrier != "Todos":
        query = query.filter(Policy.carrier == carrier)
    if status and status != "Todos":
        query = query.filter(Policy.status == status)
    if expiring_soon:
        in_30_days = today + timedelta(days=30)
        query = query.filter(Policy.renewal_date >= today, Policy.renewal_date <= in_30_days)

    policies = query.order_by(Policy.renewal_date.asc()).all()
    results = []
    for p in policies:
        days = (p.renewal_date - today).days
        results.append(PolicyOut(
            id=p.id,
            policy_number=p.policy_number,
            client_id=p.client_id,
            insurance_type=p.insurance_type,
            carrier=p.carrier,
            plan_name=p.plan_name,
            monthly_premium=p.monthly_premium,
            subsidy_amount=p.subsidy_amount,
            effective_date=p.effective_date,
            renewal_date=p.renewal_date,
            status=p.status,
            coverage_details=p.coverage_details,
            beneficiaries=p.beneficiaries,
            created_at=p.created_at,
            client_name=p.client.full_name if p.client else "N/A",
            days_until_renewal=days
        ))
    return results

@app.post("/api/policies", response_model=PolicyOut)
def create_policy(policy_in: PolicyCreate, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == policy_in.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="El cliente asignado no existe")

    # Verificar si el número de póliza ya existe
    existing = db.query(Policy).filter(Policy.policy_number == policy_in.policy_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Este número de póliza ya está registrado")

    p = Policy(**policy_in.dict())
    db.add(p)
    db.commit()
    db.refresh(p)

    days = (p.renewal_date - date.today()).days
    return PolicyOut(
        id=p.id,
        policy_number=p.policy_number,
        client_id=p.client_id,
        insurance_type=p.insurance_type,
        carrier=p.carrier,
        plan_name=p.plan_name,
        monthly_premium=p.monthly_premium,
        subsidy_amount=p.subsidy_amount,
        effective_date=p.effective_date,
        renewal_date=p.renewal_date,
        status=p.status,
        coverage_details=p.coverage_details,
        beneficiaries=p.beneficiaries,
        created_at=p.created_at,
        client_name=client.full_name,
        days_until_renewal=days
    )

@app.delete("/api/policies/{policy_id}")
def delete_policy(policy_id: int, db: Session = Depends(get_db)):
    p = db.query(Policy).filter(Policy.id == policy_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Póliza no encontrada")
    db.delete(p)
    db.commit()
    return {"message": "Póliza eliminada"}

# ----------------- COTIZADOR Y LEADS -----------------
@app.post("/api/quotes", response_model=QuoteLeadOut)
def submit_quote(quote_in: QuoteLeadCreate, db: Session = Depends(get_db)):
    # Lógica inteligente de cálculo preliminar de subsidio y prima
    income = quote_in.annual_income or 30000.0
    members = quote_in.household_members or 1
    subsidy = 0.0
    est_premium = 0.0

    # Lógica basada en FPL (Federal Poverty Line) para Obamacare
    fpl_single = 15060 + (members - 1) * 5380
    fpl_ratio = income / fpl_single

    if "Salud" in quote_in.interested_products or "Obamacare" in quote_in.interested_products:
        if 1.0 <= fpl_ratio <= 4.0:
            subsidy = max(200.0, min(650.0, 700.0 - (fpl_ratio * 110.0)))
            est_premium = 0.0 if fpl_ratio <= 1.5 else round(max(5.0, (income * 0.03) / 12), 2)
        else:
            subsidy = 0.0
            est_premium = 290.0

    if "Odontología" in quote_in.interested_products:
        est_premium += 19.99
    if "Accidentes" in quote_in.interested_products:
        est_premium += 14.50
    if "Hospitalización" in quote_in.interested_products:
        est_premium += 18.00

    lead = QuoteLead(
        client_name=quote_in.client_name,
        phone=quote_in.phone,
        email=quote_in.email,
        zip_code=quote_in.zip_code,
        age=quote_in.age,
        annual_income=income,
        household_members=members,
        interested_products=quote_in.interested_products,
        estimated_subsidy=round(subsidy, 2),
        estimated_premium=round(est_premium, 2),
        status="Nuevo",
        notes=quote_in.notes
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead

@app.get("/api/quotes", response_model=List[QuoteLeadOut])
def list_quotes(status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(QuoteLead)
    if status and status != "Todos":
        q = q.filter(QuoteLead.status == status)
    return q.order_by(QuoteLead.created_at.desc()).all()

@app.patch("/api/quotes/{lead_id}")
def update_quote_status(lead_id: int, update_in: QuoteLeadStatusUpdate, db: Session = Depends(get_db)):
    lead = db.query(QuoteLead).filter(QuoteLead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Prospecto no encontrado")
    lead.status = update_in.status
    if update_in.notes:
        lead.notes = update_in.notes
    db.commit()
    return {"message": "Estado de lead actualizado"}

# ----------------- SINIESTROS / HOSPITALIZACIÓN -----------------
@app.post("/api/claims", response_model=ClaimOut)
def register_claim(claim_in: ClaimCreate, db: Session = Depends(get_db)):
    import random
    code = f"CLM-2026-{random.randint(1000, 9999)}"
    # Si es hospitalización, calcula a razón de $250 a $300 por día según el flyer
    payout = 0.0
    if "Hospital" in claim_in.claim_type or claim_in.hospital_days > 0:
        payout = float(claim_in.hospital_days) * 300.0

    claim = Claim(
        claim_code=code,
        policy_id=claim_in.policy_id,
        client_name=claim_in.client_name,
        phone=claim_in.phone,
        claim_type=claim_in.claim_type,
        hospital_days=claim_in.hospital_days,
        hospital_name=claim_in.hospital_name,
        estimated_payout=payout,
        status="En Revisión",
        incident_date=claim_in.incident_date,
        description=claim_in.description
    )
    db.add(claim)
    db.commit()
    db.refresh(claim)
    return claim

@app.get("/api/claims", response_model=List[ClaimOut])
def list_claims(db: Session = Depends(get_db)):
    return db.query(Claim).order_by(Claim.created_at.desc()).all()

@app.patch("/api/claims/{claim_id}")
def update_claim_status(claim_id: int, update_in: ClaimStatusUpdate, db: Session = Depends(get_db)):
    c = db.query(Claim).filter(Claim.id == claim_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Siniestro no encontrado")
    c.status = update_in.status
    if update_in.estimated_payout is not None:
        c.estimated_payout = update_in.estimated_payout
    db.commit()
    return {"message": "Estado de siniestro actualizado"}

# ----------------- CONSULTA PÚBLICA PARA CLIENTES (PORTAL MÓVIL) -----------------
@app.get("/api/portal/lookup")
def portal_lookup(query: str = Query(..., description="Teléfono o Número de Póliza"), db: Session = Depends(get_db)):
    q = query.strip()
    # Buscar por número de póliza
    policy = db.query(Policy).filter(Policy.policy_number.ilike(q)).first()
    if policy:
        client = policy.client
        return {
            "found": True,
            "client": {
                "name": client.full_name,
                "phone": client.phone,
                "city_state": client.city_state
            },
            "policies": [
                {
                    "policy_number": p.policy_number,
                    "insurance_type": p.insurance_type,
                    "carrier": p.carrier,
                    "plan_name": p.plan_name,
                    "renewal_date": p.renewal_date.strftime("%d/%m/%Y"),
                    "status": p.status,
                    "coverage_details": p.coverage_details,
                    "monthly_premium": p.monthly_premium,
                    "days_remaining": (p.renewal_date - date.today()).days
                } for p in client.policies
            ]
        }

    # Buscar por teléfono
    clean_phone = "".join(filter(str.isdigit, q))
    client = db.query(Client).filter(Client.phone.ilike(f"%{clean_phone[-7:]}%")).first()
    if client and client.policies:
        return {
            "found": True,
            "client": {
                "name": client.full_name,
                "phone": client.phone,
                "city_state": client.city_state
            },
            "policies": [
                {
                    "policy_number": p.policy_number,
                    "insurance_type": p.insurance_type,
                    "carrier": p.carrier,
                    "plan_name": p.plan_name,
                    "renewal_date": p.renewal_date.strftime("%d/%m/%Y"),
                    "status": p.status,
                    "coverage_details": p.coverage_details,
                    "monthly_premium": p.monthly_premium,
                    "days_remaining": (p.renewal_date - date.today()).days
                } for p in client.policies
            ]
        }

    return {"found": False, "message": "No se encontraron pólizas asociadas a esos datos"}
