'use client';

import urls from '@/urls.js';
import { FaAngleRight, FaCircleExclamation } from 'react-icons/fa6';
import Link from 'next/link';
import DetectedObjectIcon from '@/components/DetectedObjectIcon/DetectedObjectIcon.jsx';
import { useFetchRequest } from '@/helpers/customHooks.js';
import FetchRequest from '@/helpers/FetchRequest.js';
import LoadingSpinner from '@/components/Loading/Spinner.jsx';

const { detectableObjectsActionsApiEndpoint } = urls;

const mapActionNameToText = {
    'ignore': 'Ignore',
    'record': 'Record only',
    'record+notification': 'Record and send notification',
};

export default function DetectableObjectsList({ cameraId, detectableObjects }) {
    const { data: detectableObjectsActions, exception, notOk, isLoading } = useFetchRequest(
        new FetchRequest(`${detectableObjectsActionsApiEndpoint}/${cameraId}`)
            .options({
                method: 'GET',
                headers: { Authorization: 'mytoken' },
                next: { revalidate: 0 },
            })
            .responseType(FetchRequest.ResponseType.Json),
        []
    );

    const mapObjectTypeToActionText = {};

    if (detectableObjectsActions && Array.isArray(detectableObjectsActions) && detectableObjectsActions.length > 0) {
        for (const objectAction of detectableObjectsActions) {
            mapObjectTypeToActionText[objectAction.object_type] = mapActionNameToText?.[objectAction.action_name];
        }
    }

    return (
        <div>
            {detectableObjects.map(({ object_id, object_type }) => (
                <Link
                    key={object_id}
                    href={`/settings/cameras/${cameraId}/object-detection/${object_type}`}
                    className="flex justify-between items-center px-3 py-3 first:border-t border-b md:transition md:hover:bg-gray-100 md:cursor-pointer"
                >
                    <div className="flex items-center">
                        <DetectedObjectIcon type={object_type} />
                        <div className="ml-3">
                            <p className="font-medium capitalize">{object_type}</p>
                                {isLoading ? (
                                    <LoadingSpinner className="mt-2 h-3 w-3 border border-gray-500 border-r-transparent" />
                                ) : (
                                    exception || notOk ? (
                                        <p className="flex items-center text-gray-500 text-sm">
                                            <FaCircleExclamation className="shrink-0" />
                                            <p className="ml-2">Error while recovering action</p>
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            {mapObjectTypeToActionText?.[object_type]}
                                        </p>
                                    )
                                )}
                        </div>
                    </div>
                    <div>
                        <FaAngleRight className="text-gray-400"/>
                    </div>
                </Link>
            ))}
        </div>
    );
}
