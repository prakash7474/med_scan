import React, { useState } from 'react';

const SideEffectJournal = () => {
    const [date, setDate] = useState('');
    const [symptom, setSymptom] = useState('');
    const [severity, setSeverity] = useState('Mild');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle submission, e.g., log to console or send to backend
        console.log({ date, symptom, severity });
        // Reset form
        setDate('');
        setSymptom('');
        setSeverity('Mild');
        alert('Side effect logged successfully!');
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 w-full">
            <h3 className="text-lg font-bold mb-4">Side Effect Journal</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
                    <input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                        aria-describedby="date-help"
                    />
                    <span id="date-help" className="sr-only">Select the date when the side effect occurred</span>
                </div>
                <div>
                    <label htmlFor="symptom" className="block text-sm font-medium mb-1">Symptom</label>
                    <textarea
                        id="symptom"
                        value={symptom}
                        onChange={(e) => setSymptom(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows={3}
                        placeholder="Describe the side effect..."
                        required
                        aria-describedby="symptom-help"
                    />
                    <span id="symptom-help" className="sr-only">Describe the side effect you experienced</span>
                </div>
                <div>
                    <label htmlFor="severity" className="block text-sm font-medium mb-1">Severity</label>
                    <select
                        id="severity"
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value)}
                        className="w-full p-2 border rounded"
                        aria-describedby="severity-help"
                    >
                        <option value="Mild">Mild</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Severe">Severe</option>
                    </select>
                    <span id="severity-help" className="sr-only">Select the severity level of the side effect</span>
                </div>
                <button type="submit" className="primary-button w-full" aria-label="Log the side effect">Log Side Effect</button>
            </form>
        </div>
    );
};

export default SideEffectJournal;
