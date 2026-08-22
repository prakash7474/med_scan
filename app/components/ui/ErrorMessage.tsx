interface ErrorMessageProps {
    title?: string;
    message: string;
    onRetry?: () => void;
}

export default function ErrorMessage({
    title = 'Something went wrong',
    message,
    onRetry,
}: ErrorMessageProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
            <div className="text-4xl">⚠️</div>
            <h3 className="text-red-600 text-xl font-semibold">{title}</h3>
            <p className="text-red-500 text-center max-w-md">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="primary-button w-fit"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}
