// api/send-solicitud.js
// Función serverless de Vercel — envía el email con el PDF adjunto
// Usa Resend.com (gratis hasta 3,000 emails/mes)

export default async function handler(req, res) {
  // Solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // CORS — permite llamadas desde cualquier origen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { pdfBase64, formData, solicitudNum } = req.body;

    if (!pdfBase64 || !formData) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // ── RESEND API ──
    // Tu API Key de Resend (se configura en Vercel como variable de entorno)
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const EMPRESA_EMAIL  = process.env.EMPRESA_EMAIL || 'inversionesriconorte.srl@gmail.com';

    if (!RESEND_API_KEY) {
      return res.status(500).json({ error: 'RESEND_API_KEY no configurada' });
    }

    // ── HTML DEL CORREO ──
    const emailHTML = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f4f8;">
  <tr><td align="center" style="padding:30px 16px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.12);">

      <!-- HEADER -->
      <tr>
        <td style="background-color:#0d2340;padding:28px 32px;border-bottom:4px solid #c9a84c;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <div style="font-size:24px;font-weight:900;color:#ffffff;letter-spacing:3px;">RICONORTE</div>
                <div style="font-size:10px;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;margin-top:4px;">Inversiones &amp; Gestión de Capital</div>
              </td>
              <td align="right">
                <div style="font-size:10px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:2px;">Nueva Solicitud</div>
                <div style="font-size:18px;font-weight:700;color:#c9a84c;margin-top:4px;">${solicitudNum}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="background-color:#ffffff;padding:32px;">
          <p style="font-size:15px;color:#0d2340;font-weight:700;margin:0 0 4px 0;">📋 Nueva solicitud de crédito recibida</p>
          <p style="font-size:12px;color:#7a8a9a;margin:0 0 24px 0;">Fecha: <strong>${formData.fecha}</strong></p>

          <!-- HIGHLIGHT -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0d2340;border-radius:12px;margin-bottom:24px;">
            <tr>
              <td width="33%" align="center" style="padding:18px 8px;">
                <div style="font-size:9px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:2px;margin-bottom:6px;">Tipo</div>
                <div style="font-size:13px;font-weight:700;color:#ffffff;">${formData.tipo_prestamo}</div>
              </td>
              <td width="34%" align="center" style="padding:18px 8px;border-left:1px solid rgba(255,255,255,0.1);border-right:1px solid rgba(255,255,255,0.1);">
                <div style="font-size:9px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:2px;margin-bottom:6px;">Monto</div>
                <div style="font-size:18px;font-weight:700;color:#c9a84c;">${formData.monto}</div>
              </td>
              <td width="33%" align="center" style="padding:18px 8px;">
                <div style="font-size:9px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:2px;margin-bottom:6px;">Plazo</div>
                <div style="font-size:13px;font-weight:700;color:#ffffff;">${formData.plazo}</div>
              </td>
            </tr>
          </table>

          <!-- SOLICITANTE -->
          <div style="font-size:10px;font-weight:700;color:#0d2340;letter-spacing:3px;text-transform:uppercase;border-bottom:2px solid #c9a84c;padding-bottom:8px;margin-bottom:16px;">👤 Datos del Solicitante</div>

          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">
            <tr>
              <td width="48%" style="padding:10px 12px;background-color:#f4f8fc;border-radius:8px;">
                <div style="font-size:9px;color:#7a8a9a;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Nombre Completo</div>
                <div style="font-size:13px;color:#0d2340;font-weight:600;">${formData.nombre}</div>
              </td>
              <td width="4%"></td>
              <td width="48%" style="padding:10px 12px;background-color:#f4f8fc;border-radius:8px;">
                <div style="font-size:9px;color:#7a8a9a;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Cédula</div>
                <div style="font-size:13px;color:#0d2340;font-weight:600;">${formData.cedula}</div>
              </td>
            </tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">
            <tr>
              <td width="48%" style="padding:10px 12px;background-color:#f4f8fc;border-radius:8px;">
                <div style="font-size:9px;color:#7a8a9a;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Teléfono</div>
                <div style="font-size:13px;color:#0d2340;font-weight:600;">${formData.telefono}</div>
              </td>
              <td width="4%"></td>
              <td width="48%" style="padding:10px 12px;background-color:#f4f8fc;border-radius:8px;">
                <div style="font-size:9px;color:#7a8a9a;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Correo</div>
                <div style="font-size:13px;color:#0d2340;font-weight:600;">${formData.email_solicitante}</div>
              </td>
            </tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">
            <tr>
              <td width="48%" style="padding:10px 12px;background-color:#f4f8fc;border-radius:8px;">
                <div style="font-size:9px;color:#7a8a9a;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Empresa / Actividad</div>
                <div style="font-size:13px;color:#0d2340;font-weight:600;">${formData.empresa}</div>
              </td>
              <td width="4%"></td>
              <td width="48%" style="padding:10px 12px;background-color:#f4f8fc;border-radius:8px;">
                <div style="font-size:9px;color:#7a8a9a;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Ingresos Mensuales</div>
                <div style="font-size:13px;color:#0d2340;font-weight:600;">${formData.ingresos}</div>
              </td>
            </tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
            <tr>
              <td style="padding:10px 12px;background-color:#f4f8fc;border-radius:8px;">
                <div style="font-size:9px;color:#7a8a9a;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Finalidad del Préstamo</div>
                <div style="font-size:13px;color:#0d2340;font-weight:600;">${formData.finalidad}</div>
              </td>
            </tr>
          </table>

          <!-- NOTA PDF -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="background-color:#fffbf0;border:1px solid #e8c96a;border-radius:10px;padding:14px 16px;">
                <p style="font-size:12px;color:#7a8a9a;margin:0;line-height:1.6;">
                  📎 <strong style="color:#0d2340;">PDF adjunto:</strong> La solicitud completa está adjunta a este correo como archivo PDF listo para descargar e imprimir.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background-color:#0a1e35;padding:20px 32px;text-align:center;border-top:2px solid rgba(201,168,76,0.2);">
          <p style="font-size:11px;color:rgba(255,255,255,0.35);margin:0;line-height:1.8;letter-spacing:0.5px;">
            © RicoNorte — Inversiones &amp; Gestión de Capital<br>
            República Dominicana &bull; Correo generado automáticamente
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

    // ── LLAMADA A RESEND API ──
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'RicoNorte Solicitudes <onboarding@resend.dev>',
        to: [EMPRESA_EMAIL],
        subject: `🏦 Solicitud ${solicitudNum} — ${formData.nombre} | RicoNorte`,
        html: emailHTML,
        attachments: [
          {
            filename: `RicoNorte_Solicitud_${formData.nombre.replace(/\s+/g,'_')}_${formData.fecha.replace(/\//g,'-')}.pdf`,
            content: pdfBase64,
          }
        ]
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Resend error:', result);
      return res.status(500).json({ error: 'Error al enviar el correo', details: result });
    }

    return res.status(200).json({ success: true, id: result.id });

  } catch (error) {
    console.error('Error interno:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
