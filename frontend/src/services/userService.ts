import api from "../api";

export const getUsers = async () => {
    const res = await api.get("/users");
    return res.data;
}

export const blockUser = async (userId: string) => {
    const res = await api.post(`/users/${userId}/block`);
    return res.data;
}

export const unblockUser = async (userId: string) => {
    const res = await api.post(`/users/${userId}/unblock`);
    return res.data;
}

export const deleteUser = async (userId: string) => {
    const res = await api.delete(`/users/${userId}`);
    return res.data;
}