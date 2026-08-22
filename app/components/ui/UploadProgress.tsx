import { UPLOAD_STEPS } from '~/hooks/useUpload';

interface UploadProgressProps {
    currentStep: number;
    statusText: string;
    error: boolean;
}

const UploadProgress = ({ currentStep, statusText, error }: UploadProgressProps) => {
    return (
        <div className="w-full max-w-lg mx-auto">
            {/* Step indicators */}
            <div className="flex items-center justify-between mb-8">
                {UPLOAD_STEPS.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;
                    const isPending = index > currentStep;

                    return (
                        <div key={step.key} className="flex items-center">
                            {/* Step circle */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`
                                        w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-500
                                        ${isCompleted ? 'bg-green-500 text-white scale-100' : ''}
                                        ${isCurrent && !error ? 'bg-blue-500 text-white scale-110 animate-pulse' : ''}
                                        ${isCurrent && error ? 'bg-red-500 text-white scale-110' : ''}
                                        ${isPending ? 'bg-gray-200 text-gray-400 scale-90' : ''}
                                    `}
                                >
                                    {isCompleted ? '✓' : step.icon}
                                </div>
                                <span className={`
                                    text-xs mt-2 text-center max-w-[70px] hidden sm:block
                                    ${isCompleted ? 'text-green-600 font-medium' : ''}
                                    ${isCurrent ? 'text-blue-600 font-semibold' : ''}
                                    ${isPending ? 'text-gray-400' : ''}
                                    ${isCurrent && error ? 'text-red-600' : ''}
                                `}>
                                    {step.label}
                                </span>
                            </div>

                            {/* Connector line */}
                            {index < UPLOAD_STEPS.length - 1 && (
                                <div className="flex-1 mx-1 sm:mx-2">
                                    <div className={`
                                        h-1 rounded-full transition-all duration-500 w-6 sm:w-12 md:w-16
                                        ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'}
                                    `} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Current status text */}
            <div className="text-center">
                <div className={`
                    inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                    ${error
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-50 text-blue-700'
                    }
                `}>
                    {error ? (
                        <>
                            <span className="text-red-500">✕</span>
                            <span>{statusText}</span>
                        </>
                    ) : (
                        <>
                            <span className="animate-spin">⏳</span>
                            <span>{statusText}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`
                        h-full rounded-full transition-all duration-700 ease-out
                        ${error ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-green-500'}
                    `}
                    style={{
                        width: error
                            ? `${((currentStep + 1) / UPLOAD_STEPS.length) * 100}%`
                            : `${((currentStep + 1) / UPLOAD_STEPS.length) * 100}%`,
                    }}
                />
            </div>
        </div>
    );
};

export default UploadProgress;
