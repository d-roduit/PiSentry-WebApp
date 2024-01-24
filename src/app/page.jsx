import RecordingsList from '@/components/RecordingsList/RecordingsList.jsx';
import Link from 'next/link';
import Players from '@/components/Players/Players.jsx';
import CameraName from '@/components/CameraName/CameraName.jsx';
import { FaGear, FaVideo } from 'react-icons/fa6';

export default function RecordingsPage() {
    return (
        <div className="flex flex-col h-screen">
            <section>
                <nav className="flex justify-between items-center mx-5 h-12">
                    <Link href="/" className="text-xl md:text-2xl text-gray-900">
                        <FaGear />
                    </Link>
                    <CameraName />
                    <Link href="/camera-settings" className="text-xl md:text-2xl text-gray-900">
                        <FaVideo />
                    </Link>
                </nav>
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
