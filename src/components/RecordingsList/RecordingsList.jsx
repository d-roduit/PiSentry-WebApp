import urls from '@/urls.js';
import FetchRequest from '@/helpers/FetchRequest.js';
import RecordingsListItem from '@/components/RecordingsListItem/RecordingsListItem.jsx';
import { FaCircleExclamation, FaVideo } from 'react-icons/fa6';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import isToday from 'dayjs/plugin/isToday';
import CircledIcon from '@/components/CircledIcon/CircledIcon.jsx';

dayjs.locale('fr');
dayjs.extend(isToday);

const { backendApiUrl } = urls;

const recordingsEndpoint = `${backendApiUrl}/v1/recordings`;

const fetchRecordingsByDate = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // TODO: JUST TO TEST SUSPENSE, NEED TO BE REMOVED AFTER
    return new FetchRequest(recordingsEndpoint)
        .options({
            method: 'GET',
            headers: { Authorization: 'mytoken' },
            next: { revalidate: 0 },
        })
        .make();
};

const renderDateTitle = (dayjsDate) => (
    <div className="sticky top-0 z-10 bg-white md:backdrop-blur-xl md:bg-white/50">
        <p className="font-medium py-3 border text-center">
            {dayjsDate.format('dddd DD MMMM').toUpperCase()}
        </p>
    </div>
);

const renderLiveItem = () => (
    <div className="group flex items-center h-20">
        <div className="w-24"></div>
        <div className="relative z-0 self-stretch flex items-center">
            <div className="absolute left-1/2 -translate-x-1/2 -z-10 h-1/2 bottom-0 border-r-2 border-r-gray-100 group-only:border-r-0" />
            <CircledIcon icon={FaVideo} iconColor="text-red-700" bgColor="bg-red-50" borderColor="border-red-100" />
        </div>
        <p className="ml-7 text-red-700 font-extrabold">Live</p>
    </div>
);

const renderRecordingsListItems = (detection_sessions) =>
    detection_sessions
        .sort((a, b) => b.detection_session_id - a.detection_session_id) // Sort in descending order
        .map(({ recorded_at, recordings }) =>
            recordings.map(recording => (
                <RecordingsListItem key={recording.recording_id} data={recording} />
            ))
    );

const recordingsContainTodaysDate = (recordingsByDate) => {
    const mostRecentRecordingsDate = recordingsByDate[0]?.recordings_date;
    return typeof mostRecentRecordingsDate === 'undefined' ? false : dayjs(mostRecentRecordingsDate).isToday();
};

const renderRecordingsList = (recordingsByDate) => {
    const containsTodaysDate = recordingsContainTodaysDate(recordingsByDate);
    const now = dayjs()

    return (
        <div>
            {!containsTodaysDate && (
                <div>
                    {renderDateTitle(now)}
                    <div>
                        {renderLiveItem()}
                    </div>
                </div>
            )}

            {recordingsByDate.map(({ recordings_date, detection_sessions }, mapIndex) => (
                <div key={recordings_date}>
                    {renderDateTitle(dayjs(recordings_date))}
                    <div>
                        {mapIndex === 0 && containsTodaysDate && renderLiveItem()}
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

export default async function RecordingsList() {
    const recordingsByDate = await fetchRecordingsByDate();

    return typeof recordingsByDate !== 'undefined' && Array.isArray(recordingsByDate)
        ? renderRecordingsList(recordingsByDate)
        : (
            <div>
                <p className="flex items-center text-gray-500">
                    <FaCircleExclamation className="inline-block mr-2" /> Error while recovering recordings
                </p>
            </div>
        )
}
