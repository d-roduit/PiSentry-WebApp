'use client';

import { useSelector, selectSelectedRecording } from '@/lib/redux';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer.jsx';
import CamerasCarousel from '@/components/CamerasCarousel/CamerasCarousel.jsx';
import urls from '@/urls.js';

const { backendApiUrl } = urls;
const recordingsEndpoint = `${backendApiUrl}/v1/recordings`;

export default function Players() {
    const selectedRecording = useSelector(selectSelectedRecording);
    const recordingFilename = selectedRecording?.recording_filename;
    const recordingExtension = selectedRecording?.recording_extension;
    const recordingMimeType = recordingExtension?.substring(1);

    const isLiveSelected = selectedRecording === null;

    const recordingVideoPlayerOptions = {
        sources: {
            src: `${recordingsEndpoint}/${recordingFilename}${recordingExtension}?access_token=mytoken#t=0.001`,
            type: `video/${recordingMimeType}`,
        },
    };

    return (
        <div>
            {isLiveSelected ? <CamerasCarousel /> : <VideoPlayer options={recordingVideoPlayerOptions} />}
        </div>
    );
}
