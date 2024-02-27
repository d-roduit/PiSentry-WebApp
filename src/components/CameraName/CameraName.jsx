'use client';

import { useSelector, selectSelectedCamera, selectSelectedRecording } from '@/lib/redux';

export default function CameraName() {
    const selectedCamera = useSelector(selectSelectedCamera);
    const selectedRecording = useSelector(selectSelectedRecording);
    const isLiveSelected = selectedRecording === null;
    return isLiveSelected
        ? (
            <p className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                {selectedCamera?.name}
            </p>
        )
        : null;
}
