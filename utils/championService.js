// backend/utils/championService.js
const axios = require('axios');

const lolChampsURL = "https://ddragon.leagueoflegends.com/cdn/14.24.1/data/pt_BR/champion.json";
const imgBaseUrl = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/";

async function getChampionNames() {
    try {
        const response = await axios.get(lolChampsURL);
        return Object.keys(response.data.data);
    } catch (error) {
        console.error("Erro ao buscar campeões:", error.message);
        throw new Error("Erro ao buscar campeões.");
    }
}

function getChampionImage(championName) {
    return `${imgBaseUrl}${championName}_0.jpg`;
}

module.exports = { getChampionNames, getChampionImage };
