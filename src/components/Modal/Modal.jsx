'use client';

import { FaXmark } from 'react-icons/fa6';

export default function Modal({ header, body, footer, onClickOverlay, closeButton = false, onClickCloseButton }) {
    const _onClickOverlay = (event) => {
        if (event.target === event.currentTarget) {
            onClickOverlay && onClickOverlay();
        }
    }

    return (
        <div
            className="fixed top-0 left-0 z-50 h-[100dvh] w-screen flex justify-center items-center bg-black bg-opacity-50"
            onClick={_onClickOverlay}
        >
            <div className="flex flex-col w-11/12 max-h-[80dvh] bg-white ring-1 ring-gray-500 rounded-lg shadow-2xl md:w-auto md:max-w-2xl md:max-h-[90dvh]">
                <div className="p-4 border-b md:p-5 flex justify-between items-center">
                    <div>
                        {header}
                    </div>
                    <div>
                        {closeButton && (
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                                onClick={onClickCloseButton}
                            >
                                <FaXmark className="w-5 h-5"/>
                                <span className="sr-only">Close modal</span>
                            </button>
                        )}
                    </div>
                </div>
                <div className="p-4 md:p-5 overflow-y-auto">
                    {body}
                </div>
                <div className="p-4 bg-gray-50 rounded-b-lg border-t md:p-5">
                    {footer}
                </div>
            </div>
        </div>
    );
}
