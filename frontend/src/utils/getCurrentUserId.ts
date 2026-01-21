/*
 * Wrapper function to get the current user's GitHub ID
 * allowing us to easily change the source
 * when we switch from localStorage to context
 */

//TODO: Refactor this function to use the context instead of localStorage

export const getCurrentUserId = (): number | null => {
  try {
    const userDataString = localStorage.getItem("user");
    if (!userDataString) return null;

    const userData = JSON.parse(userDataString);
    return userData?.id || null;
  } catch (error) {
    console.error("Error getting user ID from localStorage:", error);
    return null;
  }
};
