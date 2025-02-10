import { getContentType } from '@whiskeysockets/baileys';
import { tiposMensagem } from './mensagem.js';
import { delayAleatorio } from '../lib/util.js';
import fs from 'fs';

// Gerais
export const deletarMensagem = async (c, mensagem, mensagemCitada = false) => {
    let mensagemDeletada;
    if (mensagemCitada) {
        mensagemDeletada = mensagem.message.extendedTextMessage.contextInfo.stanzaId;
    } else {
        mensagemDeletada = mensagem.key;
    }
    return await c.sendMessage(mensagem.key.remoteJid, { delete: mensagemDeletada });
};

export const lerMensagem = async (c, id_chat, remetente, id_mensagem) => {
    return await c.sendReceipt(id_chat, remetente, [id_mensagem], 'read');
};

export const atualizarPresenca = async (c, id_chat, tipo) => {
    await c.presenceSubscribe(id_chat);
    await delayAleatorio(200, 400);
    await c.sendPresenceUpdate(tipo, id_chat);
    await delayAleatorio(300, 1000);
    await c.sendPresenceUpdate('paused', id_chat);
};

export const alterarFotoPerfil = async (c, id_chat, bufferImagem) => {
    return await c.updateProfilePicture(id_chat, bufferImagem);
};

export const alterarStatusPerfil = async (c, status) => {
    return await c.updateProfileStatus(status);
};

export const encerrarBot = async (c) => {
    return await c.end(new Error("Comando"));
};

export const obterFotoPerfil = async (c, id_chat) => {
    return await c.profilePictureUrl(id_chat, "image");
};

export const bloquearContato = async (c, id_usuario) => {
    return await c.updateBlockStatus(id_usuario, "block");
};

export const desbloquearContato = async (c, id_usuario) => {
    return await c.updateBlockStatus(id_usuario, "unblock");
};

export const obterNumeroHost = async (c) => {
    let id = c.user.id.replace(/:[0-9]+/ism, '');
    return id;
};

export const obterContatosBloqueados = async (c) => {
    return await c.fetchBlocklist();
};


export const enviarTexto = async (c, id_chat, texto) => {
    await atualizarPresenca(c, id_chat, "composing");
    return await c.sendMessage(id_chat, { text: texto, linkPreview: null });
};

export const retransmitirMensagemMarcando = async (c, id_chat, mensagem, mencionados) => {
    let tipoMensagem = getContentType(mensagem.message);
    if (!tipoMensagem) return;

    mensagem.message[tipoMensagem].contextInfo = { mentionedJid: mencionados, isForwarded: true };
    return await c.relayMessage(id_chat, mensagem.message, {});
};

export const enviarArquivoUrl = async (c, tipo, id_chat, url, legenda) => {
    return await c.sendMessage(id_chat, { [tipo]: { url }, caption: legenda });
};

export const responderTexto = async (c, id_chat, texto, mensagemCitacao) => {
    await atualizarPresenca(c, id_chat, "composing");
    return await c.sendMessage(id_chat, { text: texto, linkPreview: null }, { quoted: mensagemCitacao });
};

export const responderArquivoLocal = async (c, tipo, id_chat, caminhoArquivo, legenda, mensagemCitacao, mimetype = '') => {
    let buffer = fs.readFileSync(caminhoArquivo);
    return await c.sendMessage(id_chat, { [tipo]: buffer, mimetype, caption: legenda }, { quoted: mensagemCitacao });
};

export const responderArquivoUrl = async (c, tipo, id_chat, url, legenda, mensagemCitacao, mimetype = '') => {
    return await c.sendMessage(id_chat, { [tipo]: { url }, mimetype, caption: legenda }, { quoted: mensagemCitacao });
};

export const responderArquivoBuffer = async (c, tipo, id_chat, buffer, legenda, mensagemCitacao, mimetype = '') => {
    return await c.sendMessage(id_chat, { [tipo]: buffer, mimetype, caption: legenda }, { quoted: mensagemCitacao });
};

// Grupos
export const entrarLinkGrupo = async (c, idLink) => {
    return await c.groupAcceptInvite(idLink);
};

export const revogarLinkGrupo = async (c, id_grupo) => {
    return await c.groupRevokeInvite(id_grupo);
};

export const obterLinkGrupo = async (c, id_grupo) => {
    let codigoConvite = await c.groupInviteCode(id_grupo);
    return codigoConvite ? `https://chat.whatsapp.com/${codigoConvite}` : undefined;
};

export const sairGrupo = async (c, id_grupo) => {
    return await c.groupLeave(id_grupo);
};

export const obterInfoConviteGrupo = async (c, link) => {
    return await c.groupGetInviteInfo(link);
};

export const alterarRestricaoGrupo = async (c, id_grupo, status) => {
    let config = status ? "announcement" : "not_announcement";
    return await c.groupSettingUpdate(id_grupo, config);
};
