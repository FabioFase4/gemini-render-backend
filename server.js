import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());
app.use(express.json());

// Aqui o servidor lê a chave escondida do ambiente!
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.get("/", (req, res) => { res.send("Backend Gemini funcionando no Render!"); });

app.post("/chat", async (req, res) => {
    try {
        const { mensagem } = req.body;
        if (!mensagem || mensagem.trim() === "") {
            return res.status(400).json({ erro: "A mensagem nao pode estar vazia." });
        }
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: mensagem
        });
        res.json({ resposta: response.text });
    } catch (error) {
        res.status(500).json({ erro: "Erro interno ao processar a resposta." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Servidor rodando na porta ${PORT}`); });
