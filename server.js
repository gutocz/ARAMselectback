// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();
app.use(cors());
app.use(express.json());

// Criar servidor HTTP e WebSocket na mesma porta
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Armazena campeões sorteados
let sortedChampionsList = [];
let allSortedChampionsList = [];

// WebSocket: Enviar lista ao conectar
wss.on("connection", (ws) => {
    // Envia a lista atual ao conectar (não limpa a lista)
    ws.send(JSON.stringify({ sortedChampionsList }));
    
    ws.on('error', (error) => {
        console.error('Erro no WebSocket:', error);
    });
});

// Função para enviar atualização a todos os clientes
function broadcastSortedChampions() {
    const data = JSON.stringify({ sortedChampionsList });
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

// Passar WebSocket e listas para rotas
const indexRoutes = require('./routes/index')(broadcastSortedChampions, sortedChampionsList, allSortedChampionsList);
app.use('/', indexRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
