'use client';

import urls from '@/urls.js';
import FetchRequest from '@/helpers/FetchRequest.js';
import { FaAngleRight, FaCircleExclamation, FaRaspberryPi, FaRegBell } from 'react-icons/fa6';
import useSWR from 'swr';
import Link from 'next/link';
import { MdOutlineDeleteOutline, MdOutlineEdit, MdOutlineRotateLeft } from 'react-icons/md';
import { LuShapes } from 'react-icons/lu';
import { RiShapeLine } from 'react-icons/ri';

const { camerasApiEndpoint } = urls;

const renderCameraName = (name) => (
    <div className="flex items-center px-3 pb-2 text-indigo-600">
        <FaRaspberryPi className="w-6 h-6"/>
        <p className="ml-2 font-semibold">{name}</p>
    </div>
);

const renderCameraSettings = (camera_id) => (
    <div className="mx-3 bg-gray-100 rounded-md ring-1 ring-inset ring-gray-900/5">
        <Link
            href={`/settings/cameras/${camera_id}/rename`}
            className="flex justify-between items-center p-3 border-t first:border-t-0 first-of-type:rounded-t-md last-of-type:rounded-b-md md:transition md:hover:bg-gray-200 md:cursor-pointer"
        >
            <div className="flex items-center">
                <MdOutlineEdit className="w-6 h-6"/>
                <p className="ml-3 font-medium">Rename</p>
            </div>
            <div>
                <FaAngleRight className="text-gray-400"/>
            </div>
        </Link>
        <Link
            href={`/settings/cameras/${camera_id}/notifications`}
            className="flex justify-between items-center p-3 border-t first:border-t-0 first-of-type:rounded-t-md last-of-type:rounded-b-md md:transition md:hover:bg-gray-200 md:cursor-pointer"
        >
            <div className="flex items-center">
                <FaRegBell className="w-6 h-6"/>
                <p className="ml-3 font-medium">Notifications</p>
            </div>
            <div>
                <FaAngleRight className="text-gray-400"/>
            </div>
        </Link>
        <Link
            href={`/settings/cameras/${camera_id}/object-detection`}
            className="flex justify-between items-center p-3 border-t first:border-t-0 first-of-type:rounded-t-md last-of-type:rounded-b-md md:transition md:hover:bg-gray-200 md:cursor-pointer"
        >
            <div className="flex items-center">
                <LuShapes className="w-6 h-6"/>
                <p className="ml-3 font-medium">Object detection</p>
            </div>
            <div>
                <FaAngleRight className="text-gray-400"/>
            </div>
        </Link>
        <Link
            href=""
            onClick={(e) => e.preventDefault()}
            className="w-full flex justify-between items-center p-3 border-t first:border-t-0 first-of-type:rounded-t-md last-of-type:rounded-b-md md:transition md:hover:bg-gray-200 md:cursor-pointer"
        >
            <div className="flex items-center">
                <RiShapeLine className="w-6 h-6"/>
                <p className="ml-3 font-medium">Alert areas</p>
            </div>
            <div>
                <FaAngleRight className="text-gray-400"/>
            </div>
        </Link>
        <Link
            href=""
            onClick={(e) => e.preventDefault()}
            className="w-full flex justify-between items-center p-3 text-blue-600 border-t first:border-t-0 first-of-type:rounded-t-md last-of-type:rounded-b-md md:transition md:hover:bg-gray-200 md:cursor-pointer"
        >
            <div className="flex items-center">
                <MdOutlineRotateLeft className="w-6 h-6"/>
                <p className="ml-3 font-medium">Reboot</p>
            </div>
            <div>
                <FaAngleRight className="text-blue-600"/>
            </div>
        </Link>
        <Link
            href=""
            onClick={(e) => e.preventDefault()}
            className="w-full flex justify-between items-center p-3 text-red-600 border-t first:border-t-0 first-of-type:rounded-t-md last-of-type:rounded-b-md md:transition md:hover:bg-gray-200 md:cursor-pointer"
        >
            <div className="flex items-center">
                <MdOutlineDeleteOutline className="w-6 h-6"/>
                <p className="ml-3 font-medium">Delete</p>
            </div>
            <div>
                <FaAngleRight className="text-red-600"/>
            </div>
        </Link>
    </div>
);

