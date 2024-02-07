'use client';

import { useEffect } from 'react';
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

const {
    camerasApiEndpoint,
    thumbnailsApiEndpoint,
    streamingApiEndpoint,
    pisentryLivestreamEndpoint,
} = urls;

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
            await new FetchRequest(`${streamingApiEndpoint}/${camera_id}/start`)
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
            await new FetchRequest(`${streamingApiEndpoint}/${camera_id}/start`)
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

        if (nbRetriesLeft <= 0) {
            player.removeClass('vjs-waiting');
        }

        if (isRetrying || (errorCode !== 2 && errorCode !== 4) || nbRetriesLeft <= 0) {
            return;
        }

        isRetrying = true;

        player.error(null); // While retrying, we don't show the error message on the player
        player.addClass('vjs-waiting');

        if (nbRetriesLeft % fetchWhenNbRetriesIsMultipleOf === 0) {
            await new FetchRequest(`${streamingApiEndpoint}/${camera_id}/start`)
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

                if (videojs.browser.IS_FIREFOX || videojs.browser.IS_IOS) {
                    const playPromise = player.play();

                    if (playPromise !== undefined) {
                        playPromise.then(_ => {
                            // Autoplay started!
                        }).catch(error => {
                            // Autoplay was prevented.
                            // Show a "Play" button so that user can start playback.
                            player.removeClass('vjs-waiting');
                        });
                    }
                } else {
                    player.removeClass('vjs-waiting');
                }
            } catch (err) {
                console.log('Exception caught while trying to load player:', err);
            }

            isRetrying = false;
        }, retryDelay);
    });
}

const renderCameraVideoPlayer = (cameraData) => (
    <VideoPlayer
        options={{
            id: `${cameraData.camera_id}`, // id for videojs player must be a string
            sources: {
                src: `${pisentryLivestreamEndpoint}/${cameraData.port}/index.m3u8`,
                type: 'application/x-mpegURL',
            },
            poster: `${thumbnailsApiEndpoint}/${cameraData.camera_id}/live?access_token=mytoken`,
        }}
        onReady={(player) => onReadyVideoPlayer(player, cameraData)}
        afterInstantiation={(player) => afterVideoPlayerInstantiation(player, cameraData)}
    />
);

export default function CamerasCarousel() {
    const { data, error, isLoading } = useSWR(
        camerasApiEndpoint,
        () => new FetchRequest(camerasApiEndpoint)
            .options({
                method: 'GET',
                headers: { Authorization: 'mytoken' },
                fetchRequest: { throwException: true },
            })
            .responseType(FetchRequest.ResponseType.Json)
            .make(),
        { revalidateOnFocus: false }
    );

    const dispatch = useDispatch();

    useEffect(() => {
        const cameras = data?.data;

        if (typeof cameras === 'undefined') {
            return;
        }

        const hasSeveralCameras = cameras?.length > 1;

        if (hasSeveralCameras) {
            // We return because it is the `onPaginationUpdated()` handler which will dispatch
            // the correct camera to be shown first, in case it is not the first one by default.
            return;
        }

        dispatch(camerasSlice.actions.setSelectedCamera(cameras?.[0]));
    }, [data, dispatch]);

    if (error) return (
        <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-gray-500 w-full">
                <FaCircleExclamation className="text-xl shrink-0" />
                <p className="mt-2">Error while recovering cameras</p>
            </div>
            <VideoPlayerPlaceholder />
        </div>
    );

    if (isLoading) return <VideoPlayerPlaceholder />

    const cameras = data?.data;
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
        dispatch(camerasSlice.actions.setSelectedCamera(cameraData));
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
