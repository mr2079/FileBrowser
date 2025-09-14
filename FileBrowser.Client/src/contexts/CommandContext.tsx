import { createContext, useState, type ReactNode, type SetStateAction } from "react";

type CommandMode = "select" | "copy" | "move";

export type CommandContextType = {
  commandMode: CommandMode | null;
  setCommandMode: (value: SetStateAction<CommandMode | null>) => void;
  selectedItems: string[] | undefined;
  setSelectedItems: (value: SetStateAction<string[] | undefined>) => void;
};

const CommandContext = createContext<CommandContextType | undefined>(undefined);

export default CommandContext;

type CommandContextProviderType = {
  children: ReactNode;
};

export function CommandContextProvider({
  children,
}: CommandContextProviderType) {
  const [commandMode, setCommandMode] = useState<CommandMode | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[] | undefined>(undefined);

  return (
    <CommandContext.Provider
      value={{
        commandMode,
        setCommandMode,
        selectedItems,
        setSelectedItems
      }}
    >
      {children}
    </CommandContext.Provider>
  );
}
