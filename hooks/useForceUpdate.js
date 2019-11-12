import { useState, useCallback } from 'react';

function useForceUpdate() {
    const [, setTick] = useState(0);
    return useCallback(() => {
        setTick(tick => tick + 1);
    }, []);
}

export default useForceUpdate;