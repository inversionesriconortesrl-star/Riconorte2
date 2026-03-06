# RicoNorte — Sistema de Solicitudes de Crédito

## Estructura del proyecto
```
riconorte-app/
├── index.html          ← Formulario web
├── api/
│   └── send-solicitud.js  ← API serverless (envía email + PDF)
├── vercel.json         ← Configuración de Vercel
└── package.json
```

## Cómo subir a Vercel

### Paso 1 — Crear cuenta en Resend
1. Ve a https://resend.com y crea una cuenta gratuita (3,000 emails/mes gratis)
2. Ve a **API Keys** → **Create API Key**
3. Copia la API Key (empieza con `re_...`)

### Paso 2 — Subir a Vercel
1. Ve a https://vercel.com → Sign Up con GitHub
2. Clic en **Add New Project** → **Upload** (arrastra esta carpeta completa)
3. Antes de hacer Deploy, ve a **Environment Variables** y agrega:

| Variable | Valor |
|----------|-------|
| `RESEND_API_KEY` | `re_xxxxxxxxxxxx` (tu API key de Resend) |
| `EMPRESA_EMAIL` | `inversionesriconorte.srl@gmail.com` |

4. Clic en **Deploy** ✅

### Paso 3 — Verificar dominio en Resend (opcional pero recomendado)
Por defecto los correos salen de `onboarding@resend.dev`.
Para que salgan desde tu propio correo, verifica tu dominio en Resend → Domains.

## Prueba local
Abre `index.html` directamente en el navegador para probar el formulario y el PDF.
El envío de correo solo funciona cuando está desplegado en Vercel.
