export default function RenameCameraSettingPlaceholder({ content = null }) {
    return (
        <main className="py-5">
            <div className="flex items-center w-full rounded-none border-y bg-gray-100 p-4 font-medium">
                {content}
            </div>
        </main>
    );
}
