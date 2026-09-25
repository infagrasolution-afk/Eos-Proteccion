import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import asyncio

SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM = os.getenv("SMTP_FROM", "notificaciones@eosproteccion.com")
ADRIANA_EMAIL = os.getenv("ADRIANA_EMAIL", "Adrianamhealth@gmail.com")

def send_quote_notification_email_sync(
    client_name: str,
    phone: str,
    email: str,
    services: str,
    income: float,
    members: int,
    zip_code: str,
    notes: str = ""
):
    """
    Envía un correo con diseño corporativo a Adriana Martínez notificándole
    sobre la nueva solicitud de cotización recibida en la web.
    """
    subject = f"🔔 ¡Nueva Solicitud de Cotización! - {client_name} ({services})"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 20px; }}
        .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; }}
        .header {{ background: linear-gradient(135deg, #FF6F22 0%, #0B4F9C 100%); color: #ffffff; padding: 28px 24px; text-align: center; }}
        .header h1 {{ margin: 0; font-size: 24px; font-weight: 800; }}
        .header p {{ margin: 6px 0 0; opacity: 0.9; font-size: 14px; }}
        .content {{ padding: 24px; color: #1E293B; }}
        .lead-card {{ background: #FFF5EE; border-left: 4px solid #FF6F22; padding: 16px; border-radius: 8px; margin-bottom: 20px; }}
        .data-row {{ display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #F1F5F9; font-size: 15px; }}
        .label {{ font-weight: bold; color: #64748B; }}
        .value {{ font-weight: 600; color: #0F172A; }}
        .btn-whatsapp {{ display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; margin-top: 15px; text-align: center; }}
        .footer {{ background: #F1F5F9; padding: 16px; text-align: center; font-size: 12px; color: #64748B; }}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Eos Protección • Notificación de Prospecto</h1>
          <p>Adriana Martínez (Lic. G082442)</p>
        </div>
        <div class="content">
          <p>Hola <strong>Adriana</strong>, una persona acaba de solicitar cotización a través de la plataforma web de Eos Protección:</p>
          
          <div class="lead-card">
            <h3 style="margin: 0 0 10px; color: #FF6F22;">📋 Datos del Solicitante</h3>
            <div class="data-row"><span class="label">Nombre:</span> <span class="value">{client_name}</span></div>
            <div class="data-row"><span class="label">Teléfono / WhatsApp:</span> <span class="value">{phone}</span></div>
            <div class="data-row"><span class="label">Correo Electrónico:</span> <span class="value">{email or 'No provisto'}</span></div>
            <div class="data-row"><span class="label">Código Postal:</span> <span class="value">{zip_code}</span></div>
            <div class="data-row"><span class="label">Servicios Solicitados:</span> <span class="value" style="color: #0B4F9C;">{services}</span></div>
            <div class="data-row"><span class="label">Ingreso Anual Est.:</span> <span class="value">${income:,.2f}</span></div>
            <div class="data-row"><span class="label">Miembros en el Hogar:</span> <span class="value">{members}</span></div>
            {f'<div class="data-row"><span class="label">Notas:</span> <span class="value">{notes}</span></div>' if notes else ''}
          </div>

          <p style="font-size: 14px; color: #475569;">
            Puedes contactarlo de inmediato para asesorarle sobre su elegibilidad (Obamacare, Cigna, Sun Health) y cerrar la emisión de su póliza.
          </p>

          <center>
            <a href="https://wa.me/1{phone.replace('-', '').replace(' ', '')}?text=Hola%20{client_name},%20te%20saluda%20Adriana%20Mart%C3%ADnez%20de%20Eos%20Protecci%C3%B3n.%20Recib%C3%AD%20tu%20solicitud%20para%20{services}." class="btn-whatsapp">
              💬 Contactar por WhatsApp Ahora
            </a>
          </center>
        </div>
        <div class="footer">
          Eos Protección • Sistema de Notificaciones Automáticas • Florida, EE.UU.
        </div>
      </div>
    </body>
    </html>
    """

    if not SMTP_HOST or not SMTP_USER:
      print(f"\n[EMAIL SIMULATION] Correo preparado para {ADRIANA_EMAIL}:")
      print(f"Asunto: {subject}")
      print(f"Prospecto: {client_name} | Teléfono: {phone} | Servicios: {services}")
      print("*(Para habilitar el envío SMTP real, configura SMTP_HOST, SMTP_USER y SMTP_PASSWORD en el archivo .env)*\n")
      return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = SMTP_FROM
        msg["To"] = ADRIANA_EMAIL

        part = MIMEText(html_content, "html")
        msg.attach(part)

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_FROM, [ADRIANA_EMAIL], msg.as_string())
        print(f"Correo enviado exitosamente a {ADRIANA_EMAIL}")
        return True
    except Exception as e:
        print(f"Error enviando correo SMTP a {ADRIANA_EMAIL}: {e}")
        return False
