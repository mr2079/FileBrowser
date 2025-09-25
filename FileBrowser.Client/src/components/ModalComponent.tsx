import { useEffect, type ReactNode } from "react";

type ModalProps = {
  title: string;
  show: boolean;
  onSubmit: () => void;
  onClose: () => void;
  children: ReactNode;
  hasFooter?: boolean;
};

export default function ModalComponent({
  show,
  onSubmit,
  onClose,
  title,
  children,
  hasFooter = true,
}: ModalProps) {
  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "Enter") {
        onSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {show && (
        <>
          <div className="modal-backdrop fade show" onClick={onClose}></div>

          <div className="modal fade show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{title}</h5>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={onClose}
                  >
                    <i className="ion ion-ios-close"></i>
                  </button>
                </div>
                {children && <div className="modal-body">{children}</div>}
                {hasFooter && (
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={onClose}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={onSubmit}
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
