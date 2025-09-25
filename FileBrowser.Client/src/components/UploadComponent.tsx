import axios from "axios";
import { useState, type ChangeEvent } from "react";
import environment from "../environment";
import useDirectoryPath from "../hooks/useDirectoryPath";

const CHUNK_SIZE: number = 5 * 1024 * 1024;
const UPLOAD_FORMDATA_NAMES = {
  chunk: "chunk",
  fileName: "fileName",
  index: "index",
};

type Props = {
  onChangeStatus: (status: UploadStatus) => void;
};

export type UploadStatus = {
  isCompleted: boolean;
  hasError: boolean;
};

type MergeChunkRequest = {
  fileName: string;
  path: string;
};

export default function UploadComponent({ onChangeStatus }: Props) {
  const [progress, setProgress] = useState<number>(0);
  const { directoryPath } = useDirectoryPath();

  const upload = async (file: File) => {
    const uploadStatus: UploadStatus = {
      isCompleted: false,
      hasError: false,
    };
    onChangeStatus(uploadStatus);
    let start = 0;
    let index = 0;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    while (start < file.size) {
      const chunk = file.slice(start, start + CHUNK_SIZE);
      const formData = new FormData();
      formData.append(UPLOAD_FORMDATA_NAMES.chunk, chunk);
      formData.append(UPLOAD_FORMDATA_NAMES.fileName, file.name);
      formData.append(UPLOAD_FORMDATA_NAMES.index, index.toString());

      const { status, data: isSuccess } = await axios.post<boolean>(
        environment.UPLOAD_CHUNK_PATH,
        formData,
        {
          baseURL: environment.BASE_URL,
        }
      );

      if (status != 200 || !isSuccess) {
        onChangeStatus({ ...uploadStatus, hasError: true });
        return;
      }

      start += CHUNK_SIZE;
      index++;

      const currentProgress = Math.round((index / totalChunks) * 100);
      setProgress(currentProgress);
    }

    const mergeRequest: MergeChunkRequest = {
      fileName: file.name,
      path: directoryPath,
    };
    const { status, data: isSuccess } = await axios.post<boolean>(environment.MERGE_CHUNK_PATH, mergeRequest, {
      baseURL: environment.BASE_URL,
    });

    if (status != 200 || !isSuccess) {
        onChangeStatus({ ...uploadStatus, hasError: true });
        return;
    }

    onChangeStatus({ ...uploadStatus, isCompleted: true });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      upload(file);
    }
  };

  return (
    <>
      <input
        type="file"
        className="form-control"
        multiple={false}
        onChange={handleChange}
      />
      <div className="progress mt-3">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {progress}%
        </div>
      </div>
    </>
  );
}
