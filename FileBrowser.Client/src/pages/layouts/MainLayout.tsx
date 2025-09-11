import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="container flex-grow-1 light-style container-p-y">
      <div className="container-m-nx container-m-ny bg-lightest mb-3">
        <div className="file-manager-actions container-p-x py-2">
          <div>
            <button type="button" className="btn btn-primary mr-2">
              <i className="ion ion-md-cloud-upload"></i>&nbsp; Upload
            </button>
            <button type="button" className="btn btn-secondary icon-btn mr-2">
              <i className="ion ion-md-cloud-download"></i>
            </button>
            <div className="btn-group mr-2">
              <button
                type="button"
                className="btn btn-default md-btn-flat dropdown-toggle px-2"
                data-toggle="dropdown"
              >
                <i className="ion ion-ios-settings"></i>
              </button>
              <div className="dropdown-menu">
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
          <div>
            <div className="btn-group btn-group-toggle" data-toggle="buttons">
              <label className="btn btn-default icon-btn md-btn-flat active">
                {" "}
                <input
                  type="radio"
                  name="file-manager-view"
                  value="file-manager-col-view"
                />{" "}
                <span className="ion ion-md-apps"></span>{" "}
              </label>
              <label className="btn btn-default icon-btn md-btn-flat">
                {" "}
                <input
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
