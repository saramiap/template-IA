import { useState } from "react";
import "./App.css";

function App() {
    const [inputPrompt, setInputPrompt] = useState("");
    const [apiResponse, setApiResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    async function sendPrompt(prompt) {
        setLoading(true);
        setApiResponse(null);

        try {
            console.log("Sending prompt to backend:", prompt);

            const response = await fetch("http://localhost:3000/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                console.error("API Error:", response.status, response.statusText);
                setApiResponse("Error: Could not fetch response from AI.");
                return;
            }

            const data = await response.json();
            setApiResponse(data.response);
        } catch (error) {
            console.error("Error sending prompt:", error);
            setApiResponse("Error: Failed to communicate with the backend.");
        } finally {
            setLoading(false);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (inputPrompt.trim()) {
            sendPrompt(inputPrompt);
        } else {
            setApiResponse("Entrez votre question.");
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Template Chat IA</h1>
                <h3>Demandez des informations à l'IA</h3>
            </header>
            <form className="form" onSubmit={handleSubmit}>
                <textarea
                    className="prompt-input"
                    placeholder="Ask the AI something..."
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                />
                <button
                    className="submit-button"
                    type="submit"
                    disabled={!inputPrompt.trim() || loading}
                >
                    {loading ? "Chargement..." : "Envoyer"}
                </button>
            </form>

            {apiResponse && (
                <div className="response-box">
                    <h2>Réponse :</h2>
                    <p>{apiResponse}</p>
                </div>
            )}
        </div>
    );
}

export default App;
