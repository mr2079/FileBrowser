import { useCallback, useEffect, useState } from "react";
import environment from "../environment";

type QueryParams = Record<string, string | number | boolean | null>;
type ResponseType = "json" | "text" | "blob";
type UseFetchInput = {
    absolutePath?: string,
    options?: RequestInit,
    immediate?: boolean,
    queryParams?: QueryParams,
    responseType?: ResponseType
}
type UseFetchOutput<TResponse> = {
    data: TResponse | null,
    loading: boolean,
    error: string | null,
    fetchData: (
        requestPath: string | undefined,
        requestOptions: RequestInit | undefined) => Promise<TResponse | null>
}

export default function useFetch<TResponse>({
    absolutePath,
    options = {},
    immediate = false,
    queryParams,
    responseType = "json"
} : UseFetchInput) : UseFetchOutput<TResponse> {
    const [data, setData] = useState<TResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(immediate);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (
            requestPath: string | undefined = undefined,
            requestOptions: RequestInit | undefined = undefined) : Promise<TResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            if (!absolutePath && !requestPath) {
                throw new Error("Request path not set!");
            }
            const path = requestPath! || absolutePath!;
            const url = new URL(environment.BASE_URL + path);
            if (queryParams) {
                Object
                    .entries(queryParams)
                    .forEach(([key, value ]) => {
                        url.searchParams.append(key, String(value));
                    });
            }
            let response: Response;
            if (requestOptions) {
                response = await fetch(url, requestOptions);
            } else {
                response = await fetch(url, options);
            }
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
            const data: TResponse = result;
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