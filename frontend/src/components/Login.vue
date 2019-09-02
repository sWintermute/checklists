<template>
  <div class="login">
    <h2 class="login-header">Log in</h2>
    <form class="login-container"  @submit.prevent="login">
      <p><input required v-model="email" type="email" placeholder="Email"></p>
      <p><input required v-model="password" type="password" placeholder="Password"></p>
      <p><input type="submit" value="Log in"></p>
    </form>
  </div>
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
		   		.then(() => this.$router.go('/secure'))
		   		.catch(err => console.log(err))
		   	}
		}
	}
</script>

<style>
  @import url(https://fonts.googleapis.com/css?family=Roboto:400,500,700,300,100);

  body {
    background-color: #f0f0f0;
    color: #1b1e24;
    font-family: "Roboto", helvetica, arial, sans-serif;
    font-size: 16px;
    font-weight: 400;
    text-rendering: optimizeLegibility;
  }

  .login {
    max-width: 400px;
    margin: 60px auto;
    font-size: 16px;
    box-shadow: 1px 1px 5px -2px black;
  }

  /* Reset top and bottom margins from certain elements */
  .login-header,
  .login p {
    margin-top: 0;
    margin-bottom: 0;
  }

  .login-header {
    background: #28d;
    padding: 20px;
    font-size: 1.4em;
    font-weight: normal;
    text-align: center;
    text-transform: uppercase;
    color: #fff;
  }

  .login-container {
    background: #ebebeb;
    padding: 12px;
  }

  /* Every row inside .login-container is defined with p tags */
  .login p {
    padding: 12px;
  }

  .login input {
    box-sizing: border-box;
    display: block;
    width: 100%;
    border-width: 1px;
    border-style: solid;
    padding: 16px;
    outline: 0;
    font-family: inherit;
    font-size: 0.95em;
  }

  .login input[type="email"],
  .login input[type="password"] {
    background: #fff;
    border-color: #bbb;
    color: #555;
  }

  /* Text fields' focus effect */
  .login input[type="email"]:focus,
  .login input[type="password"]:focus {
    border-color: #888;
  }

  .login input[type="submit"] {
    background: #28d;
    border-color: transparent;
    color: #fff;
    cursor: pointer;
  }

  .login input[type="submit"]:hover {
    background: #17c;
  }

  /* Buttons' focus effect */
  .login input[type="submit"]:focus {
    border-color: #05a;
  }
</style>
