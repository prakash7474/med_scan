import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import Navbar from "~/components/Navbar";
import Snowfall from "react-snowfall";

const WipeApp = () => {
    const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState<FSItem[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);

    const loadFiles = async () => {
        const files = (await fs.readDir("./")) as FSItem[];
        setFiles(files);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading]);

    const handleDelete = async () => {
        files.forEach(async (file) => {
            await fs.delete(file.path);
        });
        await kv.flush();
        loadFiles();
        setShowConfirm(false);
    };

    if (isLoading) {
        return (
            <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
                <Snowfall />
                <Navbar />
                <section className="main-section py-16">
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-lg text-gray-600">Loading...</div>
                    </div>
                </section>
            </main>
        );
    }

    if (error) {
        return (
            <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
                <Navbar />
                <section className="main-section py-16">
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-lg text-red-600">Error: {error}</div>
                        <button
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
                            onClick={clearError}
                        >
                            Retry
                        </button>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] dark:bg-[url('/images/bg-dark-main.svg')] bg-cover min-h-screen transition-all duration-300">
            <Navbar />
            <section className="main-section py-16">
                <div className="max-w-2xl mx-auto">
                    <div className="page-heading">
                        <h1 className="dark:text-white">Wipe App Data</h1>
                        <h2 className="dark:text-gray-200">Remove all stored files and data from the application</h2>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Authenticated as:</h3>
                            <p className="text-gray-600">{auth.user?.username}</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Existing Files:</h3>
                            {files.length > 0 ? (
                                <div className="space-y-2">
                                    {files.map((file) => (
                                        <div key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                            <span className="text-gray-700">{file.name}</span>
                                            <span className="text-sm text-gray-500">File</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No files found.</p>
                            )}
                        </div>

                        <div className="border-t pt-6">
                            <p className="text-sm text-gray-600 mb-4">
                                Warning: This action will permanently delete all files and data associated with your account. This cannot be undone.
                            </p>
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md cursor-pointer font-semibold transition-colors"
                                onClick={() => setShowConfirm(true)}
                            >
                                Wipe App Data
                            </button>
                        </div>
                    </div>

                    {showConfirm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Wipe</h3>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to wipe all app data? This action cannot be undone.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md cursor-pointer transition-colors"
                                        onClick={() => setShowConfirm(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer transition-colors"
                                        onClick={handleDelete}
                                    >
                                        Confirm Wipe
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default WipeApp;
