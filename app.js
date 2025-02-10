import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } from '@whiskeysockets/baileys';
import configSocket from './bot/baileys/configSocket.js';
import * as fs from 'fs';
import qrcode from 'qrcode-terminal';
import { MensagemControle } from './bot/controles/MensagemControle.js';
import P from 'pino';

const logger = P({
    level: 'warn', 
    transport: {
        target: 'pino-pretty',
        options: { ignore: 'pid,hostname' }
    }
});



async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState(configSocket.authStatePath);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true,
        browser: ['Bot', 'Chrome', '1.0.0'],
        logger: logger 
    });
    

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, isNewLogin, qr, isOnline, receivedPendingNotifications } = update;
    
        if (connection === 'open') {
            console.log('✅ Conectado ao WhatsApp!');
        } else if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('⚠️ Reconectando...');
                connectToWhatsApp();
            } else {
                console.log('🛑 Sessão encerrada. Excluindo credenciais...');
                fs.rmSync(configSocket.authStatePath, { recursive: true, force: true });
                connectToWhatsApp();
            }
        } else if (connection === 'connecting') {
            console.log('🔄 Conectando ao WhatsApp...');
        } else if (isNewLogin || qr === undefined || isOnline !== undefined || receivedPendingNotifications !== undefined) {
            
        } else if (update?.node?.attrs?.code === '515') {
            
        } else {
            console.log('❌ Erro relevante:', update);
        }
    });
    
    sock.ev.on('messages.upsert', async ({ messages }) => {
        if (!messages || messages.length === 0) return;
    
        for (const msg of messages) {
            if (!msg.key.fromMe) { 
                await MensagemControle.processarMensagem(sock, msg);
            }
        }
    });





    
}    

// Execução principal
connectToWhatsApp();
