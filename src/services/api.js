import axios from "axios";

const API = "https://webdatlichlamtoc.id.vn/api";

// lấy danh sách dịch vụ
export const getServices = () => {
  return axios.get(`${API}/phuong-tiens`);
};

// lấy media theo id dịch vụ
export const getMediaByServiceId = (id) => {
  return axios.get(`${API}/media/dichvu/${id}`);
};