const renderCameraNamePlaceholder = () => (
    <div className="ml-3 mb-2 flex items-center">
        <div className="w-6 h-6 bg-indigo-600/50 rounded-md" />
        <div className="ml-2 w-20 h-4 bg-indigo-600/50 rounded-md" />
    </div>
);

const renderCameraSettingsPlaceholder = () => (
    <div className="mx-3 bg-gray-100 rounded-md ring-1 ring-inset ring-gray-900/5">
        <div className="flex justify-between items-center p-3 border-t first:border-t-0">
            <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-300 rounded-md" />
                <div className="ml-3 bg-gray-300 h-4 w-16 rounded-md" />
            </div>
            <div>
                <FaAngleRight className="text-gray-300"/>
            </div>
        </div>
        <div className="flex justify-between items-center p-3 border-t first:border-t-0">
            <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-300 rounded-md" />
                <div className="ml-3 bg-gray-300 h-4 w-24 rounded-md" />
            </div>
            <div>
                <FaAngleRight className="text-gray-300"/>
            </div>
        </div>
        <div className="flex justify-between items-center p-3 border-t first:border-t-0">
            <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-300 rounded-md" />
                <div className="ml-3 bg-gray-300 h-4 w-32 rounded-md" />
            </div>
            <div>
                <FaAngleRight className="text-gray-300"/>
            </div>
        </div>
        <div className="w-full flex justify-between items-center p-3 border-t first:border-t-0">
            <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-300 rounded-md" />
                <div className="ml-3 bg-gray-300 h-4 w-20 rounded-md" />
            </div>
            <div>
                <FaAngleRight className="text-gray-300"/>
            </div>
        </div>
        <div className="w-full flex justify-between items-center p-3 border-t first:border-t-0">
            <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-300 rounded-md" />
                <div className="ml-3 bg-gray-300 h-4 w-16 rounded-md" />
            </div>
            <div>
                <FaAngleRight className="text-gray-300"/>
            </div>
        </div>
        <div className="w-full flex justify-between items-center p-3 border-t first:border-t-0">
            <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-300 rounded-md" />
                <div className="ml-3 bg-gray-300 h-4 w-14 rounded-md" />
            </div>
            <div>
                <FaAngleRight className="text-gray-300"/>
            </div>
        </div>
    </div>
);

export default function CamerasSettingsList() {
    const { data, error, isLoading } = useSWR(
        camerasApiEndpoint,
        () => new FetchRequest(camerasApiEndpoint)
            .options({
                method: 'GET',
                headers: { Authorization: 'mytoken' },
                next: { revalidate: 0 },
                fetchRequest: { throwException: true },
            })
            .responseType(FetchRequest.ResponseType.Json)
            .make()
    );

    if (error) return (
        <main className="px-3 mt-10">
            <p className="flex flex-col items-center text-gray-500">
                <FaCircleExclamation className="text-xl shrink-0" />
                <p className="mt-2">Error while recovering cameras</p>
            </p>
        </main>
    );

    if (isLoading) return (
        <main className="py-5">
            {new Array(2).fill(null).map((item, index) => (
                <div key={index} className="mt-6 first:mt-0">
                    {renderCameraNamePlaceholder()}
                    {renderCameraSettingsPlaceholder()}
                </div>
            ))}
        </main>
    );

    const { data: cameras } = data;

    if (cameras.length === 0) return (
        <main className="px-3 py-5">
            <p className="flex items-center text-gray-500">
                <FaRaspberryPi className="inline-block mr-2"/> No camera yet
            </p>
        </main>
    );

    return (
        <main className="py-5">
            {cameras.map(camera => (
                <div key={camera.camera_id} className="mt-8 first:mt-0">
                    {renderCameraName(camera.name)}
                    {renderCameraSettings(camera.camera_id)}
                </div>
            ))}
        </main>
    );
}
