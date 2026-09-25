from datetime import date, timedelta
from database import SessionLocal, engine, Base
from models import AgentProfile, InsuranceProduct, Client, Policy, QuoteLead, Claim

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Si ya hay perfil, no volver a sembrar
    if db.query(AgentProfile).first():
        db.close()
        return

    # 1. Perfil Oficial de Adriana Martínez
    agent = AgentProfile(
        full_name="Adriana Martínez",
        title="Health & Life Insurance Specialist",
        license_number="Lic. G082442",
        slogan="¡TU SEGURO, TU TRANQUILIDAD!",
        phone="786-872-2310",
        whatsapp="17868722310",
        instagram="@seguroscon_adriana",
        email="Adrianamhealth@gmail.com",
        location="Miami & Todo Florida, EE.UU.",
        bio="Especialista certificada en planes de salud ACA/Obamacare, seguros de vida con acumulación de valor y coberturas complementarias de Sun Health & Dental y Cigna."
    )
    db.add(agent)

    # 2. Catálogo de Seguros (Textos oficiales extraídos del folleto)
    products = [
        InsuranceProduct(
            slug="seguro-salud",
            name="Seguro de Salud",
            short_desc="Asequible y adaptado a tus necesidades con subsidios del gobierno (ACA/Obamacare).",
            long_desc="Asequible y adaptado a tus necesidades, cubre atención preventiva y no preventiva, servicios de salud mental, medicamentos y más.",
            icon_name="HealthAndSafety",
            badge="Más Solicitado / $0 Prima",
            carriers="Obamacare, Cigna",
            features="Atención preventiva 100% cubierta,Consultas médicas y especialistas,Medicamentos recetados,Salud mental y terapias,Urgencias y emergencias 24/7",
            base_starting_price=0.0
        ),
        InsuranceProduct(
            slug="seguro-vida",
            name="Seguro de Vida",
            short_desc="Protege el patrimonio y el bienestar financiero del futuro de tu familia.",
            long_desc="Proteger tu patrimonio y el futuro de tu familia es un acto de amor y responsabilidad.",
            icon_name="Favorite",
            badge="Patrimonial",
            carriers="Cigna, AIG, National Life",
            features="Protección financiera garantizada,Beneficio en vida por enfermedades críticas,Opciones a término o con valor en efectivo,Aprobaciones ágiles sin exámenes invasivos",
            base_starting_price=25.0
        ),
        InsuranceProduct(
            slug="seguro-odontologia",
            name="Seguro de Odontología",
            short_desc="Sin plazos de espera para lucir y cuidar una sonrisa saludable.",
            long_desc="Sin plazos de espera, la salud de tu sonrisa es importante para tu bienestar y confianza.",
            icon_name="MedicalServices",
            badge="Sin Plazos de Espera",
            carriers="Sun Health & Dental",
            features="Cero tiempos de espera para limpiezas y empastes,Tratamientos de ortodoncia y endodoncia,Red extensa de dentistas certificados,Descuentos directos sin deducibles sorpresa",
            base_starting_price=19.99
        ),
        InsuranceProduct(
            slug="seguro-accidentes",
            name="Seguro de Accidentes",
            short_desc="Protege tus ingresos y tu estabilidad cuando la vida da un giro inesperado.",
            long_desc="Los accidentes no avisan, pero tú sí puedes estar preparado, protege tus ingresos y tu familia cuando la vida da un giro inesperado.",
            icon_name="Healing",
            badge="Respaldo Inmediato",
            carriers="Cigna, Sun Health",
            features="Indemnización en efectivo directa para ti,Cobertura de fracturas emergencias y traslados,Pagos rápidos para cubrir deduibles y gastos diarios,Válido 24 horas al día dentro y fuera del trabajo",
            base_starting_price=14.50
        ),
        InsuranceProduct(
            slug="seguro-hospitalizacion",
            name="Seguro de Hospitalización",
            short_desc="Recibes dinero en efectivo por cada día internado en el hospital.",
            long_desc="Recibes dinero por cada día internado, así puedes enfocarte en lo más importante, sanar sin preocuparte por lo demás.",
            icon_name="LocalHospital",
            badge="Dinero Diario en Efectivo",
            carriers="Cigna, Sun Health & Dental",
            features="Pagos directos de $250 a $1,000 por día de internación,Úsalo libremente para renta cuentas o lo que necesites,Compatible con cualquier otro seguro médico que ya tengas,Sin deducible previo para recibir el beneficio",
            base_starting_price=18.00
        )
    ]
    db.add_all(products)
    db.commit()

    # 3. Clientes Representativos
    today = date.today()
    c1 = Client(
        full_name="Carlos Eduardo Mendoza",
        email="carlos.mendoza@gmail.com",
        phone="786-455-8912",
        id_document="SSN-***-4921",
        date_of_birth=date(1986, 5, 14),
        city_state="Miami, FL",
        status="Activo",
        notes="Familia de 3 miembros. Interesado en ampliar cobertura dental con Sun Health."
    )
    c2 = Client(
        full_name="Mariana Gómez Silveira",
        email="mariana.gomez@outlook.com",
        phone="305-671-3340",
        id_document="SSN-***-1189",
        date_of_birth=date(1992, 11, 23),
        city_state="Hialeah, FL",
        status="En Renovación",
        notes="Su póliza de Obamacare vence el próximo mes. Requiere actualización de ingresos."
    )
    c3 = Client(
        full_name="Roberto Alejandro Rivas",
        email="roberto.rivas@yahoo.com",
        phone="954-889-1205",
        id_document="SSN-***-8832",
        date_of_birth=date(1978, 3, 2),
        city_state="Fort Lauderdale, FL",
        status="Activo",
        notes="Cuenta con póliza de vida y seguro complementario de hospitalización."
    )
    c4 = Client(
        full_name="Yusleidys Fernández",
        email="yusley.fernandez@gmail.com",
        phone="786-902-5411",
        id_document="SSN-***-6743",
        date_of_birth=date(1995, 8, 19),
        city_state="Doral, FL",
        status="Activo",
        notes="Póliza de salud Obamacare con prima de $0 subsidiada."
    )
    db.add_all([c1, c2, c3, c4])
    db.commit()

    # 4. Pólizas Activas y por Vencer
    p1 = Policy(
        policy_number="OBA-2026-99412",
        client_id=c1.id,
        insurance_type="Seguro de Salud",
        carrier="Obamacare",
        plan_name="Silver Benchmark HMO Plus",
        monthly_premium=0.0,
        subsidy_amount=460.0,
        effective_date=today - timedelta(days=200),
        renewal_date=today + timedelta(days=165),
        status="Activa",
        coverage_details="Deducible $0, Copago genérico $5, Especialista $15",
        beneficiaries="Esposa e hijo"
    )
    p2 = Policy(
        policy_number="CIG-2025-78103",
        client_id=c2.id,
        insurance_type="Seguro de Salud",
        carrier="Cigna",
        plan_name="Cigna Connect Silver 6500",
        monthly_premium=14.50,
        subsidy_amount=425.0,
        effective_date=today - timedelta(days=345),
        renewal_date=today + timedelta(days=20), # ¡Alerta: vence en 20 días!
        status="Por Vencer",
        coverage_details="Cobertura integral en red Cigna Florida, urgencias incluidas",
        beneficiaries="Mariana Gómez"
    )
    p3 = Policy(
        policy_number="SUN-2026-33902",
        client_id=c1.id,
        insurance_type="Seguro de Odontología",
        carrier="Sun Health & Dental",
        plan_name="Sun Complete Dental Care",
        monthly_premium=24.99,
        subsidy_amount=0.0,
        effective_date=today - timedelta(days=90),
        renewal_date=today + timedelta(days=275),
        status="Activa",
        coverage_details="Sin períodos de espera, red Sun Health ilimitada",
        beneficiaries="Grupo Familiar Mendoza"
    )
    p4 = Policy(
        policy_number="LIF-2025-44129",
        client_id=c3.id,
        insurance_type="Seguro de Vida",
        carrier="Cigna",
        plan_name="Protección Familiar Término 25 Años",
        monthly_premium=48.0,
        subsidy_amount=0.0,
        effective_date=today - timedelta(days=180),
        renewal_date=today + timedelta(days=185),
        status="Activa",
        coverage_details="Suma asegurada: $250,000 USD con beneficios en vida",
        beneficiaries="Elena Rivas (Hija) 100%"
    )
    p5 = Policy(
        policy_number="HOS-2026-12001",
        client_id=c3.id,
        insurance_type="Seguro de Hospitalización",
        carrier="Sun Health & Dental",
        plan_name="Sun Hospital Cash $300/Día",
        monthly_premium=22.0,
        subsidy_amount=0.0,
        effective_date=today - timedelta(days=60),
        renewal_date=today + timedelta(days=305),
        status="Activa",
        coverage_details="Renta diaria por hospitalización de $300 USD directo al asegurado",
        beneficiaries="Roberto Rivas"
    )
    db.add_all([p1, p2, p3, p4, p5])
    db.commit()

    # 5. Siniestro / Indemnización
    cl1 = Claim(
        claim_code="CLM-2026-0042",
        policy_id=p5.id,
        client_name="Roberto Alejandro Rivas",
        phone="954-889-1205",
        claim_type="Hospitalización",
        hospital_days=3,
        hospital_name="Baptist Health South Florida",
        estimated_payout=900.0, # 3 días x $300
        status="Aprobado",
        incident_date=today - timedelta(days=12),
        description="Ingreso hospitalario por cuadro agudo. Permanencia de 3 noches confirmada con alta médica."
    )
    db.add(cl1)

    # 6. Leads / Cotizaciones Recientes
    l1 = QuoteLead(
        client_name="Jessica Padrón",
        phone="786-320-1944",
        email="jessica.padron@gmail.com",
        zip_code="33130",
        age=34,
        annual_income=29500.0,
        household_members=2,
        interested_products="Seguro de Salud (Obamacare) + Odontología",
        estimated_subsidy=510.0,
        estimated_premium=0.0,
        status="Nuevo",
        notes="Interesada en plan con Sun Health Dental para su hijo."
    )
    l2 = QuoteLead(
        client_name="David Alarcón",
        phone="305-992-4188",
        email="david.alarcon@live.com",
        zip_code="33125",
        age=45,
        annual_income=48000.0,
        household_members=3,
        interested_products="Seguro de Vida + Accidentes",
        estimated_subsidy=0.0,
        estimated_premium=65.0,
        status="Contactado",
        notes="Habló por WhatsApp hoy. Se le envió comparativa de Cigna."
    )
    db.add_all([l1, l2])
    db.commit()
    db.close()
    print("Base de datos inicializada con éxito para Eos Protección.")

if __name__ == "__main__":
    seed()
