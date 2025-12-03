import api from "../../../common/config/axios.config";
import type { AccessTokenType, User } from "../dtos/auth.dto";

export const login = async (data: User): Promise<AccessTokenType> => {
  const response = await api.post<AccessTokenType>("/api/auth/login", data);

  return response.data;
};

export const register = async (data: User): Promise<User> => {
  const response = await api.post<User>("/api/auth/register", data);

  return response.data;
};
