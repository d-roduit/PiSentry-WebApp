import RecordingsList from '@/components/RecordingsList/RecordingsList.jsx';
import Link from 'next/link';
import Players from '@/components/Players/Players.jsx';
import CameraName from '@/components/CameraName/CameraName.jsx';
import { TbSettings } from 'react-icons/tb';
import NavigationHeader from '@/components/NavigationHeader/NavigationHeader.jsx';

export default function RecordingsPage() {
    return (
        <div className="flex flex-col h-screen">
            <section>
                <NavigationHeader
                    centerContent={
                        <div className="px-10 text-center">
                            <CameraName />
                        </div>
                    }
                    rightContent={
                        <Link href="/settings" className="text-2xl">
                            <TbSettings />
                        </Link>
                    }
                />
            </section>
            <section>
                <Players />
            </section>
            <section className="overflow-y-scroll">
                <RecordingsList />
            </section>
        </div>
    );
}
