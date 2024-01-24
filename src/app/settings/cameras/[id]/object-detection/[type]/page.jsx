import Link from 'next/link';
import { FaAngleLeft } from 'react-icons/fa6';
import NavigationHeader from '@/components/NavigationHeader/NavigationHeader.jsx';
import { isStringPositiveInteger } from '@/helpers/validation.js';
import { notFound } from 'next/navigation';
import ObjectDetectionActionsList from '@/components/ObjectDetectionActionsList/ObjectDetectionActionsList.jsx';

export const metadata = {
    title: 'Object detection action',
};

export default async function ObjectDetectionActionPage({ params }) {
    const isCameraIdAcceptable = isStringPositiveInteger(params.id);
    const isObjectTypeAcceptable = params.type.length > 0;

    if (!isCameraIdAcceptable || !isObjectTypeAcceptable) {
        notFound();
    }

    const cameraId = parseInt(params.id);
    const objectType = params.type;

    return (
        <>
            <NavigationHeader
                leftContent={
                    <Link href={`/settings/cameras/${cameraId}/object-detection`}>
                        <FaAngleLeft className="text-xl" />
                    </Link>
                }
                centerContent={<h1 className="text-center">Object detection</h1>}
            />
            <main className="py-5">
                <div className="mt-6">
                    <ObjectDetectionActionsList cameraId={cameraId} objectType={objectType} />
                </div>
            </main>
        </>
    )
}
