import { useRef, useCallback, useEffect } from "react"
export function useThrottle(fn: (...args: any[]) => void, delay: number) {
	const fnRef = useRef(fn);
	useEffect(() => {
		fnRef.current = fn;
	}, [fn]);

	const last = useRef(0);
	return useCallback((...args: any[]) => {
		const now = Date.now();
		if (now - last.current < delay) return;
		last.current = now;
		fnRef.current(...args);
	}, [delay]);
}

