import { Link } from "react-router";
import { useState, useEffect } from "react";
import Chatbot from "./Chatbot";
import ProfileSettings from "./ProfileSettings";
import MedicineReminder from "./MedicineReminder";

const Navbar = () => {
    const [showChat, setShowChat] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showReminders, setShowReminders] = useState(false);

    // Handle keyboard events for closing modals
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowChat(false);
                setShowSettings(false);
                setShowReminders(false);
            }
        };

        if (showChat || showSettings || showReminders) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [showChat, showSettings, showReminders]);

    // Handle click outside to close modals
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            setShowChat(false);
            setShowSettings(false);
            setShowReminders(false);
        }
    };

    return (
        <>
            <nav className="navbar">
                <Link
                    to="/"
                    className="text-2xl font-bold text-gradient cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setShowChat(false)}
                >
                    MediScan AI
                </Link>
                <div className="flex items-center gap-4">
                    <Link
                        to="/upload"
                        className="primary-button w-fit hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 ease-out transform"
                    >
                        Upload Prescription
                    </Link>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 rounded-lg hover:bg-blue-50 hover:scale-110 transition-all duration-200 ease-out group"
                        aria-label="Open Settings"
                        title="Settings"
                    >
                        <img
                            src="/images/settings.png"
                            alt="Settings"
                            className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"
                        />
                    </button>
                    <button
                        onClick={() => setShowReminders(!showReminders)}
                        className="p-2 rounded-lg hover:bg-orange-50 hover:scale-110 transition-all duration-200 ease-out group"
                        aria-label="Open Reminders"
                        title="Reminders"
                    >
                        <img
                            src="/images/reminder.png"
                            alt="Reminders"
                            className="w-6 h-6 group-hover:animate-pulse transition-all duration-300"
                        />
                    </button>
                    <button
                        onClick={() => setShowChat(!showChat)}
                        className="p-2 rounded-lg hover:bg-green-50 hover:scale-110 transition-all duration-200 ease-out group"
                        aria-label="Open Chat"
                        title="Chat"
                    >
                        <img
                            src="/images/med_chat .png.png"
                            alt="Chat"
                            className="w-6 h-6 group-hover:bounce transition-all duration-300"
                        />
                    </button>
                </div>
            </nav>

            {/* Chat Modal */}
            {showChat && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-end justify-end p-4 z-50 animate-fade-in"
                    onClick={handleBackdropClick}
                >
                    <div className="relative animate-slide-up">
                        <button
                            onClick={() => setShowChat(false)}
                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-red-600 transition-colors z-10 shadow-lg"
                            aria-label="Close Chat"
                        >
                            ×
                        </button>
                        <div className="w-96 h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden">
                            <Chatbot />
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {showSettings && (
                <div
                    className="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center p-4 z-50 animate-fade-in"
                    onClick={handleBackdropClick}
                >
                    <div className="relative animate-scale-in max-h-[90vh] overflow-y-auto">
                        <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full border border-gray-200 relative">
                            <button
                                onClick={() => setShowSettings(false)}
                                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl hover:bg-red-600 transition-all duration-200 z-20 shadow-xl border-2 border-white"
                                aria-label="Close Settings"
                            >
                                ×
                            </button>
                            <ProfileSettings isModal={true} />
                        </div>
                    </div>
                </div>
            )}

            {/* Reminders Modal */}
            {showReminders && (
                <div
                    className="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center p-4 z-50 animate-fade-in"
                    onClick={handleBackdropClick}
                >
                    <div className="relative animate-scale-in max-h-[90vh] overflow-y-auto">
                        <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full border border-gray-200 relative">
                            <button
                                onClick={() => setShowReminders(false)}
                                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl hover:bg-red-600 transition-all duration-200 z-20 shadow-xl border-2 border-white"
                                aria-label="Close Reminders"
                            >
                                ×
                            </button>
                            <MedicineReminder isModal={true} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
