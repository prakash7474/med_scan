import React from 'react'

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface HealthComplianceProps {
  score: number;
  suggestions: Suggestion[];
}

const HealthCompliance: React.FC<HealthComplianceProps> = ({ score, suggestions }) => {
  // Determine background gradient based on score
  const gradientClass = score > 69
    ? 'from-green-100'
    : score > 49
      ? 'from-yellow-100'
      : 'from-red-100';

  // Determine icon based on score
  const iconSrc = score > 69
    ? '/icons/check.svg'
    : score > 49
      ? '/icons/warning.svg'
      : '/icons/cross.svg';

  // Determine subtitle based on score
  const subtitle = score > 69
    ? 'Excellent Compliance!'
    : score > 49
      ? 'Good Compliance'
      : 'Needs Improvement';

  return (
    <div className={`bg-gradient-to-b ${gradientClass} to-white rounded-2xl shadow-md w-full p-6`}>
      {/* Top section with icon and headline */}
      <div className="flex items-center gap-4 mb-6">
        <img src={iconSrc} alt="Health Compliance Icon" className="w-12 h-12" />
        <div>
          <h2 className="text-2xl font-bold">Health Compliance - {score}/100</h2>
        </div>
      </div>

      {/* Description section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{subtitle}</h3>
        <p className="text-gray-600 mb-4">
          This score represents how well your prescription aligns with health guidelines and best practices.
        </p>

        {/* Suggestions list */}
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-3">
              <img
                src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                alt={suggestion.type === "good" ? "Check" : "Warning"}
                className="w-5 h-5 mt-1"
              />
              <p className={suggestion.type === "good" ? "text-green-700" : "text-amber-700"}>
                {suggestion.tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Closing encouragement */}
      <p className="text-gray-700 italic">
        Follow these guidelines to ensure safe and effective medication use.
      </p>
    </div>
  )
}

export default HealthCompliance
