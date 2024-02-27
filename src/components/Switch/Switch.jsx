export default function Switch({ on, onClick, srOnly, disabled = false }) {
    return (
        <div className="flex items-center">
            <button
                type="button"
                role="switch"
                aria-checked="false"
                className={`${on ? 'bg-indigo-600' : 'bg-gray-200'} flex w-12 flex-none cursor-pointer rounded-full p-0.5 ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                onClick={onClick}
                disabled={disabled}
            >
                {srOnly && <span className="sr-only">{srOnly}</span>}
                <span
                    aria-hidden="true"
                    className={`${on ? 'translate-x-[82%]' : 'translate-x-0'} ${disabled ? 'bg-white/30' : 'bg-white'} h-6 w-6 transform rounded-full shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out`}
                />
            </button>
        </div>
    )
}
