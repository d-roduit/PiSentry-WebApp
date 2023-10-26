'use client';

import Carousel from '@/components/Carousel/Carousel.jsx';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer.jsx';
import urls from '@/urls.js';
import useSWR from 'swr';
import FetchRequest from '@/helpers/FetchRequest.js';
import VideoPlaceholder from '@/components/VideoPlaceholder.jsx';
import { FaCircleExclamation } from 'react-icons/fa6';

const { backendApiUrl, mediaServerUrl } = urls;
const camerasEndpoint = `${backendApiUrl}/v1/cameras`;

const isChangingItemCallback = (prev, next) => {
    console.log('is changing item');
    console.log(prev.index, next.index);
    // prev.domElement.pause();
    // next.domElement.play();
};

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

    if (isLoading) return <VideoPlaceholder />

    const cameras = data?.responseData;
    const hasSeveralCameras = cameras?.length > 1;

    return hasSeveralCameras ? (
        <Carousel
            items={cameras}
            renderItem={({ item, itemRef }) => (
                <VideoPlayer
                    // ref={itemRef}
                    options={{
                        sources: {
                            src: `${mediaServerUrl}/pisentry/${item.port}/index.m3u8`,
                            type: 'application/x-mpegURL',
                        }
                    }}
                />
            )}
            onItemChange={isChangingItemCallback}
        />
    ) : (
        <VideoPlayer
            options={{
                sources: {
                    src: `${mediaServerUrl}/pisentry/${cameras?.[0].port}/index.m3u8`,
                    type: 'application/x-mpegURL',
                }
            }}
        />
    );
}
