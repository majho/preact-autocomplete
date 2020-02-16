import { useEffect, useLayoutEffect, useState, useRef } from 'preact/hooks';

let nid = 0;
const genId = () => (nid += 1); // eslint-disable-line no-return-assign

export function useId() {
    const [id, setId] = useState(genId());

    useLayoutEffect(() => {
        if (id === null) setId(genId());
    }, []);

    return id;
}

export function useUpdateEffect(effect, deps) {
    const mounted = useRef(false);

    useEffect(() => {
        if (mounted.current) {
            effect();
        } else {
            mounted.current = true;
        }
    }, deps);
}
