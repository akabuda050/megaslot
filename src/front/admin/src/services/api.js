import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: `${process.env.VUE_APP_BE_URL}:${process.env.VUE_APP_BE_PORT}`
  })
}