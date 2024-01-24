import FetchRequest from '@/helpers/FetchRequest.js';
import { FaCircleExclamation } from 'react-icons/fa6';
import ObjectDetectionActionSetting from '@/components/ObjectDetectionActionSetting/ObjectDetectionActionSetting.jsx';
import urls from '@/urls.js';

const { detectionActionsApiEndpoint } = urls;

export default async function ObjectDetectionActionsList({ cameraId, objectType }) {
    const { data: detectionActions , exception, notOk, response } = await new FetchRequest(detectionActionsApiEndpoint)
        .options({
            method: 'GET',
            headers: { Authorization: 'mytoken' },
        })
        .responseType(FetchRequest.ResponseType.Json)
        .make();

    if (exception) {
        return (
            <p className="flex flex-col items-center px-3 text-gray-500">
                <FaCircleExclamation className="text-xl shrink-0"/>
                <p className="mt-2">Error while recovering detection actions</p>
            </p>
        );
    }

    if (notOk) {
        let errorMessage = 'Unknown error while recovering detection actions';
        switch (response.status) {
            case 500:
                errorMessage = 'Server error while recovering detection actions';
        }

        return (
            <p className="flex flex-col items-center px-3 text-gray-500">
                <FaCircleExclamation className="text-xl shrink-0"/>
                <p className="mt-2">{errorMessage}</p>
            </p>
        );
    }

    const hasDetectionActions = Array.isArray(detectionActions) && detectionActions.length > 0;

    return hasDetectionActions ? (
        <ObjectDetectionActionSetting cameraId={cameraId} objectType={objectType} detectionActions={detectionActions} />
    ) : (
        <p className="px-3 text-gray-500">No detection actions yet...</p>
    );
}
