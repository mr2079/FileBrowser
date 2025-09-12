import { Link } from "react-router";
import environment from "../environment";
import { useState } from "react";

export type DirectoryItem = {
  name: string;
  path: string;
  isDirectory: boolean;
};

type Props = {
  item: DirectoryItem;
};

export default function DirectoryListItemComponent({ item }: Props) {
  const [_, setError] = useState<string | null>(null);

  const downloadFile = async (item: DirectoryItem) => {
    if (item.isDirectory) return;
    const url = new URL(
        environment.BASE_URL + environment.GET_FILE_PATH
      );
      url.searchParams.append("path", item.path);
      url.searchParams.append("name", item.name);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const blob = await response.blob();
        const fileUrl = URL.createObjectURL(blob);

        const downloadLink = document.createElement("a");
        downloadLink.href = fileUrl;
        downloadLink.download = item.name;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        
        downloadLink.remove();
        URL.revokeObjectURL(fileUrl);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
  }
  
  return (
    <div className="file-item" title={item.name}>
      <div className="file-item-select-bg bg-primary"></div>
      <label className="file-item-checkbox custom-control custom-checkbox">
        <input type="checkbox" className="custom-control-input" />
        <span className="custom-control-label"></span>
      </label>
      {item.isDirectory ? (
        <div className="file-item-icon far fa-folder text-secondary"></div>
      ) : (
        <div className="file-item-icon far fa-file text-secondary"></div>
      )}
      {item.isDirectory ? (
        <Link className="file-item-name ellipsis px-3" to={item.path}>
          {item.name}
        </Link>
      ) : (
        <a
          className="file-item-name ellipsis px-3"
          onClick={() => downloadFile(item)}
        >
          {item.name}
        </a>
      )}
      <div className="file-item-changed">02/13/2018</div>
      <div className="file-item-actions btn-group">
        <button
          type="button"
          className="btn btn-default btn-sm rounded-pill icon-btn borderless md-btn-flat hide-arrow dropdown-toggle"
          data-toggle="dropdown"
        >
          <i className="ion ion-ios-more"></i>
        </button>
        <div className="dropdown-menu dropdown-menu-right">
          <a className="dropdown-item" href="javascript:void(0)">
            Rename
          </a>
          <a className="dropdown-item" href="javascript:void(0)">
            Move
          </a>
          <a className="dropdown-item" href="javascript:void(0)">
            Copy
          </a>
          <a className="dropdown-item" href="javascript:void(0)">
            Remove
          </a>
        </div>
      </div>
    </div>
  );
}
