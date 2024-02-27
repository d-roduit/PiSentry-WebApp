import Link from 'next/link';
import { FaAngleRight, FaRaspberryPi } from 'react-icons/fa6';
import { MdOutlineAddCircleOutline, MdOutlineAccountCircle, MdLogout } from 'react-icons/md';
import NavigationHeader from '@/components/NavigationHeader/NavigationHeader.jsx';

export const metadata = {
    title: 'Settings',
};

export default function SettingsPage() {
    return (
        <>
            <NavigationHeader
                centerContent={<h1 className="text-center">Settings</h1>}
                rightContent={<Link href="/">OK</Link>}
            />
            <main className="py-5">
                <div className="mt-6 first:mt-0">
                    <p className="px-3 pb-2 font-semibold text-indigo-600">Your cameras</p>
                    <div className="mx-3 bg-gray-100 ring-1 ring-inset ring-gray-900/5 rounded-md">
                        <Link
                            href="/settings/cameras"
                            className="flex justify-between items-center p-3 border-t first:border-t-0 first-of-type:rounded-t-md last-of-type:rounded-b-md md:transition md:hover:bg-gray-200 md:cursor-pointer"
                        >
                            <div className="flex items-center">
                                <FaRaspberryPi className="w-6 h-6"/>
                                <p className="ml-3 font-medium">Manage cameras</p>
                            </div>
                            <div>
                                <FaAngleRight className="text-gray-400"/>
                            </div>
                        </Link>
                        <Link
                            href=""
                            className="flex justify-between items-center p-3 border-t first:border-t-0 first-of-type:rounded-t-md last-of-type:rounded-b-md md:transition md:hover:bg-gray-200 md:cursor-pointer"
                        >
                            <div className="flex items-center">
                                <MdOutlineAddCircleOutline className="w-6 h-6"/>
                                <p className="ml-3 font-medium">Add new camera</p>
                            </div>
                            <div>
                                <FaAngleRight className="text-gray-400"/>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="mt-6 first:mt-0">
                    <p className="px-3 pb-2 font-semibold text-indigo-600">Your account</p>
                    <div className="mx-3 bg-gray-100 ring-1 ring-inset ring-gray-900/5 rounded-md">
                        <Link
                            href=""
                            className="flex justify-between items-center p-3 border-t first:border-t-0 first-of-type:rounded-t-md last-of-type:rounded-b-md md:transition md:hover:bg-gray-200 md:cursor-pointer"
                        >
                            <div className="flex items-center">
                                <MdOutlineAccountCircle className="w-6 h-6"/>
                                <p className="ml-3 font-medium">Manage account</p>
                            </div>
                            <div>
                                <FaAngleRight className="text-gray-400"/>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="mt-6 first:mt-0">
                    <p className="px-3 pb-2 font-semibold text-indigo-600">Login</p>
                    <div className="mx-3 bg-gray-100 ring-1 ring-inset ring-gray-900/5 rounded-md">
                        <Link
                            href=""
                            className="flex justify-between items-center p-3 text-red-600 border-t first:border-t-0 first-of-type:rounded-t-md last-of-type:rounded-b-md md:transition md:hover:bg-gray-200 md:cursor-pointer"
                        >
                            <div className="flex items-center">
                                <MdLogout className="w-6 h-6"/>
                                <p className="ml-3 font-medium">Logout</p>
                            </div>
                            <div>
                                <FaAngleRight className="text-red-600"/>
                            </div>
                        </Link>
                    </div>
                </div>
            </main>
        </>
    )
}
