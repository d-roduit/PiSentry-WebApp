'use client';

import Carousel from '@/components/Carousel/Carousel.jsx';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer.jsx';
import VideoPlayerPlaceholder from '@/components/VideoPlayerPlaceholder/VideoPlayerPlaceholder.jsx';
import urls from '@/urls.js';
import useSWR from 'swr';
import FetchRequest from '@/helpers/FetchRequest.js';
import { FaCircleExclamation } from 'react-icons/fa6';
import videojs from 'video.js';
import {
    camerasSlice,
    useDispatch,
} from '@/lib/redux';

const { backendApiUrl, mediaServerUrl } = urls;
const camerasEndpoint = `${backendApiUrl}/v1/cameras`;
const thumbnailsEndpoint = `${backendApiUrl}/v1/thumbnails`;

const renderCameraVideoPlayer = (cameraData) => (
    <VideoPlayer
        options={{
            id: `${cameraData.camera_id}`,
            sources: {
                src: `${mediaServerUrl}/pisentry/${cameraData.port}/index.m3u8`,
                type: 'application/x-mpegURL',
            },
            poster: `${thumbnailsEndpoint}/live?access_token=mytoken`,
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

    const dispatch = useDispatch();

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

    const onCarouselSlideChanged = (splide, newIndex, prevIndex) => {
        if (newIndex === prevIndex) {
            return;
        }
        const prevSlidePlayerId = cameras[prevIndex].camera_id;
        const prevSlidePlayer = videojs.players[prevSlidePlayerId];
        prevSlidePlayer.pause();
    }

    const onPaginationUpdated = (splide, data, prev, curr) => {
        const cameraData = cameras[curr.page];
        dispatch(camerasSlice.actions.setSelectedCamera(cameraData))
    };

    return hasSeveralCameras ? (
        <Carousel
            items={cameras}
            renderItem={(item) => renderCameraVideoPlayer(item)}
            splideProps={{
                onMoved: onCarouselSlideChanged,
                onPaginationUpdated,
            }}
        />
    ) : renderCameraVideoPlayer(cameras?.[0]);
}
