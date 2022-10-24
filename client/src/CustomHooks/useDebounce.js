import { useEffect, useState } from "react";

function useDebounce(value, delay) {
    const [newValue, setNewValue] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => {
            setNewValue(value);
        }, delay);
        return () => {
            clearTimeout(id);
        };
    }, [value]);
    return newValue;
}

export default useDebounce;
