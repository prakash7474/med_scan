// Test the JSON parsing logic from upload.tsx
function parseFeedbackText(feedbackText) {
    // Extract JSON from markdown code block if present
    let jsonText = feedbackText;
    if (feedbackText.includes('```json')) {
        const jsonMatch = feedbackText.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            jsonText = jsonMatch[1];
        }
    }
    return JSON.parse(jsonText);
}

// Test with the problematic response
const testResponse = `\`\`\`json
{
  "medications": {
    "score": 85,
    "tips": [
      {
        "type": "good",
        "tip": "Test tip",
        "explanation": "Test explanation"
      }
    ]
  }
}
\`\`\``;

try {
    const parsed = parseFeedbackText(testResponse);
    console.log("✅ JSON parsing test successful!");
    console.log("Parsed object:", parsed);
} catch (error) {
    console.error("❌ JSON parsing test failed:", error.message);
}

// Test with plain JSON (no markdown)
const plainJson = `{
  "medications": {
    "score": 90,
    "tips": []
  }
}`;

try {
    const parsedPlain = parseFeedbackText(plainJson);
    console.log("✅ Plain JSON parsing test successful!");
    console.log("Parsed object:", parsedPlain);
} catch (error) {
    console.error("❌ Plain JSON parsing test failed:", error.message);
}
