import { useParams } from "react-router";

export default function useDirectoryPath() {
    const { "*": urlPath } = useParams();
    const directoryPath = urlPath ? `/${decodeURIComponent(urlPath)}` : "/";
    return { urlPath, directoryPath };
}