import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Navbar from "~/components/Navbar";
import ConfirmDialog from "~/components/ui/ConfirmDialog";
import LoadingSpinner from "~/components/ui/LoadingSpinner";
import ErrorMessage from "~/components/ui/ErrorMessage";

const WipeApp = () => {
    const { isLoading, error, clearError, fs } = usePuterStore();
    const [files, setFiles] = useState<FSItem[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [wiping, setWiping] = useState(false);

    const loadFiles = async () => {
        const files = (await fs.readDir("./")) as FSItem[];
        setFiles(files);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    const handleDelete = async () => {
        setWiping(true);
        try {
            files.forEach(async (file) => {
                await fs.delete(file.path);
            });
            const { kv } = usePuterStore.getState();
            await kv.flush();
            loadFiles();
            setShowConfirm(false);
        } catch (err) {
            console.error('Wipe failed:', err);
        } finally {
            setWiping(false);
        }
    };

    if (isLoading) {
        return (
            <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
                <Navbar />
                <LoadingSpinner message="Loading..." />
            </main>
        );
    }

    if (error) {
        return (
            <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
                <Navbar />
                <ErrorMessage message={error} onRetry={clearError} />
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
                                Warning: This action will permanently delete all files and data. This cannot be undone.
                            </p>
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md cursor-pointer font-semibold transition-colors"
                                onClick={() => setShowConfirm(true)}
                                disabled={wiping}
                            >
                                {wiping ? 'Wiping...' : 'Wipe App Data'}
                            </button>
                        </div>
                    </div>

                    {showConfirm && (
                        <ConfirmDialog
                            title="Confirm Wipe"
                            message="Are you sure you want to wipe all app data? This action cannot be undone."
                            confirmLabel="Confirm Wipe"
                            danger
                            onConfirm={handleDelete}
                            onCancel={() => setShowConfirm(false)}
                        />
                    )}
                </div>
            </section>
        </main>
    );
};

export default WipeApp;
