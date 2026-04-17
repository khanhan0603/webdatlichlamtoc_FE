import axios from "axios";

const API = "https://webdatlichlamtoc.id.vn/api/auth";

// Tạo axios instance với interceptors để debug
const axiosInstance = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Thêm interceptor để log request
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("🚀 Gửi request:", {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Thêm interceptor để log response
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Response nhận:", {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error("❌ Response error:", {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
    return Promise.reject(error);
  }
);

// Hàm login với nhiều cách thử
export const login = async ({ email, matkhau }) => {
  console.log("📝 Dữ liệu nhận được:", { email, matkhau });
  
  // THỬ CÁCH 1: Gửi đúng theo yêu cầu của API
  try {
    const response = await axiosInstance.post("/login", {
      email: email,
      password: matkhau  // Thử với "password"
    });
    return response.data;
  } catch (error) {
    console.log("Cách 1 thất bại, thử cách 2...");
    
    // THỬ CÁCH 2: Gửi với "matkhau"
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        matkhau: matkhau  // Thử với "matkhau"
      });
      return response.data;
    } catch (error2) {
      console.log("Cách 2 thất bại, thử cách 3...");
      
      // THỬ CÁCH 3: Gửi dạng FormData
      try {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", matkhau);
        
        const response = await axiosInstance.post("/login", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error3) {
        console.error("Tất cả cách đều thất bại");
        throw error3;
      }
    }
  }
};

// Export thêm hàm để test trực tiếp
export const testLogin = async (email, password) => {
  const result = {
    success: false,
    attempts: []
  };
  
  const testCases = [
    { name: "JSON with password", data: { email, password } },
    { name: "JSON with matkhau", data: { email, matkhau: password } },
    { name: "JSON with pwd", data: { email, pwd: password } },
    { name: "JSON with user/pass", data: { username: email, password } },
  ];
  
  for (const test of testCases) {
    try {
      console.log(`Testing: ${test.name}`);
      const response = await axiosInstance.post("/login", test.data);
      result.attempts.push({ ...test, success: true, data: response.data });
      result.success = true;
      result.workingFormat = test;
      break;
    } catch (error) {
      result.attempts.push({ 
        ...test, 
        success: false, 
        error: error.response?.data 
      });
    }
  }
  
  console.log("Test results:", result);
  return result;
};

export default axiosInstance;