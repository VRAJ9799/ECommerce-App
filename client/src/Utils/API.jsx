import axios from "axios";

export default async function API({
  method,
  url,
  headers = null,
  data = null,
  params = null,
  privateRoute = false,
}) {
  if (privateRoute) {
    const token = sessionStorage.getItem("token");
    if (token) {
      axios.defaults.headers = {
        ...axios.defaults.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }
  if (headers) {
    axios.defaults.headers = { ...axios.defaults.headers, ...headers };
  }
  const response = await axios({
    method,
    data,
    url: `/${url}`,
    params,
  });
  return response;
}
