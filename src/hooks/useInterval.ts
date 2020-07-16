import { useEffect, useRef } from 'react';

function useInterval(callback: () => void, delay: number) {
	const savedCallback = useRef<(() => void) | null>(null);

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		function tick() {
			if (savedCallback.current) {
				savedCallback.current();
			}
		}
		if (delay !== null) {
			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
}

export default useInterval;
