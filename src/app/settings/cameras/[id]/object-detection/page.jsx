import Link from 'next/link';
import { FaAngleLeft, FaCircleExclamation } from 'react-icons/fa6';
import NavigationHeader from '@/components/NavigationHeader/NavigationHeader.jsx';
import { notFound } from 'next/navigation';
import DetectionTimeRangeSetting from '@/components/DetectionTimeRangeSetting/DetectionTimeRangeSetting.jsx';
import { isStringPositiveInteger } from '@/helpers/validation.js';
import FetchRequest from '@/helpers/FetchRequest.js';
import urls from '@/urls.js';
import DetectableObjectsList from '@/components/DetectableObjectsList/DetectableObjectsList.jsx';

const { detectableObjectsApiEndpoint } = urls;

export const metadata = {
    title: 'Object detection',
};

export default async function ObjectDetectionPage({ params }) {
    const isCameraIdAcceptable = isStringPositiveInteger(params.id);

    if (!isCameraIdAcceptable) {
        notFound();
    }

    const cameraId = parseInt(params.id);

    const { data: detectableObjects , exception, notOk } = await new FetchRequest(detectableObjectsApiEndpoint)
        .options({
            method: 'GET',
            headers: { Authorization: 'mytoken' },
        })
        .responseType(FetchRequest.ResponseType.Json)
        .make();

    const hasDetectableObjects = Array.isArray(detectableObjects) && detectableObjects.length > 0;

    return (
        <>
            <NavigationHeader
                leftContent={
                    <Link href="/settings/cameras">
                        <FaAngleLeft className="text-xl" />
                    </Link>
                }
                centerContent={<h1 className="text-center">Object detection</h1>}
            />
            <main className="py-5">
                <p className="text-sm text-center px-3">Define when object detection is active and what actions to
                    perform when objects are detected.</p>
                <div className="mt-6">
                    <p className="px-3 pb-2 font-medium text-indigo-600">Object detection is active...</p>
                    <div>
                        <DetectionTimeRangeSetting cameraId={cameraId} />
                    </div>
                </div>
                <div className="mt-8">
                    <p className="px-3 pb-2 font-medium text-indigo-600">Actions to perform</p>
                    {exception || notOk ? (
                        <div className="flex items-center px-3 text-gray-500">
                            <FaCircleExclamation className="text-xl shrink-0"/>
                            <p className="ml-2">Error while recovering actions data</p>
                        </div>
                    ) : (
                        hasDetectableObjects ? (
                            <DetectableObjectsList cameraId={cameraId} detectableObjects={detectableObjects} />
                        ) : (
                            <p className="px-3 text-gray-500">No detectable objects available yet...</p>
                        )
                    )}
                </div>
            </main>
        </>
    )
}
