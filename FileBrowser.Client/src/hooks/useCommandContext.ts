import { useContext } from "react";
import CommandContext from "../contexts/CommandContext";

export default function useCommandContext() {
    const context = useContext(CommandContext);
    if (!context) {
        throw new Error("useCommand must be used within a CommandProvider");
    }
    return context;
}