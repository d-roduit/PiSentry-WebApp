'use client';

import { useSelector, selectSelectedRecording } from '@/lib/redux';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer.jsx';
import CamerasCarousel from '@/components/CamerasCarousel/CamerasCarousel.jsx';
import urls from '@/urls.js';

const { backendApiUrl } = urls;
const recordingsEndpoint = `${backendApiUrl}/v1/recordings`;

export default function Players() {
    const selectedRecording = useSelector(selectSelectedRecording);

    const isLiveSelected = selectedRecording === null;

    const recordingVideoPlayerOptions = {
        sources: {
            src: `${recordingsEndpoint}/${selectedRecording?.recording_filename}?access_token=mytoken#t=0.001`,
            type: 'video/mp4',
        },
    };

    return (
        <div>
            {isLiveSelected ? <CamerasCarousel /> : <VideoPlayer options={recordingVideoPlayerOptions} />}
        </div>
    );
}
