import Link from 'next/link';

export const metadata = {
    title: 'Camera settings',
};

export default function CameraSettingsPage() {
    return (
        <>
            <header className="flex justify-between items-center mx-5 h-12 font-bold text-gray-900 md:text-lg">
                <nav className="w-2/12 flex justify-start items-center" />
                <h1 className="w-8/12 text-center">Camera settings</h1>
                <nav className="w-2/12 flex justify-end items-center">
                    <Link href="/">OK</Link>
                </nav>
            </header>
            <main>
            </main>
        </>
    )
}
