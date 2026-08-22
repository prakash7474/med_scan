import { Link } from 'react-router';

interface EmptyStateProps {
    icon?: string;
    title: string;
    description: string;
    actionLabel?: string;
    actionTo?: string;
    onAction?: () => void;
}

export default function EmptyState({
    icon = '📋',
    title,
    description,
    actionLabel,
    actionTo,
    onAction,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
            <span className="text-5xl">{icon}</span>
            <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
            <p className="text-gray-500 max-w-md">{description}</p>
            {actionLabel && actionTo && (
                <Link to={actionTo} className="primary-button w-fit">
                    {actionLabel}
                </Link>
            )}
            {actionLabel && onAction && !actionTo && (
                <button onClick={onAction} className="primary-button w-fit">
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
