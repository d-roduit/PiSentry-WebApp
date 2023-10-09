const renderDateTitlePlaceholder = () => (
    <div className="sticky h-12 top-0 flex justify-center items-center bg-white border md:backdrop-blur-xl md:bg-white/50">
        <div className="w-44 h-6 bg-gray-300 rounded" />
    </div>
);

const renderLiveItemPlaceholder = () => (
    <div className="group flex items-center h-20">
        <div className="w-24" />
        <div className="relative -z-10 self-stretch flex items-center">
            <div className="absolute left-1/2 -translate-x-1/2 -z-20 h-1/2 bottom-0 border-r-2 border-r-gray-100 group-only:border-r-0" />
            <div className="w-10 h-10 rounded-full bg-gray-300" />
        </div>
        <div className="ml-7 w-9 h-5 rounded bg-gray-300" />
    </div>
);

const renderRecordingsListItemPlaceholder = (index) => (
    <div key={index} className="group flex items-center h-20">
        <div className="ml-5 w-14 h-5 rounded bg-gray-300" />
        <div className="ml-5 relative -z-10 self-stretch flex items-center">
            <div className="absolute left-1/2 -translate-x-1/2 -z-20 h-full border-r-2 border-r-gray-100 group-first:bottom-0 group-first:h-1/2 group-last:top-0 group-last:h-1/2 group-only:border-r-0" />
            <div className="w-10 h-10 rounded-full bg-gray-300" />
        </div>
        <div className="ml-7 w-[60px] h-[60px] rounded bg-gray-300" />
    </div>
);

const renderRecordingsListItemsPlaceholder = () => {
    const items = new Array(7).fill(null);
    return items.map((item, index) => renderRecordingsListItemPlaceholder(index));
}

export default async function RecordingsListPlaceholder() {
    return (
        <div>
            {new Array(2).fill(null).map((item, index) => (
                <div key={index}>
                    {renderDateTitlePlaceholder()}
                    <div>
                        {index === 0 && renderLiveItemPlaceholder()}
                        {renderRecordingsListItemsPlaceholder()}
                    </div>
                </div>
            ))}
        </div>
    );
}
