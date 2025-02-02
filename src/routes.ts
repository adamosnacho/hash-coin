import express from "express";
import fs from "fs";
import { Coin } from "./types";

const coinsString = fs.readFileSync("./coins.json", "utf-8");
const coins: Coin[] = JSON.parse(coinsString);

function saveCoins() {
    fs.writeFileSync("coins.json", JSON.stringify(coins, null, 2));
}

const routes = (app: express.Application) => {
    app.get("/", (req, res) => {
        try {
            const coinsRes: string[][] = [];
            for (const coin of coins) {
                coinsRes.push(coin.hashes);
            }
            res.json(coinsRes);
        } catch (e: any) {
            res.status(500).json({ error: e.stack });
        }
    });
    app.get("/rehash/:coinHash", (req, res) => {
        try {
            const coinHash = req.params.coinHash;
            const security = req.query.s;
            const newCoinHash = req.query.nch;
            const newSecurity = req.query.ns;
            console.log(coinHash, security, newCoinHash, newSecurity)
            if (!coinHash) {
                res.status(400).json({ error: "Missing required parameter coinHash" });
                return;
            }
            if (!security) {
                res.status(400).json({ error: "Missing required parameter security" });
                return;
            }
            if (!newCoinHash) {
                res.status(400).json({ error: "Missing required parameter newCoinHash" });
                return;
            }
            if (!newSecurity) {
                res.status(400).json({ error: "Missing required parameter newSecurity" });
                return;
            }
            if (!/^[a-f0-9]{64}$/.test(newCoinHash as string)) {
                res.status(400).json({ error: "Invalid newCoinHash" });
                return;
            }
            if (!/^[a-f0-9]{64}$/.test(newSecurity as string)) {
                res.status(400).json({ error: "Invalid newSecurity" });
                return;
            }

            for (const coin of coins) {
                if (coin.hashes[coin.hashes.length - 1] === coinHash) {
                    if (coin.securityHash === security) {
                        coin.hashes.push(newCoinHash as string);
                        coin.securityHash = newSecurity as string;
                        saveCoins();
                        res.json({ status: "success" });
                    } else res.status(401).json({ error: "Invalid security hash" });
                    return;
                }
            }

            res.status(404).json({ error: "No coin with this hash" });
        } catch (e: any) {
            res.status(500).json({ error: e.stack });
        }
    });
};

export {routes};