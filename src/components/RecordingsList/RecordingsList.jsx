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
import { groupBy as lodashGroupBy, map as lodashMap, orderBy as lodashOrderBy } from 'lodash-es';
import { useMemo } from 'react';

dayjs.locale('fr');
dayjs.extend(isToday);

const { recordingsApiEndpoint } = urls;

const renderDateTitle = (dayjsDate) => (
    <div className="sticky top-0 z-10 bg-white md:backdrop-blur-xl md:bg-white/50">
        <p className="font-medium py-3 border-y text-center">
            {dayjsDate.format('dddd DD MMMM').toUpperCase()}
        </p>
    </div>
);

export default function RecordingsList() {
    const { data, error, isLoading } = useSWR(
        recordingsApiEndpoint,
        () => new FetchRequest(recordingsApiEndpoint)
            .options({
                method: 'GET',
                headers: { Authorization: 'mytoken' },
                fetchRequest: { throwException: true },
            })
            .responseType(FetchRequest.ResponseType.Json)
            .make(),
        { refreshInterval: 10000 }
    );

    const recordingsFromDb = data?.data;

    let recordingsByDateFormattedSorted = useMemo(() => {
        const recordingsByDate = lodashGroupBy(
            recordingsFromDb,
            (obj) => dayjs(obj.recorded_at).format('YYYY-MM-DD')
        );
        const recordingsByDateFormatted = lodashMap(
            recordingsByDate,
            (value, key) => ({ recordings_date: key, recordings: value })
        );
        return lodashOrderBy(recordingsByDateFormatted, ['recordings_date'], ['desc']);
    }, [recordingsFromDb]);

    const selectedRecording = useSelector(selectSelectedRecording);

    const isLiveSelected = selectedRecording === null;

    const renderRecordingsListItems = (recordings) =>
        recordings.map(recording => (
            <RecordingsListItem
                key={recording.recording_id}
                data={recording}
                isSelected={selectedRecording?.recording_id === recording.recording_id}
            />
        ));

    const recordingsContainTodaysDate = () => {
        const mostRecentRecordingsDate = recordingsByDateFormattedSorted[0]?.recordings_date;
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

                {recordingsByDateFormattedSorted.map(({ recordings_date, recordings }, mapIndex) => (
                    <div key={recordings_date}>
                        {renderDateTitle(dayjs(recordings_date))}
                        <div>
                            {mapIndex === 0 && containsTodaysDate && <LiveItem isSelected={isLiveSelected} />}
                            {renderRecordingsListItems(recordings)}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    if (error) return (
        <div className="mt-10">
            <div className="flex flex-col items-center text-gray-500">
                <FaCircleExclamation className="text-xl shrink-0" />
                <p className="mt-2">Error while recovering recordings</p>
            </div>
        </div>
    );

    if (isLoading) return <RecordingsListPlaceholder />

    return renderRecordingsList();
}
