import RecordingsList from '@/components/RecordingsList/RecordingsList.jsx';
import Link from 'next/link';
import Players from '@/components/Players/Players.jsx';
import CameraName from '@/components/CameraName/CameraName.jsx';

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
                <nav className="my-2 flex justify-between items-center">
                    <Link href="/" className="bg-white hover:bg-gray-100 text-gray-800 py-1 px-4 border border-gray-400 rounded shadow">Home</Link>
                    <CameraName />
                    <Link href="/recordings" className="bg-white hover:bg-gray-100 text-gray-800 py-1 px-4 border border-gray-400 rounded shadow ml-3">Recordings</Link>
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
