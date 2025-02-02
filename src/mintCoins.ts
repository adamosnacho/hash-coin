import fs from "fs";
import { questionInt } from "readline-sync";
import { createHash } from 'crypto';
import { Coin } from "./types";

function newCoinPart(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function sha256Hash(input: string): string {
    return createHash('sha256').update(input).digest('hex');
}

const coins: Coin[] = [];
const coinList: string[] = [];

const coinVolume = questionInt("Mint token volume => ");

for (let i = 0; i < coinVolume; i++) {
    const coinPart = newCoinPart();
    const coinSecondPart = newCoinPart();
    coins.push({ hashes: [sha256Hash(coinPart), sha256Hash(coinPart + coinSecondPart)], securityHash: sha256Hash(coinPart + coinSecondPart + "-security") });
    coinList.push(coinPart + coinSecondPart);
    console.log(coinPart + coinSecondPart);
}

fs.writeFileSync("coins.json", JSON.stringify(coins, null, 2));
fs.writeFileSync("coinList.json", JSON.stringify(coinList, null, 2));
