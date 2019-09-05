<template lang="pug">
  .login
    h2.login-header &Vcy;&vcy;&iecy;&dcy;&icy;&tcy;&iecy; &scy;&vcy;&ocy;&icy; &dcy;&acy;&ncy;&ncy;&ycy;&iecy;
    form.login-container(@submit.prevent='login')
      p
        input(required='' v-model='email' type='email' placeholder='Email')
      p
        input(required='' v-model='password' type='password' placeholder='Password')
      p
        input(type='submit' value='Войти')
</template>
<script>
	export default {
		data(){
			return {
				email : "",
            	password : ""
            }
		},
		methods: {
		 	login: function () {
		   		let email = this.email;
		   		let password = this.password;
		   		this.$store.dispatch('login', { email, password })
		   		.then(() => this.$router.push('/profile'))
		   		.catch(err => console.log(err))
		   	}
		}
	}
</script>

<style lang="sass" scoped>
  .login
    max-width: 400px
    margin: 60px auto
    font-size: 16px
    box-shadow: 1px 1px 5px -2px black

  .login-header, .login p
    margin-top: 0
    margin-bottom: 0

  .login-header
    background: #28d
    padding: 20px
    font-size: 1.4em
    font-weight: normal
    text-align: center
    text-transform: none
    color: #fff

  .login-container
    background: #ebebeb
    padding: 12px

  .login
    p
      padding: 12px
    input
      box-sizing: border-box
      display: block
      width: 100%
      border-width: 1px
      border-style: solid
      padding: 16px
      outline: 0
      font-family: inherit
      font-size: 0.95em
      &[type="email"], &[type="password"]
        background: #fff
        border-color: #bbb
        color: #555
      &[type="email"]:focus, &[type="password"]:focus
        border-color: #888
      &[type="submit"]
        background: #28d
        border-color: transparent
        color: #fff
        cursor: pointer
        &:hover
          background: #17c
        &:focus
          border-color: #05a
</style>
