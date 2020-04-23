// import AuthToken from '@/interfaces/AuthToken'

const ID_TOKEN_KEY = 'authToken'

export default {
  getAuthToken: () => localStorage.getItem(ID_TOKEN_KEY),

  saveAuthToken: (token: string) => localStorage.setItem(ID_TOKEN_KEY, token),

  destroyToken: () => localStorage.removeItem(ID_TOKEN_KEY)
}
