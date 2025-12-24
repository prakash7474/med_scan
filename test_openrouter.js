async function testOpenRouterAPI() {
    const apiKey = "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";

    try {
        console.log("Testing OpenRouter API with Gemini model...");

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "google/gemini-2.5-flash-image-preview",
                messages: [
                    {
                        role: "user",
                        content: "Hello, can you confirm this API is working? Please respond with a simple confirmation."
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ OpenRouter API test successful!");
        console.log("Response:", data.choices[0].message.content);

    } catch (error) {
        console.error("❌ OpenRouter API test failed:", error.message);
    }
}

testOpenRouterAPI();
