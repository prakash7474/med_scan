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
                        content: [
                            { type: "text", text: "Analyze this prescription image and extract medicine names, dosages, and any important information." },
                            {
                                type: "image_url",
                                image_url: {
                                    url: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                                }
                            }
                        ]
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
