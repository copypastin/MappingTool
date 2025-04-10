// execute npm run start
import shell from 'shelljs';
import { Client, Events, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import json from './config.json' with { type: 'json' };
import fs from 'fs';
let data;

// const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] })


async function eyespy() {
    let missingPlayersMessage = "";

    console.log('Eyespy started...');
    shell.exec('npx playwright test', { async: true }, (code, stdout, stderr) => {
        if (code !== 0) {
            console.error(`Error: ${stderr}`);
            eyespy();
            process.exit(code);
        } else {
            console.log(`Output: ${stdout}`);
            let newData = fs.readFileSync('data/players.json', 'utf-8');

            if (data) {


                // Check for missing players

                const oldData = JSON.parse(data);
                const newPlayers = JSON.parse(newData);

                const missingPlayers = oldData.filter(oldPlayer => !newPlayers.some(newPlayer => newPlayer.user === oldPlayer.user));

                if (missingPlayers.length > 0) {
                    console.log('Missing players:')

                    missingPlayers.forEach(player => {
                        missingPlayersMessage += `${player.user} (Coordinates: ${player.coord.join(', ')})\n`;
                    });
                } else {
                    console.log('No players are missing.');
                }


            } else {
                console.log('No previous data to compare with.');
            }
            // Update the data variable with the new data for future comparisons
            data = newData;;

            // const channel = client.channels.cache.get('1355746173532635295');
            // if(missingPlayersMessage !== "") channel.send(missingPlayersMessage);
            console.log('Tests completed successfully.');
            eyespy();
        }
    })
}

async function checkForMissingPlayers() {

}


eyespy();
