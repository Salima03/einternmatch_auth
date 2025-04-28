import axios from './axiosConfig';

export const getMyProfile = () => axios.get('/profiles/my-profile');
export const updateProfile = (id, data) => axios.put(`/profiles/${id}`, data);
export const uploadDocuments = (id, formData) => axios.post(`/profiles/${id}/upload-documents`, formData);
export const createProfile = (data) => axios.post('/profiles', data);
