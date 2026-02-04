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

export interface CodeConnectProjects {
  success: boolean;
  data: CodeConnectProject[];
  message: string;
}

export interface UseProjectsState {
  projects: CodeConnectProject[];
  isLoading: boolean;
  errorMessage: string | null;
}
