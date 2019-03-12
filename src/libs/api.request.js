import HttpRequest from '@/libs/axios'
import config from '@/config'
const publicPath = process.env.NODE_ENV === 'development' ? config.publicPath.dev : config.publicPath.pro

const axios = new HttpRequest(publicPath)
export default axios
