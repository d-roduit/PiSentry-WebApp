import Link from 'next/link';
import { FaAngleLeft } from 'react-icons/fa6';
import NavigationHeader from '@/components/NavigationHeader/NavigationHeader.jsx';
import NotificationsTimeRangeSetting
    from '@/components/NotificationsTimeRangeSetting/NotificationsTimeRangeSetting.jsx';
import NotificationsSwitchSetting from '@/components/NotificationsSwitchSetting/NotificationsSwitchSetting.jsx';
import { notFound } from 'next/navigation';
import { isStringPositiveInteger } from '@/helpers/validation.js';

export const metadata = {
    title: 'Notifications',
};

export default function NotificationsPage({ params }) {
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
                centerContent={<h1 className="text-center">Notifications</h1>}
            />
            <main className="py-5">
                <div className="px-3">
                    <NotificationsSwitchSetting cameraId={cameraId} />
                </div>
                <div className="mt-6">
                    <p className="px-3 pb-2 font-medium text-indigo-600">Receive notifications...</p>
                    <div>
                        <NotificationsTimeRangeSetting cameraId={cameraId} />
                    </div>
                </div>
            </main>
        </>
    )
}
