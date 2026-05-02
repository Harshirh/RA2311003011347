import axios from "axios";

export const API_BASE_URL = "/api/evaluation-service";

export const registerUser = async (data: {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  mobileNo: string;
  githubUsername: string;
}) => {
  const response = await axios.post(`${API_BASE_URL}/register`, data);
  return response.data;
};

export const authenticateUser = async (data: {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}) => {
  const response = await axios.post(`${API_BASE_URL}/auth`, data);
  return response.data;
};
