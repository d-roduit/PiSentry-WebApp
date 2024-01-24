export default function TimeRange({ initialTimeRange, onChange }) {
    if (initialTimeRange === null) {
        return null;
    }

    return (
        <>
            <label className="flex items-center py-4 border-y bg-gray-100 px-3 cursor-pointer">
                <span className="w-20">From:</span>
                <input
                    type="time"
                    name="from"
                    defaultValue={initialTimeRange?.from}
                    onChange={onChange}
                    className="ml-3 bg-gray-200 rounded px-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                />
            </label>
            <label className="flex items-center py-4 border-y bg-gray-100 px-3 cursor-pointer">
                <span className="w-20">To:</span>
                <input
                    type="time"
                    name="to"
                    defaultValue={initialTimeRange?.to}
                    onChange={onChange}
                    className="ml-3 bg-gray-200 rounded px-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                />
            </label>
        </>
    );
}
