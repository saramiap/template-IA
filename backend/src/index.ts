import express, { Request, Response } from "express";
import fetch from "node-fetch";
import cors from "cors";


const app = express();
app.use(express.json());
app.use(cors());

const geminiApiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=CLEF_API_GEMINI";

// Endpoint to process AI prompts
app.post("/ask", async (req: Request, res: Response) => {
  // prompt from Front End , here we are using Olivia Pop as a prompt dynamically
  // Exemples ; Utilisateur demande des conseils sur la vente de produits via const { prompt } = req.body;

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {

    const geminiRequestBody = {
      contents: [
        {
          parts: [
            {
              text: `Prompt Olivia Poop +  Question User: ${prompt}`,
            },
          ],
        },
      ],
    };

    const response = await fetch(geminiApiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiRequestBody),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("Gemini API Error:", errorDetails);
      return res.status(502).json({
        error: "Bad Gateway",
        message: `Downstream service error: ${response.statusText}`,
        details: errorDetails,
      });
    }

    const geminiResponse: any = await response.json();

    const geminiAnswer =
        geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text || "Réponse vide.";

    res.json({
      response: geminiAnswer,
    });

  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while processing the request",
    });
  }
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
