export const BASE_URL = process.env.NODE_ENV === "production" ? process.env.VUE_APP_DOMAIN_PROD : process.env.VUE_APP_DOMAIN_DEV;
export default BASE_URL;