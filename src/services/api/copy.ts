import axios from '@/configs/axios'

export const apiCopy = {
  getDataKeyword: (params: object) => axios.get('/copy/auto-check-keywords', { params }),
  getDataRedirect: (params: object) => axios.get('/copy/auto-check-domain-rdr', { params }),
  getDataRecord: (params: object) =>
    axios.get('/copy/auto-check-history-domain-record', { params }),
  getDataCheck: (params: object) => axios.get('/copy/auto-check-history-domain-check', { params })
}
