import { create } from "zustand";

type Tool = "select" | "proton" | "electron";

type ToolStore = {
    tool: Tool;
    setTool: (tool: Tool) => void;
};

export const useToolStore = create<ToolStore>()((set) => ({
    tool: "select",
    setTool: (tool: Tool) => set({ tool }),
}));
