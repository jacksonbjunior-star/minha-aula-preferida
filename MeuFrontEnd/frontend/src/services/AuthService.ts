import api from './api'
import { type LoginRequest, type LoginResponse } from '../types/Auth'

export const authService = {
  login: async (req: LoginRequest): Promise<LoginResponse> => {
    const { data } = await api.post('/Auth/login', req)
    return data
  }
}