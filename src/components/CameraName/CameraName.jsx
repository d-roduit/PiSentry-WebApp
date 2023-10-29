'use client';

import { useSelector, selectSelectedCamera, selectSelectedRecording } from '@/lib/redux';

export default function CameraName() {
    const selectedCamera = useSelector(selectSelectedCamera);
    const selectedRecording = useSelector(selectSelectedRecording);
    const isLiveSelected = selectedRecording === null;
    return isLiveSelected
        ? (
            <p className="text-gray-900 md:text-lg font-bold first-letter:capitalize px-10 whitespace-nowrap overflow-hidden overflow-ellipsis">
                {selectedCamera?.name}
            </p>
        )
        : null;
}
