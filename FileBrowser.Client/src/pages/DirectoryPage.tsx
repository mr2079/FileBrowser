import DirectoryListComponent from "../components/DirectoryListComponent";
import { useEffect, useState } from "react";
import environment from "../environment";
import type { DirectoryItem } from "../components/DirectoryListItemComponent";
import useDirectoryPath from "../hooks/useDirectoryPath";
import axios from "axios";

type Directory = {
  name: string;
  path: string;
  previousDirectory: string;
  items: DirectoryItem[];
};

export default function DirectoryPage() {
  const { urlPath, directoryPath } = useDirectoryPath();
  const [directoryInfo, setDirectoryInfo] = useState<Directory | null>(null);
  const pathArray = directoryPath.substring(1).split("/");

  useEffect(() => {
    const fetchData = () => {
      axios.get<Directory | null>( environment.GET_DIRECTORY_PATH, {
        baseURL: environment.BASE_URL,
        params: {
          path: directoryPath
        }
      }).then(({ status, data }) => {
        if (status != 200) return;
        setDirectoryInfo(data);
      });
    }
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
                <a href="#">{p}</a>
              </li>
            );
          })}
        </ol>

        <hr className="mt-2" />
      </div>

      {directoryInfo && (
        <DirectoryListComponent
          previousDirectory={directoryInfo.previousDirectory}
          items={directoryInfo.items}
        />
      )}
    </>
  );
}
