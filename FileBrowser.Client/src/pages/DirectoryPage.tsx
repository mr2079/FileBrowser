import { useParams } from "react-router";
import DirectoryListComponent from "../components/DirectoryListComponent";
import { useEffect, useState } from "react";
import environment from "../environment";
import type { DirectoryItem } from "../components/DirectoryListItemComponent";

type Directory = {
  name: string;
  path: string;
  previousDirectory: string;
  items: DirectoryItem[];
};

export default function DirectoryPage() {
  const { "*": urlPath } = useParams();
  const path = urlPath ? `/${decodeURIComponent(urlPath)}` : "/";
  const pathArray = path.substring(1).split("/");

  const [data, setData] = useState<Directory | null>(null);
  const [_, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const url = new URL(
        environment.BASE_URL + environment.GET_DIRECTORY_PATH
      );
      url.searchParams.append("path", path);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const directory: Directory = await response.json();
        setData(directory);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    fetchData();
  }, [urlPath]);

  return (
    <>
      <div className="container-m-nx container-m-ny bg-lightest mb-3">
        <ol className="breadcrumb text-big container-p-x py-3 m-0">
          {pathArray.map((p, index) => {
            const isActive = pathArray.length == index + 1;
            return isActive ? (
              <li key={index} className="breadcrumb-item active">
                {p.length > 0 ? p : "root"}
              </li>
            ) : (
              <li key={index} className="breadcrumb-item">
                <a href="javascript:void(0)">{p}</a>
              </li>
            );
          })}
        </ol>

        <hr className="mt-2" />
      </div>

      {data ? (
        <DirectoryListComponent
          previousDirectory={data.previousDirectory}
          items={data.items}
        />
      ) : (
        <></>
      )}
    </>
  );
}
