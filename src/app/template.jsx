import LoadingSpinner from '@/components/Loading/Spinner.jsx';
import { Suspense } from 'react';

export default function RootTemplate({ children }) {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            {children}
        </Suspense>
    );
}
