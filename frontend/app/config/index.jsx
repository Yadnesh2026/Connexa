// What is Axios?
// Axios is a JavaScript library used to send HTTP requests from your frontend to a backend server.

//We are Doing frontend in redux

import axios from "axios";
//Single Instance to change the server coming from backend

export const baseURL = "http://localhost:9090/"
export const clientServer = axios.create({
    baseURL:baseURL,
})