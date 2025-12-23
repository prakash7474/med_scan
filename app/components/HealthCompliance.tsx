

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface HealthComplianceProps {
  suggestions: Suggestion[];
}

const HealthCompliance: React.FC<HealthComplianceProps> = ({ suggestions }) => {
  return (
    <div className="bg-gradient-to-b from-blue-100 to-white rounded-2xl shadow-md w-full p-6">
      {/* Top section with icon and headline */}
      <div className="flex items-center gap-4 mb-6">
        <img src="/icons/check.svg" alt="Health Compliance Icon" className="w-12 h-12" />
        <div>
          <h2 className="text-2xl font-bold">Health Compliance</h2>
        </div>
      </div>

      {/* Description section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Personalized Recommendations</h3>
        <p className="text-gray-600 mb-4">
          Here are some tips to ensure safe and effective medication use.
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
