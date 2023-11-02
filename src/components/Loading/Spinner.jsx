export default function LoadingSpinner({ className }) {
    return (
        <div className="h-full w-full flex justify-center items-center">
            <div
                className={`inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-gray-500 motion-reduce:animate-[spin_1.5s_linear_infinite] ${className}`}
                role="status"
            >
                <span
                    className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >
                    Loading...
                </span>
            </div>
        </div>
    )
}
