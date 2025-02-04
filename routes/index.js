// backend/routes/index.js
const express = require('express');
const router = express.Router();
const { getChampionNames, getChampionImage } = require('../utils/championService');
const Player = require('../model/player');

module.exports = (broadcastSortedChampions, sortedChampionsList, allSortedChampionsList) => {
    async function createTeam() {
        const championNames = await getChampionNames();
        const team = [];
        const usedChampions = new Set();

        while (team.length < 5) {
            const champion = championNames[Math.floor(Math.random() * championNames.length)];
            if (!usedChampions.has(champion)) {
                usedChampions.add(champion);
                team.push(new Player(champion, 2));
                allSortedChampionsList.push(champion);
            }
        }
        return team;
    }

    async function rollChampion(player) {
        if (player.rolls <= 0) return player;

        let newChampion;
        do {
            newChampion = (await getChampionNames())[Math.floor(Math.random() * 163)];
        } while (newChampion === player.champion || allSortedChampionsList.includes(newChampion));

        sortedChampionsList.push({ name: player.champion, image: getChampionImage(player.champion) });
        allSortedChampionsList.push(player.champion);
        player.champion = newChampion;
        player.rolls -= 1;
        broadcastSortedChampions();
        return player;
    }

    router.get('/team', async (req, res) => {
        try {
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

    router.post('/resetSortedChampions', (req, res) => {
        sortedChampionsList = [];
        allSortedChampionsList = [];
        res.status(200).send("Lista de campeões sorteados resetada.");
    });

    return router;
};
