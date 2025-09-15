import { useCallback, useEffect, useState } from "react";
import environment from "../environment";

type QueryParams = Record<string, string | number | boolean | null>;
type ResponseType = "json" | "text" | "blob";
type Input = {
    absolutePath: string,
    options?: RequestInit,
    immediate?: boolean,
    queryParams?: QueryParams,
    responseType?: ResponseType
}

export default function useFetch<T>({
    absolutePath,
    options = {},
    immediate = false,
    queryParams,
    responseType = "json"
} : Input) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(immediate);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () : Promise<T | null> => {
        setLoading(true);
        setError(null);

        try {
            const url = new URL(environment.BASE_URL + absolutePath);
            if (queryParams) {
                Object
                    .entries(queryParams)
                    .forEach(([key, value ]) => {
                        url.searchParams.append(key, String(value));
                    });
            }
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            let result: any;
            switch (responseType) {
                case "json":
                    result = await response.json();
                    break;
                case "text":
                    result = await response.text();
                    break;
                case "blob":
                    result = await response.blob();
                    break;
            }
            const data: T = result;
            setData(data);
            return data;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
        return null;
    }, [absolutePath, queryParams, options, responseType]);

    useEffect(() => {
        if (immediate) {
            fetchData()
        }
    }, [fetchData, immediate]);

    return { data, loading, error, fetchData };
}