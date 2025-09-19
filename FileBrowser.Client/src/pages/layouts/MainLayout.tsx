import { Outlet, useNavigate } from "react-router";
import useCommandContext from "../../hooks/useCommandContext";
import { formatString } from "../../utilities/StringUtils";
import environment from "../../environment";
import axios from "axios";

type FileCommandRequest = {
  to: string,
  items: string[]
}

export default function MainLayout() {
  const navigate = useNavigate();
  const { 
    commandMode,
    setCommandMode,
    selectedItems,
    setSelectedItems
  } = useCommandContext();

  const handleClear = () => {
    setCommandMode(null);
    setSelectedItems(undefined);
  }

  const handleCommand = async () => {
    const commandType = commandMode!.toString();
    console.log(commandType);
    const requestPath = formatString(environment.FILE_COMMAND_PATH, commandType);
    console.log(requestPath);
    const body: FileCommandRequest = {
      to: "",
      items: [

      ]
    };
    axios.post(requestPath, body, {
      baseURL: environment.BASE_URL
    }).then(({ status, data }) => {
      if (status != 200) return;
    });
  }

  return (
    <div className="container flex-grow-1 light-style container-p-y">
      <div className="container-m-nx container-m-ny bg-lightest mb-3">
        <div className="file-manager-actions container-p-x py-2">
          <div>
            <button type="button" className="btn btn-primary mr-2" disabled>
              <i className="ion ion-md-cloud-upload"></i>&nbsp; Upload
            </button>
            <button type="button" className="btn btn-secondary icon-btn mr-2" disabled>
              <i className="ion ion-md-cloud-download"></i>
            </button>
            {(!commandMode ||commandMode === "select") && (
              <div className="btn-group mr-2">
                <button
                  type="button"
                  className="btn btn-default md-btn-flat dropdown-toggle px-2"
                  data-toggle="dropdown"
                >
                  <i className="ion ion-ios-settings"></i>
                </button>
                <div className="dropdown-menu">
                  <a
                    className="dropdown-item cursor-pointer"
                    onClick={() => setCommandMode("move")}
                  >
                    Move
                  </a>
                  <a
                    className="dropdown-item cursor-pointer"
                    onClick={() => setCommandMode("copy")}
                  >
                    Copy
                  </a>
                  <a className="dropdown-item cursor-pointer">Remove</a>
                </div>
              </div>
            )}
            {(selectedItems?.length ?? 0) > 0 && (
              <div className="btn btn-outline-danger mr-2" onClick={handleClear}>
                {selectedItems!.length} item(s) selected
              </div>
            )}
            {selectedItems &&
              (commandMode === "move" || commandMode === "copy") && (
                <>
                  <button type="button" className="btn btn-success mr-2">
                    {commandMode === "move" ? "Move" : "Copy"} here
                  </button>
                  <button type="button" className="btn btn-danger mr-2"
                    onClick={() => setCommandMode(null)}>
                    Cancel
                  </button>
                </>
              )}
          </div>
          <div>
            <div className="btn-group btn-group-toggle" data-toggle="buttons">
              <label className="btn btn-default icon-btn md-btn-flat active">
                {" "}
                <input
                  disabled
                  type="radio"
                  name="file-manager-view"
                  value="file-manager-col-view"
                />{" "}
                <span className="ion ion-md-apps"></span>{" "}
              </label>
              <label className="btn btn-default icon-btn md-btn-flat">
                {" "}
                <input
                  disabled
                  type="radio"
                  name="file-manager-view"
                  value="file-manager-row-view"
                />{" "}
                <span className="ion ion-md-menu"></span>{" "}
              </label>
            </div>
          </div>
        </div>

        <hr className="m-0" />
      </div>
      {<Outlet />}
    </div>
  );
}
