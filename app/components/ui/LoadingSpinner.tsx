interface LoadingSpinnerProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
};

export default function LoadingSpinner({ message = 'Loading...', size = 'md' }: LoadingSpinnerProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
            <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin`} />
            <p className="text-gray-500 dark:text-gray-300 text-lg">{message}</p>
        </div>
    );
}
