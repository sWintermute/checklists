const protocol = process.env.VUE_APP_PROTOCOL;
const domain = process.env.VUE_APP_DOMAIN;

let envApiUrl = `${protocol}://${domain}/`;

export const BASE_URL = envApiUrl;
