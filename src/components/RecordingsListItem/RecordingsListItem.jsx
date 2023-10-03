import DetectedObjectIcon from '@/components/DetectedObjectIcon/DetectedObjectIcon.jsx';
import VideoPlaceholder from '@/components/VideoPlaceholder.jsx';
import dayjs from 'dayjs'
import Image from 'next/image';
import urls from '@/urls.js';
import LoadingSpinner from '@/components/Loading/Spinner.jsx';
import { Suspense } from 'react';

const { backendApiUrl } = urls;

const thumbnailsEndpoint = `${backendApiUrl}/v1/thumbnails`;

export default function RecordingsListItem({ data }) {
    const { recorded_at, recording_id, recording_filename, thumbnail_filename, object_type } = data;

    const dayjsDate = dayjs(recorded_at);

    return (
        <div className="group flex items-center h-20 md:transition md:hover:bg-blue-50 md:cursor-pointer">
            <p className="w-24 text-gray-600 font-medium text-center">{dayjsDate.format('HH:mm')}</p>
            <div className="relative z-0 self-stretch flex items-center">
                <div className="absolute left-1/2 -z-10 -translate-x-1/2 h-full border-r-2 border-r-gray-100 group-first:bottom-0 group-first:h-1/2 group-last:top-0 group-last:h-1/2 group-only:border-r-0" />
                <DetectedObjectIcon type={object_type} />
            </div>
            <div className="ml-7 rounded">
                <Image
                    src={`${thumbnailsEndpoint}/${thumbnail_filename}?access_token=mytoken`}
                    width="60"
                    height="60"
                    alt="detection picture"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDACAhITMkM1EwMFFCLy8vQiccHBwcJyIXFxcXFyIRDAwMDAwMEQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/2wBDASIzMzQmNCIYGCIUDg4OFBQODg4OFBEMDAwMDBERDAwMDAwMEQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAFAAUDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCqAo//2Q=="
                    className="rounded"
                />
            </div>
        </div>
    )
}
