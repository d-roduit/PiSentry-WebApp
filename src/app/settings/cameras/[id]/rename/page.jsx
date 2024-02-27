import Link from 'next/link';
import { FaAngleLeft } from 'react-icons/fa6';
import NavigationHeader from '@/components/NavigationHeader/NavigationHeader.jsx';
import RenameCameraSetting from '@/components/RenameCameraSetting/RenameCameraSetting.jsx';
import { notFound } from 'next/navigation';
import { isStringPositiveInteger } from '@/helpers/validation.js';

export const metadata = {
    title: 'Rename camera',
};

export default function RenameCameraPage({ params }) {
    const isCameraIdAcceptable = isStringPositiveInteger(params.id);

    if (!isCameraIdAcceptable) {
        notFound();
    }

    const cameraId = parseInt(params.id);

    return (
        <>
            <NavigationHeader
                leftContent={
                    <Link href="/settings/cameras">
                        <FaAngleLeft className="text-xl" />
                    </Link>
                }
                centerContent={<h1 className="text-center">Rename</h1>}
            />
            <RenameCameraSetting cameraId={cameraId} />
        </>
    )
}
