import axios from ".";

const Api = {
    login: (data) => axios.post("/login", data),
    me: () => axios.get("/me"),
}

export default Api;