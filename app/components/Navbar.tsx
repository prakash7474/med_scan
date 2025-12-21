import {Link} from "react-router";
import {useState} from "react";
import Chatbot from "./Chatbot";
import ProfileSettings from "./ProfileSettings";
import MedicineReminder from "./MedicineReminder";

const Navbar = () => {
    const [showChat, setShowChat] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showReminders, setShowReminders] = useState(false);

    return (
        <>
            <nav className="navbar">
                <p
                    className="text-2xl font-bold text-gradient cursor-pointer"
                    onClick={() => setShowChat(!showChat)}
                >
                    MediScan AI
                </p>
                <div className="flex items-center gap-4">
                    <Link to="/upload" className="primary-button w-fit">
                        Upload Prescription
                    </Link>
                    <img
                        src="/images/settings.png"
                        alt="Settings"
                        className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setShowSettings(!showSettings)}
                    />
                    <img
                        src="/images/reminder.png"
                        alt="Reminders"
                        className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setShowReminders(!showReminders)}
                    />
                    <img
                        src="/images/med_chat .png.png"
                        alt="Chat"
                        className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setShowChat(!showChat)}
                    />
                </div>
            </nav>

            {showChat && (
                <div className="fixed bottom-4 right-4 z-50">
                    <div className="relative">
                        <button
                            onClick={() => setShowChat(false)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors z-10"
                        >
                            ×
                        </button>
                        <div className="w-96 h-[500px]">
                            <Chatbot />
                        </div>
                    </div>
                </div>
            )}

            {showSettings && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <button
                            onClick={() => setShowSettings(false)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors z-10"
                        >
                            ×
                        </button>
                        <ProfileSettings />
                    </div>
                </div>
            )}

            {showReminders && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <button
                            onClick={() => setShowReminders(false)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors z-10"
                        >
                            ×
                        </button>
                        <MedicineReminder />
                    </div>
                </div>
            )}
        </>
    )
}
export default Navbar
