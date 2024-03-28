import axios from 'axios';
import Swal from 'sweetalert2';
import "react-toastify/dist/ReactToastify.css";
const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_URL,
  timeout: 15000
});
// instance.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");

instance.interceptors.response.use(function (config) {
  if (config.status === 200 || config.status === 201) {
    return config;
  } else {
    console.log("success code must me 200 or 201");
  }
}, function (error) {
  if (error && error.response) {
    if (error.response.status === 401) {
      if (localStorage.getItem('token') === undefined || localStorage.getItem('token') === null || localStorage.getItem('token') === "") {
        Swal.fire({
          icon: 'warning',
          text: 'Please re-login..!',
        })
      }
      else {
        Swal.fire(
          '401 session expired..!',
          'Please re-login',
          'question'
        )
      }
      localStorage.clear();
      window.location.reload(false);
    }
    if (error.response.status === 500) {
      Swal.fire(
        error.response.data.message,
        'Please try again '
      )
      return error.response;
    } else if (error.response.status === 400) {
      Swal.fire(
        error.response.data.message,
        'Please try again '
      )
      return error.response;
    }
    else {
      return error.response;
    }
  }
});
export default instance;