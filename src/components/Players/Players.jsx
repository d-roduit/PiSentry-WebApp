'use client';

import { useSelector, selectSelectedRecording } from '@/lib/redux';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer.jsx';
import CamerasCarousel from '@/components/CamerasCarousel/CamerasCarousel.jsx';
import urls from '@/urls.js';

const { recordingsApiEndpoint, thumbnailsApiEndpoint } = urls;

export default function Players() {
    const selectedRecording = useSelector(selectSelectedRecording);
    const recordingFilename = selectedRecording?.recording_filename;
    const recordingExtension = selectedRecording?.recording_extension;
    const thumbnailFilename = selectedRecording?.thumbnail_filename;
    const thumbnailExtension = selectedRecording?.thumbnail_extension;
    const cameraId = selectedRecording?.camera_id;
    const recordingMimeType = recordingExtension?.substring(1);

    const isLiveSelected = selectedRecording === null;

    const recordingVideoPlayerOptions = {
        sources: {
            src: `${recordingsApiEndpoint}/${cameraId}/${recordingFilename}${recordingExtension}?access_token=mytoken#t=0.001`,
            type: `video/${recordingMimeType}`,
        },
        poster: `${thumbnailsApiEndpoint}/${cameraId}/${thumbnailFilename}${thumbnailExtension}?access_token=mytoken`,
    };

    return (
        <div>
            {isLiveSelected ? <CamerasCarousel /> : <VideoPlayer options={recordingVideoPlayerOptions} />}
        </div>
    );
}
