interface ConfirmDialogProps {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    danger?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    danger = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex gap-4">
                    <button
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md cursor-pointer transition-colors"
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        className={`flex-1 px-4 py-2 rounded-md cursor-pointer transition-colors text-white ${
                            danger
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
