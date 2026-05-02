export default async function handler(req, res) {
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    
    const { messages, system } = req.body;
    const userPrompt = messages[0].content;

    
    const geminiPayload = {
      contents: [{
        parts: [{ text: userPrompt }]
      }]
    };

    
    if (system) {
      geminiPayload.systemInstruction = {
        parts: [{ text: system }]
      };
    }

   
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiPayload)
    });

    const data = await response.json();

   
    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    
    const aiText = data.candidates[0].content.parts[0].text;

   
    res.status(200).json({
      content: [{ text: aiText }]
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Failed to connect to Gemini AI server" });
  }
}
