'use client';

import { useEffect, useRef, useState } from 'react';
import TimeRange from '@/components/TimeRange/TimeRange.jsx';
import TimeRangePlaceholder from '@/components/TimeRange/TimeRangePlaceholder.jsx';
import FetchRequest from '@/helpers/FetchRequest.js';
import urls from '@/urls.js';
import { FaCircleCheck, FaCircleExclamation } from 'react-icons/fa6';
import { notFound } from 'next/navigation';
import { useFetchRequest } from '@/helpers/customHooks.js';
import LoadingSpinner from '@/components/Loading/Spinner.jsx';

const { camerasApiEndpoint } = urls;

export default function DetectionTimeRangeSetting({ cameraId }) {
    const [initialTimeRange, setInitialTimeRange] = useState(null);
    const [newTimeRange, setNewTimeRange] = useState(null);
    const [saveButtonVisible, setSaveButtonVisible] = useState(false);
    const [saveState, setSaveState] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const isSaveButtonEnabled = useRef(true);

    const onClickSaveButton = async () => {
        if (!isSaveButtonEnabled.current) {
            return;
        }

        isSaveButtonEnabled.current = false;
        setIsSaving(true);

        await new FetchRequest(`${camerasApiEndpoint}/${cameraId}`)
            .options({
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'mytoken'
                },
                body: JSON.stringify({
                    'detection_start_time': newTimeRange.from,
                    'detection_end_time': newTimeRange.to,
                }),
            })
            .success(() => {
                setInitialTimeRange(newTimeRange);
                setSaveState({
                    icon: <FaCircleCheck />,
                    textColor: 'text-green-500',
                    message: 'Saved',
                });
                setSaveButtonVisible(false);
            })
            .responseNotOk(() => {
                setSaveState({
                    icon: <FaCircleExclamation className="shrink-0" />,
                    textColor: 'text-red-500',
                    message: 'Error while saving time. Please retry.',
                });
                setSaveButtonVisible(true);
            })
            .exception(() => {
                setSaveState({
                    icon: <FaCircleExclamation className="shrink-0" />,
                    textColor: 'text-red-500',
                    message: 'Error while saving time. Please retry.',
                });
                setSaveButtonVisible(true);
            })
            .make();

        isSaveButtonEnabled.current = true;
        setIsSaving(false);
    };

    const { data, exception, notOk, response, isLoading } = useFetchRequest(
        new FetchRequest(`${camerasApiEndpoint}/${cameraId}`)
            .options({
                method: 'GET',
                headers: { Authorization: 'mytoken' },
                next: { revalidate: 0 },
            })
            .responseType(FetchRequest.ResponseType.Json),
        []);

    useEffect(() => {
        if (initialTimeRange === null || newTimeRange === null) {
            return;
        }

        if (initialTimeRange.from === newTimeRange.from && initialTimeRange.to === newTimeRange.to) {
            setSaveButtonVisible(false);
            return;
        }

        setSaveState(null);
        setSaveButtonVisible(true);
    }, [initialTimeRange, newTimeRange]);

    useEffect(() => {
        const camera = data;

        if (typeof camera === 'undefined') {
            return;
        }

        const currentTimeRange = {
            from: camera.detection_start_time,
            to: camera.detection_end_time,
        };

        setInitialTimeRange(currentTimeRange);
        setNewTimeRange(currentTimeRange);
    }, [data]);

    const renderPlaceholder = () => {
        if (isLoading) {
            return (
                <TimeRangePlaceholder
                    content={<LoadingSpinner className="ml-3 h-5 w-5 border-2 border-gray-500 border-r-transparent" />}
                />
            );
        }

        if (exception) {
            return (
                <TimeRangePlaceholder
                    content={
                        <div className="flex items-center text-gray-500">
                            <FaCircleExclamation className="text-lg shrink-0"/>
                            <p className="ml-2">Error while recovering time range</p>
                        </div>
                    }
                />
            );
        }

        if (notOk) {
            switch (response.status) {
                case 400:
                case 404:
                    notFound();
                    break;
                case 500:
                    return (
                        <TimeRangePlaceholder
                            content={
                                <div className="flex items-center text-gray-500">
                                    <FaCircleExclamation className="text-lg shrink-0"/>
                                    <p className="ml-2">Server error while recovering time range</p>
                                </div>
                            }
                        />
                    );
            }
        }
    };

    return (
        <>
            {isLoading || exception || notOk ? renderPlaceholder() : (
                <TimeRange
                    initialTimeRange={initialTimeRange}
                    onChange={(e) => setNewTimeRange(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                />
            )}

            <p className="text-sm text-gray-500 mt-2 px-3">
                No action will be performed outside the times defined above
            </p>

            {saveState !== null && (
                <div className={`px-3 mt-2 flex items-center text-sm ${saveState.textColor}`}>
                    {saveState.icon}
                    <p className="ml-2">{saveState.message}</p>
                </div>
            )}

            {saveButtonVisible && (
                <div className="px-3 mt-6">
                    <button
                        className="w-full flex justify-center items-center bg-indigo-600 text-white font-medium rounded-md py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={onClickSaveButton}
                        disabled={!isSaveButtonEnabled.current}
                    >
                        {isSaving ? <LoadingSpinner className="h-6 w-6 border-2 border-white border-r-transparent" /> : 'Save'}
                    </button>
                </div>
            )}
        </>
    );
}
