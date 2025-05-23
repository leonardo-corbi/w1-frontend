import axios from "axios";
import Cookies from "js-cookie";
import { Register } from "@/types/Register";
import { CustomUser } from "@/types/CustomUser";
import { Patrimonio } from "@/types/Patrimonio";
import { Objetivo } from "@/types/Objetivo";
import { Holding } from "@/types/Holding";
import { Documento } from "@/types/Documento";
import { Processo } from "@/types/Processo";
import { Notificacao } from "@/types/Notificacao";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros e refresh token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 (não autorizado) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tenta obter um novo token usando o refresh token
        const refreshToken = Cookies.get("refresh_token");
        if (!refreshToken) {
          throw new Error("Refresh token não encontrado");
        }

        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        // Salva o novo token
        const { access } = response.data;
        Cookies.set("access_token", access);

        // Refaz a requisição original com o novo token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Se falhar o refresh, limpa os tokens e redireciona para login
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");

        // Se estiver no navegador, redireciona para login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Interface para registro de usuário

// Funções de autenticação
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post("/token/", { email, password });
    const { access, refresh } = response.data;

    // Salva os tokens
    Cookies.set("access_token", access);
    Cookies.set("refresh_token", refresh);

    return response.data;
  },

  register: async (userData: Register) => {
    return api.post("/register/", userData);
  },

  logout: () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
  },

  getProfile: async (): Promise<{ data: CustomUser }> => {
    return api.get("/me/");
  },

  updateProfile: async (profileData: Partial<CustomUser>) => {
    return api.put("/me/", profileData);
  },

  isAuthenticated: () => {
    return !!Cookies.get("access_token");
  },
};

export const patrimonioAPI = {
  getAll: async (): Promise<{ data: Patrimonio[] }> => {
    return api.get("/patrimonio/");
  },
  create: async (
    patrimonioData: Partial<Patrimonio>
  ): Promise<{ data: Patrimonio }> => {
    return api.post("/patrimonio/create/", patrimonioData);
  },
  delete: async (id: string): Promise<void> => {
    return api.delete(`/patrimonio/${id}/delete/`);
  },
  update: async (
    id: string,
    patrimonioData: Partial<Patrimonio>
  ): Promise<{ data: Patrimonio }> => {
    return api.patch(`/patrimonio/${id}/`, patrimonioData);
  },
};

export const objetivoAPI = {
  getAll: async (): Promise<{ data: Objetivo[] }> => {
    return api.get("/objetivo/");
  },
  create: async (
    objetivoData: Partial<Objetivo>
  ): Promise<{ data: Objetivo }> => {
    return api.post("/objetivo/create/", objetivoData);
  },
  delete: async (id: string): Promise<void> => {
    return api.delete(`/objetivo/${id}/delete/`);
  },
  update: async (
    id: string,
    objetivoData: Partial<Objetivo>
  ): Promise<{ data: Objetivo }> => {
    return api.patch(`/objetivo/${id}/`, objetivoData);
  },
};

export const holdingAPI = {
  getAll: async (): Promise<{ data: Holding[] }> => {
    return api.get("/holding/");
  },
  create: async (
    holdingData: Partial<Omit<Holding, "id" | "user_id" | "criado_em">>
  ): Promise<{ data: Holding }> => {
    return api.post("/holding/create/", holdingData);
  },
  update: async (
    id: string,
    holdingData: Partial<Omit<Holding, "id" | "user_id" | "criado_em">>
  ): Promise<{ data: Holding }> => {
    return api.patch(`/holding/${id}/`, holdingData);
  },
};

export const documentoAPI = {
  getAll: async (): Promise<{ data: Documento[] }> => {
    return api.get("/documento/");
  },
  create: async (documentoData: {
    tipo_documento: string;
    status: string;
    arquivo: File;
    holding_id: string;
  }): Promise<{ data: Documento }> => {
    const formData = new FormData();
    formData.append("tipo_documento", documentoData.tipo_documento);
    formData.append("status", documentoData.status);
    formData.append("arquivo", documentoData.arquivo);
    return api.post("/documento/create/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  get: async (id: string): Promise<{ data: Documento }> => {
    return api.get(`/documento/${id}/`);
  },
  update: async (
    id: string,
    documentoData: {
      tipo_documento: string;
      status: string;
      arquivo?: File;
      holding_id: string;
    }
  ): Promise<{ data: Documento }> => {
    const formData = new FormData();
    formData.append("tipo_documento", documentoData.tipo_documento);
    formData.append("status", documentoData.status);
    formData.append("holding_id", documentoData.holding_id);
    if (documentoData.arquivo) {
      formData.append("arquivo", documentoData.arquivo);
    }
    return api.patch(`/documento/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: async (id: string): Promise<void> => {
    return api.delete(`/documento/${id}/delete/`);
  },
};
export const processoAPI = {
  getAll: () => api.get<Processo[]>("/processo/"),
  create: (data: Partial<Processo>) => api.post("/processo/", data),
  update: (id: string, data: Partial<Processo>) =>
    api.patch(`/processo/${id}/`, data),
  delete: (id: string) => api.delete(`/processo/${id}/delete/`),
};

export const notificacaoAPI = {
  getAll: () => api.get<Notificacao[]>("/notificacao/"),
  create: (data: Partial<Notificacao>) => api.post("/notificacao/", data),
  update: (id: string, data: Partial<Notificacao>) =>
    api.patch(`/notificacao/${id}/`, data),
  delete: (id: string) => api.delete(`/notificacao/${id}/delete/`),
};

export default api;
