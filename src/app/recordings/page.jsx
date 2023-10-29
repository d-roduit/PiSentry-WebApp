import RecordingsList from '@/components/RecordingsList/RecordingsList.jsx';
import Link from 'next/link';
import Players from '@/components/Players/Players.jsx';
import CameraName from '@/components/CameraName/CameraName.jsx';
import { FaGear, FaVideo } from 'react-icons/fa6';

export const metadata = {
    title: 'Recordings',
};

export default async function RecordingsPage() {

    const addRecordingToPage = (recordingFilename, index) => {
        // Create fake design
        const fakeVideoPlaceholder = (
            <div
                id={`fake-video-placeholder-${index}`}
                className="ph-item ph-picture fake-video-placeholder"
            />
        );

        // Create video element
        const videoElement = <video
            src={`${recordingsEndpoint}/${recordingFilename}?access_token=mytoken`}
            controls={true}
            onLoadedData={() => {
                // this.style.display = 'block';
                // fakeVideoPlaceholder.style.display = 'none';
            }}
            onError={() => {
                fakeVideoPlaceholder.textContent = 'Loading error';
            }}
        />

        // Append elements to DOM
        // document.body.append(videoElement, fakeVideoPlaceholder);
    };

    return (
        <div className="flex flex-col h-full">
            <section>
                <nav className="flex justify-between items-center mx-5 h-12">
                    <Link href="/" className="text-xl text-gray-800">
                        <FaGear />
                    </Link>
                    <CameraName />
                    <Link href="/recordings" className="text-xl text-gray-800">
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
