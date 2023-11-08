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
const streamingEndpoint = `${backendApiUrl}/v1/streaming`;

const onReadyVideoPlayer = (player, cameraData) => {
    const { camera_id } = cameraData;

    let startDate = null;
    let alreadyDid3Seconds = false;
    let alreadyDid6Seconds = false;
    let nbRetriesLeft = 5;

    player.tech().on('retryplaylist', async () => {
        if (nbRetriesLeft <= 0) {
            return;
        }

        if (startDate === null) {
            await new FetchRequest(`${streamingEndpoint}/${camera_id}/start`)
                .options({
                    method: 'POST',
                    headers: { Authorization: 'mytoken' }
                })
                .responseNotOk(() => console.log('startResponse in retry playlist not ok'))
                .exception((err) => console.log('Exception caught while retry playlist:', err))
                .make();

            startDate = new Date();
            return;
        }

        const currentDate = new Date();
        const seconds = (currentDate.getTime() - startDate.getTime()) / 1000;

        if (seconds >= 3 && !alreadyDid3Seconds) {
            alreadyDid3Seconds = true;
            player.currentTime(0);
        }

        if (seconds >= 6 && !alreadyDid6Seconds) {
            alreadyDid6Seconds = true;
            await new FetchRequest(`${streamingEndpoint}/${camera_id}/start`)
                .options({
                    method: 'POST',
                    headers: { Authorization: 'mytoken' }
                })
                .responseNotOk(() => console.log('startResponse in retry playlist not ok'))
                .exception((err) => console.log('Exception caught while retry playlist:', err))
                .make();

            player.currentTime(0);

            --nbRetriesLeft;
            startDate = new Date();
            alreadyDid3Seconds = false;
            alreadyDid6Seconds = false;
        }
    });
}

const afterVideoPlayerInstantiation = (player, cameraData) => {
    const { camera_id } = cameraData;

    let nbRetriesLeft = 15;
    const fetchWhenNbRetriesIsMultipleOf = 5;
    const retryDelay = 2000;
    let isRetrying = false;

    player.on('error', async () => {
        let errorCode = -1;

        try {
            errorCode = player.error().code;
        } catch (err) {
            console.log('Exception caught while getting player error code:', err);
            return;
        }

        if (isRetrying || (errorCode !== 2 && errorCode !== 4) || nbRetriesLeft <= 0) {
            return;
        }

        isRetrying = true;

        player.error(null); // While retrying, we don't show the error message on the player

        if (nbRetriesLeft % fetchWhenNbRetriesIsMultipleOf === 0) {
            await new FetchRequest(`${streamingEndpoint}/${camera_id}/start`)
                .options({
                    method: 'POST',
                    headers: { Authorization: 'mytoken' }
                })
                .responseNotOk(() => console.log('Fetch response not ok in onError handler'))
                .exception(() => console.log('Exception caught in onError handler when fetching to start streaming'))
                .make();
        }

        nbRetriesLeft--;

        setTimeout(() => {
            try {
                player.load();
            } catch (err) {
                console.log('Exception caught while trying to load player:', err);
            }

            isRetrying = false;
        }, retryDelay);
    })
}

const renderCameraVideoPlayer = (cameraData) => (
    <VideoPlayer
        options={{
            id: `${cameraData.camera_id}`, // id for videojs player must be a string
            sources: {
                src: `${mediaServerUrl}/pisentry/${cameraData.port}/index.m3u8`,
                type: 'application/x-mpegURL',
            },
            poster: `${thumbnailsEndpoint}/${cameraData.camera_id}/live?access_token=mytoken`,
        }}
        onReady={(player) => onReadyVideoPlayer(player, cameraData)}
        afterInstantiation={(player) => afterVideoPlayerInstantiation(player, cameraData)}
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
    let hasSeveralCameras = cameras?.length > 1;

    if (hasSeveralCameras) {
        cameras.pop();
        hasSeveralCameras = false;
    }

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
