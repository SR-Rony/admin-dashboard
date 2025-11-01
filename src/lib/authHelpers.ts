// utils/authHelpers.ts
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const refreshAccessToken = async (): Promise<string> => {
  try {
    const res = await axios.post(
      `${apiUrl}/auth/refresh-token`,
      {},
      { withCredentials: true }
    );

    const accessToken = res.data.payload.accessToken;
    return accessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
};

