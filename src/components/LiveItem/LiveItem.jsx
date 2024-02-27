'use client';

import { memo } from 'react';
import CircledIcon from '@/components/CircledIcon/CircledIcon.jsx';
import { FaVideo } from 'react-icons/fa6';
import { recordingsSlice, useDispatch } from '@/lib/redux/index.js';

const LiveItem = memo(function LiveItem({ isSelected }) {
    const dispatch = useDispatch();

    return (
        <div
            onClick={() => dispatch(recordingsSlice.actions.setSelectedRecording(null))}
            className={`group flex items-center h-20 md:transition md:hover:bg-gray-200 md:cursor-pointer ${isSelected ? 'bg-gray-200' : ''}`}
        >
            <div className="w-24"></div>
            <div className="relative z-0 self-stretch flex items-center">
                <div className="absolute left-1/2 -translate-x-1/2 -z-10 h-1/2 bottom-0 border-r-2 border-r-gray-100 group-only:border-r-0" />
                <CircledIcon icon={FaVideo} iconColor="text-red-700" bgColor="bg-red-50" borderColor="border-red-100" />
            </div>
            <p className="ml-7 text-red-700 font-extrabold">Live</p>
        </div>
    )
});

export default LiveItem;
