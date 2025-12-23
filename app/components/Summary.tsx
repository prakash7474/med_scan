const Category = ({ title }: { title: string }) => {
    return (
        <div className="resume-summary">
            <div className="category">
                <div className="flex flex-row gap-2 items-center justify-center">
                    <p className="text-2xl">{title}</p>
                </div>
            </div>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md w-full">
            <Category title="Medications" />
            <Category title="Dosage" />
            <Category title="Instructions" />
            <Category title="Side Effects" />
            <Category title="Lifestyle" />
        </div>
    )
}
export default Summary
