import { useRef, useEffect, useState } from 'react';

export function useFetchRequest(fetchRequest, dependencies = []) {
    const [isLoading, setIsLoading] = useState(true);
    const [fetchRequestOutput, setFetchRequestOutput] = useState({});

    useEffect(() => {
        let isComponentMounted = true;

        const fetchData = async ()=> {
            const fetchRequestOutput = await fetchRequest.make();
            if (isComponentMounted) {
                setFetchRequestOutput(fetchRequestOutput);
                setIsLoading(false);
            }
        }
        fetchData();

        return () => {
            isComponentMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);

    return { isLoading, ...fetchRequestOutput };
}

export function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}
