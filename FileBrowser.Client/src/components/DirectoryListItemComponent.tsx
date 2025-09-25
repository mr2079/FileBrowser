import { Link } from "react-router";
import environment from "../environment";
import useCommandContext from "../hooks/useCommandContext";
import { useState, type ChangeEvent } from "react";
import axios from "axios";
import ModalComponent from "./ModalComponent";

export type DirectoryItem = {
  name: string;
  path: string;
  isDirectory: boolean;
};

type Props = {
  item: DirectoryItem;
};

export default function DirectoryListItemComponent({ item }: Props) {
  const { 
    commandMode,
    setCommandMode,
    selectedItems,
    setSelectedItems,
    rename,
    remove
  } = useCommandContext();

  const downloadFile = (item: DirectoryItem) => {
    if (item.isDirectory) return;
    axios
      .get<Blob | null>(environment.GET_FILE_PATH, {
        baseURL: environment.BASE_URL,
        params: {
          path: item.path,
          name: item.name,
        },
        responseType: "blob",
      })
      .then(({ status, data }) => {
        if (status != 200) return;
        if (data) {
          const fileUrl = URL.createObjectURL(data);

          const downloadLink = document.createElement("a");
          downloadLink.href = fileUrl;
          downloadLink.download = item.name;
          document.body.appendChild(downloadLink);
          downloadLink.click();

          downloadLink.remove();
          URL.revokeObjectURL(fileUrl);
        }
      });
  };

  const toggleCheckbox = (path: string): boolean => {
    return selectedItems?.includes(path) ?? false;
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.target;
    if (checked) {
      setSelectedItems((prev) => {
        const arr = [...(prev ?? []), value];
        setCommandMode("select");
        return arr;
      });
    } else {
      setSelectedItems((prev) => {
        let arr = prev?.filter((p) => p !== value);
        if (arr?.length == 0) {
          arr = undefined;
          setCommandMode(null);
        }
        return arr;
      });
    }
  };

  const [showRenameModal, setShowRenameModal] = useState<boolean>(false);
  const [oldPath, setOldPath] = useState<string | null>(null);
  const [newName, setNewName] = useState<string | null>(null);
  
  const onRenameModalClose = () => {
    setNewName(null);
    setOldPath(null);
    setShowRenameModal(false);
  }

  const onRenameModalSubmit = async () => {
    if (!oldPath || !newName) return;
    const isSuccess = await rename({
      path: oldPath,
      newName
    });
    if (isSuccess) {
      onRenameModalClose();
      location.reload();
    }
  }

  const handleRenameClick = (path: string) => {
    setOldPath(path);
    setShowRenameModal(true);
  }

  const handleFileCommand = (
    commandType: "move" | "copy",
    path: string
  ) => {
    setSelectedItems([path]);
    setCommandMode(commandType);
  }

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target
      .value
      .trimStart()
      .trimEnd();
    if (!value || value.length < 1) {
      setNewName(null);
    } else {
      setNewName(value);
    }
  }

  const [showRemoveModal, setShowRemoveModal] = useState<boolean>(false);
  const [removePath, setRemovePath] = useState<string | null>(null);

  const handleRemoveClick = (path: string) => {
    setRemovePath(path);
    setShowRemoveModal(true);
  }

  const onRemoveModalClose = () => {
    setRemovePath(null);
    setShowRemoveModal(false);
  }

  const onRemoveModalSubmit = async () => {
    if (!removePath) return;
    const isSuccess = await remove({
      paths: [removePath]
    });
    if (isSuccess) {
      onRemoveModalClose();
      location.reload();
    }
  }

  return (
    <>
      <div className="file-item" title={item.name}>
        {!item.isDirectory && (!commandMode || commandMode == "select") && (
          <>
            <div className="file-item-select-bg bg-primary"></div>
            <label className="file-item-checkbox custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                checked={toggleCheckbox(item.path)}
                value={item.path}
                onChange={handleCheckboxChange}
              />
              <span className="custom-control-label"></span>
            </label>
          </>
        )}
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
        {!commandMode && (
          <div className="file-item-actions btn-group">
            <button
              type="button"
              className="btn btn-default btn-sm rounded-pill icon-btn borderless md-btn-flat hide-arrow dropdown-toggle"
              data-toggle="dropdown"
            >
              <i className="ion ion-ios-more"></i>
            </button>
            <div className="dropdown-menu dropdown-menu-right">
              {!item.isDirectory && (
                <>
                  <a className="dropdown-item"
                    onClick={() => handleRenameClick(item.path)}>
                    Rename
                  </a>
                  <a className="dropdown-item"
                    onClick={() => handleFileCommand("move", item.path)}>
                    Move
                  </a>
                  <a className="dropdown-item"
                    onClick={() => handleFileCommand("copy", item.path)}>
                    Copy
                  </a>
                </>
              )}
              <a className="dropdown-item"
                onClick={() => handleRemoveClick(item.path)}>
                Remove
              </a>
            </div>
          </div>
        )}
      </div>
      <ModalComponent
        title="Enter new name"
        show={showRenameModal}
        onSubmit={onRenameModalSubmit}
        onClose={onRenameModalClose}>
        <input 
          className="form-control"
          placeholder="New name"
          onChange={handleNameChange}
          />
      </ModalComponent>
      <ModalComponent
        title="Are you sure?"
        show={showRemoveModal}
        onSubmit={onRemoveModalSubmit}
        onClose={onRemoveModalClose}>
        {""}
      </ModalComponent>
    </>
  );
}
