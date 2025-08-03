import api from "../api";

export const getUsers = async () => {
    const res = await api.get("/api/users");
    return res.data;
}

export const blockUser = async (userId: string) => {
    const res = await api.post(`/api/users/${userId}/block`);
    return res.data;
}

export const unblockUser = async (userId: string) => {
    const res = await api.post(`/api/users/${userId}/unblock`);
    return res.data;
}

export const deleteUser = async (userId: string) => {
    const res = await api.delete(`/api/users/${userId}`);
    return res.data;
}