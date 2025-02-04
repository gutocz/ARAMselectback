// index.js (pasta /routes)
const express = require('express');
const router = express.Router();
const axios = require('axios');

const lolChamps = "https://ddragon.leagueoflegends.com/cdn/14.24.1/data/pt_BR/champion.json";
const imgBaseUrl = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/";

let sortedChampionsList = [];
let allSortedChampionsList = [];

async function getChampionNames() {
    try {
        const response = await axios.get(lolChamps);
        return Object.keys(response.data.data);
    } catch (error) {
        console.error("Erro ao buscar os nomes dos campeões:", error.message);
        throw new Error("Erro ao buscar os dados dos campeões.");
    }
}

function getChampionImage(championName) {
    return `${imgBaseUrl}${championName}_0.jpg`;
}

async function sortChampion() {
    const championNames = await getChampionNames();
    return championNames[Math.floor(Math.random() * championNames.length)];
}

async function createTeam() {
    const championNames = await getChampionNames();
    const team = [];
    const usedChampions = new Set();

    while (team.length < 5) {
        const champion = championNames[Math.floor(Math.random() * championNames.length)];
        if (!usedChampions.has(champion)) {
            usedChampions.add(champion);
            team.push({ champion, rolls: 2 });
            allSortedChampionsList.push(champion);
        }
    }
    return team;
}

async function rollChampion(player) {
    if (player.rolls <= 0) return player;

    let newChampion;
    do {
        newChampion = await sortChampion();
    } while (newChampion === player.champion || allSortedChampionsList.includes(newChampion));

    sortedChampionsList.push({ name: player.champion, image: getChampionImage(player.champion) });
    allSortedChampionsList.push(player.champion);
    player.champion = newChampion;
    player.rolls -= 1;
    return player;
}

router.get('/', async (req, res) => {
    res.json("API Working!");
});

router.get('/team', async (req, res) => {
    try {
        sortedChampionsList = []; // Reseta a lista ao obter um novo time
        allSortedChampionsList = [];
        const team = await createTeam();
        res.json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/roll', async (req, res) => {
    try {
        const player = req.body;
        const updatedPlayer = await rollChampion(player);
        res.json(updatedPlayer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/sortedChampions', (req, res) => {
    res.json(sortedChampionsList);
});

router.get('/updatedSortedChampions', (req, res) => {
    res.json({ sortedChampions: sortedChampionsList });
});

router.post('/resetSortedChampions', (req, res) => {
    sortedChampionsList = [];
    allSortedChampionsList = [];
    res.status(200).send("Lista de campeões sorteados resetada.");
});

module.exports = router;
