export interface ProjectParticipant {
  name: string;
  avatar: string;
}

export interface ProjectStackInfo {
  tech: string;
  logo: string;
  positions: number;
  participants: ProjectParticipant[];
}

export interface Project {
  id: number;
  title: string;
  duration: string;
  frontend: ProjectStackInfo;
  backend: ProjectStackInfo;
  startDate: string;
  endDate: string;
}

export interface ApiProjectsResponse {
  success: boolean;
  data: Project[];
  message: string;
}

export interface UseProjectsState {
  projects: Project[];
  isLoading: boolean;
  errorMessage: string | null;
}
