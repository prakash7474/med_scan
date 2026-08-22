interface StatusBadgeProps {
    score: number;
    showLabel?: boolean;
}

function getScoreStyle(score: number) {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
}

function getScoreLabel(score: number) {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Moderate';
    return 'Needs Attention';
}

export default function StatusBadge({ score, showLabel = false }: StatusBadgeProps) {
    return (
        <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreStyle(score)}`}>
            {score}/100
            {showLabel && ` — ${getScoreLabel(score)}`}
        </span>
    );
}
