import { createContext, useContext, useState, ReactNode } from "react";
import type { PendingSlot } from "../types/codeConnectTypes";

export type PendingStatus = "pending";

export interface PendingSlotWithStatus extends PendingSlot {
  status: PendingStatus;
}

type State = Record<number, PendingSlotWithStatus[]>;

type ContextType = {
  requests: State;
  addRequest: (projectId: number, slot: PendingSlotWithStatus) => void;
};

const ProjectJoinContext = createContext<ContextType | undefined>(undefined);

export function ProjectJoinProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<State>({});

  const addRequest = (projectId: number, slot: PendingSlotWithStatus) => {
    setRequests((prev) => {
      const current = prev[projectId] ?? [];

      const exists = current.some(
        (s) => s.area === slot.area && s.index === slot.index
      );

      if (exists) return prev;

      return {
        ...prev,
        [projectId]: [...current, slot],
      };
    });
  };

  return (
    <ProjectJoinContext.Provider value={{ requests, addRequest }}>
      {children}
    </ProjectJoinContext.Provider>
  );
}

export function useProjectJoinContext() {
  const ctx = useContext(ProjectJoinContext);
  if (!ctx) throw new Error("Must be used inside provider");
  return ctx;
}