// What is Axios?
// Axios is a JavaScript library used to send HTTP requests from your frontend to a backend server.

//We are Doing frontend in redux

//Single Instance to change the server coming from backend 
export const clientServer = axios.create({
    baseURL:"http://localhost:9090/",
})