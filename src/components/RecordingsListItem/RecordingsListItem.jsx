'use client';

import { memo } from 'react';
import DetectedObjectIcon from '@/components/DetectedObjectIcon/DetectedObjectIcon.jsx';
import dayjs from 'dayjs'
import Image from 'next/image';
import urls from '@/urls.js';

import {
    recordingsSlice,
    useDispatch,
} from '@/lib/redux';

const { backendApiUrl } = urls;

const thumbnailsEndpoint = `${backendApiUrl}/v1/thumbnails`;

const RecordingsListItem = memo(function RecordingsListItem({ data, isSelected }) {
    const dispatch = useDispatch();

    const { recorded_at, thumbnail_filename, thumbnail_extension, object_type } = data;

    const dayjsDate = dayjs(recorded_at);

    return (
        <div
            onClick={() => dispatch(recordingsSlice.actions.setSelectedRecording(data))}
            className={`group flex items-center h-20 md:transition md:hover:bg-gray-200 md:cursor-pointer ${isSelected ? 'bg-gray-200' : ''}`}
        >
            <p className="w-24 text-gray-600 font-medium text-center">{dayjsDate.format('HH:mm')}</p>
            <div className="relative z-0 self-stretch flex items-center">
                <div className="absolute left-1/2 -z-10 -translate-x-1/2 h-full border-r-2 border-r-gray-100 group-first:bottom-0 group-first:h-1/2 group-last:top-0 group-last:h-1/2 group-only:border-r-0" />
                <DetectedObjectIcon type={object_type} />
            </div>
            <div className={`rounded ${isSelected ? 'ml-6 border-4 bg-blue-400 border-blue-400' : 'ml-7'}`}>
                <Image
                    src={`${thumbnailsEndpoint}/${thumbnail_filename}${thumbnail_extension}?access_token=mytoken`}
                    width="60"
                    height="60"
                    alt="detection picture"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDACAhITMkM1EwMFFCLy8vQiccHBwcJyIXFxcXFyIRDAwMDAwMEQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/2wBDASIzMzQmNCIYGCIUDg4OFBQODg4OFBEMDAwMDBERDAwMDAwMEQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAFAAUDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCqAo//2Q=="
                    className="rounded-[calc(theme(borderRadius.DEFAULT)-2px)]"
                />
            </div>
        </div>
    )
});

export default RecordingsListItem;
