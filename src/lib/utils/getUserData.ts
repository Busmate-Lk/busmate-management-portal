import UserData from "@/types/UserData";
import { getDecodedAccessToken } from "./getDecodedAccessToken";

/**
 * Utility function to fetch and decode user data from the access token.
 * This is used in the server components to get user information for rendering.
 * 
 * Returns null if the user is not authenticated or if the session is invalid.
 * When returning null, invalid sessions are automatically cleaned up.
 */
export async function getUserData(): Promise<UserData | null> {
  try {
    const payLoad = await getDecodedAccessToken();
    if (!payLoad) {
      return null;
    }
    
    // Validate essential token fields
    if (!payLoad.sub || !payLoad.email || !payLoad.groups || payLoad.groups.length === 0) {
      console.warn("Invalid token payload: missing required fields");
      return null;
    }
    
    return {
      id: payLoad.sub,
      email: payLoad.email || "",
      user_role: payLoad.groups[0] || "user",
      username: payLoad.email || "Unknown User",
      firstName: payLoad.given_name,
      lastName: payLoad.family_name
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}