'use client';

import { useEffect, useRef, useState } from 'react';
import { FaCircleCheck, FaCircleExclamation } from 'react-icons/fa6';
import FetchRequest from '@/helpers/FetchRequest.js';
import { notFound } from 'next/navigation';
import { useFetchRequest } from '@/helpers/customHooks.js';
import LoadingSpinner from '@/components/Loading/Spinner.jsx';
import RenameCameraSettingPlaceholder from '@/components/RenameCameraSetting/RenameCameraSettingPlaceholder.jsx';
import urls from '@/urls.js';

const { camerasApiEndpoint } = urls;

export default function RenameCameraSetting({ cameraId }) {
    const [initialName, setInitialName] = useState('');
    const [newName, setNewName] = useState('');
    const [saveButtonVisible, setSaveButtonVisible] = useState(false);
    const [saveState, setSaveState] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const isSaveButtonEnabled = useRef(true);

    useEffect(() => {
        const trimmedName = newName.trim();
        if (trimmedName === initialName || trimmedName === '') {
            setSaveButtonVisible(false);
            return;
        }

        setSaveState(null);
        setSaveButtonVisible(true);
    }, [initialName, newName]);

    const isNewNameValid = () => {
        return newName.length > 0 && newName.length <= 35;
    };

    const onClickSaveButton = async () => {
        if (!isSaveButtonEnabled.current) {
            return;
        }

        if (!isNewNameValid()) return;

        isSaveButtonEnabled.current = false;
        setIsSaving(true);

        await new FetchRequest(`${camerasApiEndpoint}/${cameraId}`)
            .options({
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'mytoken'
                },
                body: JSON.stringify({ 'name': newName.trim() }),
            })
            .success(() => {
                setInitialName(newName.trim());
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
                    message: 'Error while saving name. Please retry.',
                });
                setSaveButtonVisible(true);
            })
            .exception(() => {
                setSaveState({
                    icon: <FaCircleExclamation className="shrink-0" />,
                    textColor: 'text-red-500',
                    message: 'Error while saving name. Please retry.',
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
        const camera = data;

        if (typeof camera === 'undefined') {
            return;
        }

        setInitialName(camera.name);
        setNewName(camera.name);
    }, [data]);

    if (isLoading) {
        return (
            <RenameCameraSettingPlaceholder
                content={
                    <>
                        <LoadingSpinner className="h-4 w-4 border-2 border-gray-500 border-r-transparent"/>
                        <p className="ml-2 text-gray-500">Loading...</p>
                    </>
                }
            />
        );
    }

    if (exception) {
        return (
            <RenameCameraSettingPlaceholder
                content={
                    <div className="flex items-center text-gray-500">
                        <FaCircleExclamation className="shrink-0" />
                        <p className="ml-2">Error while recovering camera name</p>
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
                    <RenameCameraSettingPlaceholder
                        content={
                            <div className="flex items-center text-gray-500">
                                <FaCircleExclamation className="shrink-0" />
                                <p className="ml-2">Server error while recovering camera name</p>
                            </div>
                        }
                    />
                );
        }
    }

    return (
        <main className="py-5">
            <input
                type="text"
                placeholder="Name"
                value={newName}
                maxLength={35}
                className="w-full rounded-none border-y bg-gray-100 p-4 font-medium focus:outline-none"
                onChange={(e) => setNewName(e.target.value)}
            />

            {saveState !== null && (
                <div className={`px-3 mt-1 flex items-center text-sm ${saveState.textColor}`}>
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
        </main>
    )
}
