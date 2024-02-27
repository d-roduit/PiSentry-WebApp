export default function TimeRangePlaceholder({ content = null }) {
    return (
        <>
            <div className="flex items-center py-4 border-y bg-gray-100 px-3">
                <p className="w-20">From:</p>
                {content}
            </div>
            <div className="flex items-center py-4 border-y bg-gray-100 px-3">
                <p className="w-20">To:</p>
                {content}
            </div>
        </>
    );
}
