import chalk from 'chalk';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import fs from 'fs';
import { exec } from 'child_process';
import sharp from 'sharp';
import path from 'path';

const tempDir = './temp';
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

export class MensagemControle {
    static async processarMensagem(socket, mensagem) {
        if (!mensagem || !mensagem.pushName || !mensagem.key.remoteJid) return;

        const nome = mensagem.pushName || 'Desconhecido';
        const numero = mensagem.key.remoteJid.replace(/@s\.whatsapp\.net/, '');
        const conteudo = mensagem.message?.conversation || mensagem.message?.extendedTextMessage?.text || '[Mídia recebida]';

        console.log(chalk.bold.green('📩 Nova Mensagem Recebida!'));
        console.log(chalk.cyanBright('👤 De: ') + chalk.bold.white(nome));
        console.log(chalk.yellowBright('📞 Número: ') + chalk.bold.white(numero));
        console.log(chalk.magentaBright('💬 Mensagem: ') + chalk.white(conteudo));
        console.log(chalk.gray('────────────────────────────────────────────────'));
        }
    }