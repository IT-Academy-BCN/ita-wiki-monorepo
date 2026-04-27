const API_URL = import.meta.env.VITE_API_URL || "http://localhost/api/";

type EndPoints =
  | "resources/"
  | "users/lists"
  | "roles/"
  | "bookmarks/"
  | "bookmarks"
  | "likes/"
  | "tags/"
  | "tags/category-frequency"
  | "feature-flags/"
  | "feature-flags/role-self-assignment"
  | "tags/by-category"
  | "technical-tests"
  | "codeconnect"
  | "auth"
  | "tickets";

const END_POINTS = {
  resources: {
    lists: "resources" as EndPoints,
    post: "resources" as EndPoints,
  },
  bookmarks: {
    get: "bookmarks" as EndPoints,
    post: "bookmarks" as EndPoints,
    delete: "bookmarks" as EndPoints,
  },
  roles: {
    lists: "users/user-signedin-as?github_id=" as EndPoints,
    post: "roles/" as EndPoints,
    put: "roles/" as EndPoints,
  },
  likes: {
    get: "likes" as EndPoints,
    post: "likes" as EndPoints,
    delete: "likes" as EndPoints,
  },
  tags: {
    get: "tags/" as EndPoints,
    categoryFrequency: "tags/category-frequency" as EndPoints,
    byCategory: "tags/by-category" as EndPoints,
  },
  devTools: {
    roleChange: "feature-flags/role-self-assignment" as EndPoints,
  },
  technicaltests: {
    create: "technical-tests" as EndPoints,
    get: "technical-tests" as EndPoints,
  },
  codeconnect: {
    get: "codeconnect" as EndPoints,
    post: "codeconnect" as EndPoints,
  },
  auth: {
    login: "auth/github/redirect" as EndPoints,
    getAuthUser: "auth/github/user" as EndPoints,
    getCurrentUser: "auth/me" as EndPoints,
    logout: "auth/logout" as EndPoints,
  },
  tickets: {
    get: "tickets" as EndPoints,
    post: "tickets" as EndPoints,
  },
};

export { API_URL, END_POINTS };
