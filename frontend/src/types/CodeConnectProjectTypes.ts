import type { ReactNode } from "react";
import type { ProgrammingRole } from "../api/endPointJoinProject";

export type ProjectCardProps = {
  project: CodeConnectProject;
  onClick?: (id: number) => void;
};

export type TeamRowProps = {
  members: ProjectParticipant[];
  emptySlots: number;
  slotIndexOffset?: number;
  onEmptySlotClick?: (slotIndex: number) => void;
};

export type ProjectTeamProps = {
  logoFront?: string;
  logoBack?: string;
  contributors?: CodeConnectProjectDataContributor[];
  timeDuration?: string;
};

export type CodeConnectError = {
  message: string;
  status?: number;
  code?: string;
};

export type PendingSlot = {
  area: "frontend" | "backend";
  index: number;
  role: ProgrammingRole;
};

export interface Role {
  tech: string;
  logo: string;
  positions: number;
  participants: ProjectParticipant[];
}
export interface ProjectParticipant {
  name: string;
  avatar: string;
}

export interface CodeConnectProject {
  id: number;
  title: string;
  time_duration: string;
  language_backend: string;
  language_frontend: string;
  contributors: CodeConnectProjectDataContributor[];
}

export interface CodeConnectProjectDataContributor {
  name: string;
  programming_role: string;
}

export interface CodeConnectProjectsResponse {
  success: boolean;
  data: CodeConnectProject[];
  message: string;
}

export interface CodeConnectProjectDetailsResponse {
  success: boolean;
  data: CodeConnectProject;
  message: string;
}

export interface UseProjectsState {
  projects: CodeConnectProject[];
  isLoading: boolean;
  errorMessage: string | null;
}

export interface ProgressBarProps {
  title: string;
  startDate: string;
  endDate: string;
}

export interface ProjectButtonProps {
  children?: ReactNode;
  onClick?: () => void;
}
