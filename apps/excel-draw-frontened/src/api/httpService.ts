import axios from "axios";
import { BACKENED_URL } from "@/config";

export const httpService = axios.create({
    baseURL: BACKENED_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
}); 

export default httpService;