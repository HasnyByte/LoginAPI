import axios from "axios";

const API = axios.create({
    baseURL: "https://api-todo-list-pbw.vercel.app",
    headers: {
        "Content-Type": "application/json",
    },
});

export default API;
