const PROTOCOL = process.env.VUE_APP_PROTOCOL
const DOMAIN = process.env.VUE_APP_DOMAIN
const PORT = process.env.VUE_APP_PORT

const baseURL = `
                ${PROTOCOL || 'http'}://
                ${DOMAIN || 'localhost'}
                ${PORT || '80'}/
                `

export default {
  baseURL
}
