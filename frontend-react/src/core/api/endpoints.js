export const API_ENDPOINT = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4001/api';

export const getLoginEndpoint = () => `${API_ENDPOINT}/login`;
export const getRegisterEndpoint = () => `${API_ENDPOINT}/register`;
export const getGatewaysEndpoint = (id) => `${API_ENDPOINT}/gateways`;
export const getAddGatewaysEndpoint = () => `${API_ENDPOINT}/register-gateway`;
export const getAddDeviceEndpoint = (idGateway) => `${API_ENDPOINT}/add-device-to-gateway/${idGateway}`;
export const getEditGatewaysEndpoint = (idGateway) => `${API_ENDPOINT}/update-gateway/${idGateway}`;
export const getDeleteGatewaysEndpoint = (idGateway) => `${API_ENDPOINT}/delete-gateway/${idGateway}`;
export const getDeleteDeviceEndpoint = (idGateway, idDevice) => `${API_ENDPOINT}/gateway/${idGateway}/remove-device/${idDevice}`;
export const getEditDeviceEndpoint = (idGateway, idDevice) => `${API_ENDPOINT}/gateway/${idGateway}/edit-device/${idDevice}`;


export const getUploadEndpoint = () => `${API_ENDPOINT}/upload`;
export const getDownloadEndpoint = () => `${API_ENDPOINT}/downloadfile`;
export const getFilesByUserEndpoint = (tye) => `${API_ENDPOINT}/filesByUser`;
export const getUpdateFileNameEndpoint = (id) => `${API_ENDPOINT}/updateFile/${id}`;
