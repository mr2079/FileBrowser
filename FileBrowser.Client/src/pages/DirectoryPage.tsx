import DirectoryListComponent from "../components/DirectoryListComponent";
import { useEffect } from "react";
import environment from "../environment";
import type { DirectoryItem } from "../components/DirectoryListItemComponent";
import useDirectoryPath from "../hooks/useDirectoryPath";
import useFetch from "../hooks/useFetch";

type Directory = {
  name: string;
  path: string;
  previousDirectory: string;
  items: DirectoryItem[];
};

export default function DirectoryPage() {
  const { urlPath, directoryPath } = useDirectoryPath();
  const { data, fetchData } = useFetch<Directory>({
    absolutePath: environment.GET_DIRECTORY_PATH,
    queryParams: { "path": directoryPath }
  });
  const pathArray = directoryPath.substring(1).split("/");

  useEffect(() => {
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
