import './styles.scss';
import { Suspense } from 'react';
import RecordingsList from '@/components/RecordingsList/RecordingsList.jsx';
import LoadingSpinner from '@/components/Loading/Spinner.jsx';
import Link from 'next/link.js';
import RecordingsListPlaceholder from '@/components/RecordingsListPlaceholder/RecordingsListPlaceholder.jsx';
import VideoPlaceholder from '@/components/VideoPlaceholder.jsx';

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
                <nav className="my-5 ml-2">
                    <Link href="/" className="bg-white hover:bg-gray-100 text-gray-800 py-2 px-4 border border-gray-400 rounded shadow">Home</Link>
                    <Link href="/recordings" className="bg-white hover:bg-gray-100 text-gray-800 py-2 px-4 border border-gray-400 rounded shadow ml-3">Recordings</Link>
                </nav>
            </section>
            <h1 className="text-2xl mb-3">Recordings page</h1>
            <section className="overflow-scroll">
                <Suspense fallback={<RecordingsListPlaceholder />}>
                    <RecordingsList />
                </Suspense>
            </section>
        </div>
    );
}
