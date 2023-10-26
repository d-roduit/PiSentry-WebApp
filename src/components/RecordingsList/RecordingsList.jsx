'use client';

import urls from '@/urls.js';
import FetchRequest from '@/helpers/FetchRequest.js';
import RecordingsListItem from '@/components/RecordingsListItem/RecordingsListItem.jsx';
import { FaCircleExclamation } from 'react-icons/fa6';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import isToday from 'dayjs/plugin/isToday';
import RecordingsListPlaceholder from '@/components/RecordingsListPlaceholder/RecordingsListPlaceholder.jsx';
import useSWR from 'swr';
import { useSelector, selectSelectedRecording } from '@/lib/redux';
import LiveItem from '@/components/LiveItem/LiveItem.jsx';

dayjs.locale('fr');
dayjs.extend(isToday);

const { backendApiUrl } = urls;
const recordingsEndpoint = `${backendApiUrl}/v1/recordings`;

const renderDateTitle = (dayjsDate) => (
    <div className="sticky top-0 z-10 bg-white md:backdrop-blur-xl md:bg-white/50">
        <p className="font-medium py-3 border text-center">
            {dayjsDate.format('dddd DD MMMM').toUpperCase()}
        </p>
    </div>
);

export default function RecordingsList() {
    const { data, error, isLoading } = useSWR(
        recordingsEndpoint,
        () => new FetchRequest(recordingsEndpoint).options({
            method: 'GET',
            headers: { Authorization: 'mytoken' },
        }).responseType(FetchRequest.ResponseType.Json).make()
    );

    const recordingsByDate = data?.responseData;

    const selectedRecording = useSelector(selectSelectedRecording);

    const isLiveSelected = selectedRecording === null;

    const renderRecordingsListItems = (detection_sessions) =>
        detection_sessions
            .sort((a, b) => b.detection_session_id - a.detection_session_id) // Sort in descending order
            .map(({ recorded_at, recordings }) =>
                recordings.map(recording => (
                    <RecordingsListItem key={recording.recording_id} data={recording} isSelected={selectedRecording?.recording_id === recording.recording_id}/>
                ))
            );

    const recordingsContainTodaysDate = () => {
        const mostRecentRecordingsDate = recordingsByDate[0]?.recordings_date;
        return typeof mostRecentRecordingsDate === 'undefined' ? false : dayjs(mostRecentRecordingsDate).isToday();
    };

    const renderRecordingsList = () => {
        const containsTodaysDate = recordingsContainTodaysDate();
        const now = dayjs()

        return (
            <div>
                {!containsTodaysDate && (
                    <div>
                        {renderDateTitle(now)}
                        <div>
                            <LiveItem isSelected={isLiveSelected} />
                        </div>
                    </div>
                )}

                {recordingsByDate.map(({ recordings_date, detection_sessions }, mapIndex) => (
                    <div key={recordings_date}>
                        {renderDateTitle(dayjs(recordings_date))}
                        <div>
                            {mapIndex === 0 && containsTodaysDate && <LiveItem isSelected={isLiveSelected} />}
                            {renderRecordingsListItems(detection_sessions)}
                        </div>
                    </div>
                ))}

                {/*{recordingsByDate.map(result =>*/}
                {/*    <>*/}
                {/*        <p key={result.recordings_date}>{JSON.stringify(result)}</p>*/}
                {/*        <br/>*/}
                {/*    </>*/}
                {/*)}*/}
            </div>
        );
    };

    if (error) return (
        <div>
            <p className="flex items-center text-gray-500">
                <FaCircleExclamation className="inline-block mr-2" /> Error while recovering recordings
            </p>
        </div>
    );

    if (isLoading) return <RecordingsListPlaceholder />

    return renderRecordingsList();
}
