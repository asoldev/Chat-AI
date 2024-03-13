import axios from "axios";

// Create an instance of Axios with default configuration
const axiosInstance = axios.create({
  baseURL: "https://backend-chat-latest.onrender.com",
});

export const apiSendMessage = async (text: string) => {
  const response = await axiosInstance.post("/chatbot", { text });
  return response.data;
};

export const apiSendSpeechToText = async (form: FormData) => {
  const response = await axiosInstance.post("/speech-to-text", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
