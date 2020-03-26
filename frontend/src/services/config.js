const protocol = process.env.VUE_APP_PROTOCOL
const domain = process.env.VUE_APP_DOMAIN
const port = process.env.VUE_APP_PORT

const envApiUrl = `${protocol}://${domain}${port ? ':' + port : ''}/`

export const BASE_URL = envApiUrl
