import { saveAuthClient } from "@/lib/auth-cookies";
import { apiClient, handleApiError } from "@/lib/api-client";

export type SignUpDto = { email: string; password: string; userName: string }; // role is backend-default
export type LoginDto  = { email: string; password: string };
export type TokenResponseDto = { access_token: string; expires_in: number; token_type: "Bearer" };

export async function signup(dto: SignUpDto): Promise<boolean> {
  try {
    await apiClient.post("/auth/signup", dto);
    return true;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function login(dto: LoginDto): Promise<TokenResponseDto> {
  try {
    const response = await apiClient.post<TokenResponseDto>("/auth/login", dto);
    const data = response.data;

    if (!data?.access_token) {
      throw new Error("Missing token");
    }

    saveAuthClient(data.access_token, data.expires_in ?? 900);
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
