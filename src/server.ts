import express from "express";
import cors from "cors";
import {routes} from "./routes";

const app: express.Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.text());

routes(app);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
