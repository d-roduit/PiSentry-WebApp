import LoadingSpinner from '@/components/Loading/Spinner.jsx';
import { Suspense } from 'react';

export default function RootTemplate({ children }) {
    return (
        <Suspense fallback={<div className="h-screen w-full flex justify-center items-center"><LoadingSpinner /></div>}>
            {children}
        </Suspense>
    );
}
