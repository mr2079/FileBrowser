import axios from "axios";
import { createContext, useState, type ReactNode, type SetStateAction } from "react";
import environment from "../environment";

type CommandMode = "select" | "copy" | "move";

type CommandContextType = {
  commandMode: CommandMode | null;
  setCommandMode: (value: SetStateAction<CommandMode | null>) => void;
  selectedItems: string[] | undefined;
  setSelectedItems: (value: SetStateAction<string[] | undefined>) => void;
  rename: (request: RenameRequest) => Promise<boolean>;
  remove: (request: RemoveRequest) => Promise<boolean>;
};

const CommandContext = createContext<CommandContextType | undefined>(undefined);

export default CommandContext;

type CommandContextProviderType = {
  children: ReactNode;
};

export type RenameRequest = {
  path: string,
  newName: string
}

export type RemoveRequest = {
  paths: string[],
}

export function CommandContextProvider({
  children,
}: CommandContextProviderType) {
  const [commandMode, setCommandMode] = useState<CommandMode | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[] | undefined>(undefined);

  const rename = async (request: RenameRequest) : Promise<boolean> => {
    return axios.put<boolean>(environment.FILE_RENAME_PATH, request, {
      baseURL: environment.BASE_URL,
    }).then(({ status, data }) => {
      if (status != 200 || !data) return false;
      return true;
    }).catch(() => {
      return false;
    });
  }

  const remove = async (request: RemoveRequest) : Promise<boolean> => {
    return axios.delete<boolean>(environment.FILE_REMOVE_PATH, {
      baseURL: environment.BASE_URL,
      data: request
    }).then(({ status, data }) => {
      if (status != 200 || !data) return false;
      return true;
    }).catch(() => {
      return false;
    });
  }

  const values = {
    commandMode,
    setCommandMode,
    selectedItems,
    setSelectedItems,
    rename,
    remove
  };

  return (
    <CommandContext.Provider
      value={values}
    >
      {children}
    </CommandContext.Provider>
  );
}
