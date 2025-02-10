
export function exemploEvento(socket) {
    socket.ev.on('messages.upsert', async ({ messages }) => {
        if (!messages || messages.length === 0) return;
        console.log('Nova mensagem recebida:', messages[0]);
    });
}

export default { exemploEvento };
