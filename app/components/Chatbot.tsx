import { useState } from "react";
import { usePuterStore } from "~/lib/puter";

const Chatbot = () => {
    const { ai } = usePuterStore();
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hi! I\'m your MediScan AI assistant. Ask me anything about your prescription!' },
        { type: 'bot', text: 'Try: "Explain Paracetamol" or "Is this safe for headaches?"' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        const newMessages = [...messages, { type: 'user', text: userMessage }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await ai.chat(userMessage);
            if (response && response.message && response.message.content) {
                const botText = typeof response.message.content === 'string'
                    ? response.message.content
                    : response.message.content.map(c => c.text || '').join(' ');
                setMessages([...newMessages, { type: 'bot', text: botText }]);
            } else {
                setMessages([...newMessages, { type: 'bot', text: 'Sorry, I couldn\'t generate a response. Please try again.' }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages([...newMessages, { type: 'bot', text: 'An error occurred. Please try again later.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">AI Prescription Assistant</h3>

            <div className="bg-gray-50 rounded-xl p-4 h-96 overflow-y-auto mb-4">
                {messages.map((message, index) => (
                    <div key={index} className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-3 rounded-lg max-w-xs ${
                            message.type === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-800 border'
                        }`}>
                            {message.text}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about your medicine..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSend}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Send
                </button>
            </div>

            <div className="mt-4 text-sm text-gray-500">
                💡 Quick questions: "Side effects of Paracetamol", "Can I take this with food?", "Is this safe during pregnancy?"
            </div>
        </div>
    );
};

export default Chatbot;
