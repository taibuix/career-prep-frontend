import api from "@/lib/axios";

interface ICreateUser {
    name: string, email: string, password: string
}

interface ILoginUser {
    email: string, password: string
}

interface IUpdateCurrentUser {
    name: string;
    email: string;
}

export const registerUser = async (data: ICreateUser) => {
    const response = await api.post("/auth/register", data);
    return response.data;
}

export const loginUser = async (data: ILoginUser) => {
    const response = await api.post("/auth/login", data);
    return response.data;
}

export const getCurrentUser = async () => {
    const response = await api.get("/auth/me");
    return response.data;
};

export const logoutUser = async () => {
    const response = await api.post("/auth/logout");
    return response.data;
}

export const updateCurrentUser = async (data: IUpdateCurrentUser) => {
    const response = await api.put("/auth/me", data);
    return response.data;
}
