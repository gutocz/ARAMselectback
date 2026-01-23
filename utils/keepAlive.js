// backend/utils/keepAlive.js
// Serviço de ping automático para manter o servidor ativo no Render

const axios = require('axios');

function startKeepAlive(serverUrl, intervalMinutes = 14) {
    // Render suspende serviços gratuitos após 15 minutos de inatividade
    // Fazemos ping a cada 14 minutos para manter ativo
    const intervalMs = intervalMinutes * 60 * 1000;

    const pingServer = async () => {
        try {
            const response = await axios.get(`${serverUrl}/ping`);
            console.log(`[KeepAlive] Ping enviado com sucesso: ${response.data.message} - ${new Date().toLocaleString()}`);
        } catch (error) {
            console.error(`[KeepAlive] Erro ao fazer ping: ${error.message}`);
        }
    };

    // Faz o primeiro ping imediatamente
    pingServer();

    // Configura o intervalo para fazer ping periodicamente
    const intervalId = setInterval(pingServer, intervalMs);

    console.log(`[KeepAlive] Serviço iniciado. Fazendo ping a cada ${intervalMinutes} minutos.`);

    return intervalId;
}

module.exports = { startKeepAlive };
