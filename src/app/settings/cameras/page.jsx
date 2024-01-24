import Link from 'next/link';
import { FaAngleLeft } from 'react-icons/fa6';
import NavigationHeader from '@/components/NavigationHeader/NavigationHeader.jsx';
import CamerasSettingsList from '@/components/CamerasSettingsList/CamerasSettingsList.jsx';

export const metadata = {
    title: 'Manage cameras',
};

export default function CamerasSettingsPage() {
    return (
        <>
            <NavigationHeader
                leftContent={
                    <Link href="/settings">
                        <FaAngleLeft className="text-xl" />
                    </Link>
                }
                centerContent={<h1 className="text-center">Manage cameras</h1>}
            />
            <CamerasSettingsList />
        </>
    )
}
