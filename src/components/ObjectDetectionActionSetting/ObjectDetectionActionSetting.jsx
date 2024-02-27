'use client';

import { useEffect, useRef, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useFetchRequest } from '@/helpers/customHooks.js';
import FetchRequest from '@/helpers/FetchRequest.js';
import { FaCircleExclamation } from 'react-icons/fa6';
import { notFound } from 'next/navigation';
import LoadingSpinner from '@/components/Loading/Spinner.jsx';
import urls from '@/urls.js';

const { detectableObjectsActionsApiEndpoint } = urls;

const mapActionNameToText = {
    'ignore': 'Ignore',
    'record': 'Record only',
    'record+notification': 'Record and send notification',
};

export default function ObjectDetectionActionSetting({ cameraId, objectType, detectionActions }) {
    const [objectDetectionAction, setObjectDetectionAction] = useState(null);
    const [selectedActionId, setSelectedActionId] = useState(null);
    const [dataState, setDataState] = useState(null);

    const lastAbortControllerKey = useRef('');
    const abortControllersMap = useRef({});

    const { data, exception, notOk, response, isLoading } = useFetchRequest(
        new FetchRequest(`${detectableObjectsActionsApiEndpoint}/${cameraId}/${objectType}`)
            .options({
                method: 'GET',
                headers: { Authorization: 'mytoken' },
                next: { revalidate: 0 },
            })
            .responseType(FetchRequest.ResponseType.Json),
        []);

    useEffect(() => {
        return () => {
            Object.values(abortControllersMap.current).forEach(abortController => abortController.abort());
        }
    }, []);

    useEffect(() => {
        const objectDetectionAction = data?.[0];

        console.log('objectDetectionAction:', objectDetectionAction);

        if (typeof objectDetectionAction === 'undefined') {
            return;
        }

        setObjectDetectionAction(objectDetectionAction);
        setSelectedActionId(objectDetectionAction.action_id);
        setDataState(null);
    }, [data]);

    useEffect(() => {
        if (isLoading) {
            setDataState({
                icon: <LoadingSpinner className="h-4 w-4 border border-gray-500 border-r-transparent"/>,
                textColor: 'text-gray-500',
                message: 'Loading action data...',
            });
            return;
        }

        if (exception) {
            setDataState({
                icon: <FaCircleExclamation className="shrink-0"/>,
                textColor: 'text-gray-500',
                message: 'Error while recovering action data',
            });
            return;
        }

        if (notOk) {
            switch (response.status) {
                case 400:
                case 404:
                    notFound();
                    break;
                case 500:
                    setDataState({
                        icon: <FaCircleExclamation className="shrink-0"/>,
                        textColor: 'text-gray-500',
                        message: 'Server error while recovering action data',
                    });
                    break;
            }
        }
    }, [isLoading, exception, notOk, response]);

    const saveToDB = async (actionId) => {
        if (abortControllersMap.current[lastAbortControllerKey.current]) {
            abortControllersMap.current[lastAbortControllerKey.current].abort();
        }

        const key = Date.now().toString();
        abortControllersMap.current[key] = new AbortController();
        lastAbortControllerKey.current = key;

        await new FetchRequest(`${detectableObjectsActionsApiEndpoint}/${cameraId}/${objectDetectionAction?.object_id}`)
            .options({
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'mytoken'
                },
                body: JSON.stringify({
                    'FK_detection_action_id': actionId,
                }),
                signal: abortControllersMap.current[key].signal,
            })
            .responseNotOk(() => {
                setDataState({
                    icon: <FaCircleExclamation className="shrink-0" />,
                    textColor: 'text-red-500',
                    message: 'Error while saving action. Please retry.',
                });
            })
            .exception(() => {
                if (abortControllersMap.current[key].signal.aborted) {
                    return;
                }

                setDataState({
                    icon: <FaCircleExclamation className="shrink-0" />,
                    textColor: 'text-red-500',
                    message: 'Error while saving action. Please retry.',
                });
            })
            .make();

        delete abortControllersMap.current[key];
    };

    const onClickActionButton = async (actionId) => {
        if (isLoading) return;

        setSelectedActionId(actionId);
        setDataState(null);

        await saveToDB(actionId);
    };

    return (
        <>
            {detectionActions.map(({ action_id, name }) => {
                const isButtonSelected = selectedActionId === action_id;

                return (
                    <button
                        key={action_id}
                        id={action_id}
                        className={`${isButtonSelected ? 'bg-gray-100' : ''} w-full flex justify-between items-center px-3 py-4 first:border-t border-b md:transition md:hover:bg-gray-100 md:cursor-pointer`}
                        onClick={() => onClickActionButton(action_id)}
                    >
                        <p className="font-medium">{mapActionNameToText?.[name]}</p>
                        {isButtonSelected && <FaCheck className="text-indigo-600 w-5 h-5"/>}
                    </button>
                );
            })}

            {dataState !== null && (
                <div className={`px-3 mt-3 flex items-center text-sm ${dataState.textColor}`}>
                    {dataState.icon}
                    <p className="ml-2">{dataState.message}</p>
                </div>
            )}
        </>
    );
}
