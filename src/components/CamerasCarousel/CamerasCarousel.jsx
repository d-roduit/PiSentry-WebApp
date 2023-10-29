'use client';

import Carousel from '@/components/Carousel/Carousel.jsx';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer.jsx';
import VideoPlayerPlaceholder from '@/components/VideoPlayerPlaceholder/VideoPlayerPlaceholder.jsx';
import urls from '@/urls.js';
import useSWR from 'swr';
import FetchRequest from '@/helpers/FetchRequest.js';
import { FaCircleExclamation } from 'react-icons/fa6';

const { backendApiUrl, mediaServerUrl } = urls;
const camerasEndpoint = `${backendApiUrl}/v1/cameras`;

// const isChangingItemCallback = (prev, next) => {
//     console.log('is changing item');
//     console.log(prev.index, next.index);
// };

const renderCameraVideoPlayer = (cameraData) => (
    <VideoPlayer
        options={{
            sources: {
                src: `${mediaServerUrl}/pisentry/${cameraData.port}/index.m3u8`,
                type: 'application/x-mpegURL',
            }
        }}
    />
);

export default function CamerasCarousel() {
    const { data, error, isLoading } = useSWR(
        camerasEndpoint,
        () => new FetchRequest(camerasEndpoint).options({
            method: 'GET',
            headers: { Authorization: 'mytoken' },
        }).responseType(FetchRequest.ResponseType.Json).make(),
        { revalidateOnFocus: false }
    );

    if (error) return (
        <div>
            <p className="flex items-center text-gray-500">
                <FaCircleExclamation className="inline-block mr-2" /> Error while recovering cameras
            </p>
        </div>
    );

    if (isLoading) return <VideoPlayerPlaceholder />

    const cameras = data?.responseData;
    const hasSeveralCameras = cameras?.length > 1;

    return hasSeveralCameras ? (
        <Carousel
            items={cameras}
            renderItem={(item) => renderCameraVideoPlayer(item)}
        />
    ) : renderCameraVideoPlayer(cameras?.[0]);
}
