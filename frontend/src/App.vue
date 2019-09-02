<template>
  <div id="app">
    <nav>
      <div class="nav-fostrap">
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/about">About</router-link></li>
          <li v-if="isLoggedIn"><router-link to="/secure">Checklists</router-link></li>
          <li v-if="isLoggedIn"><a @click="logout">Logout</a></li>
          <li v-else><router-link to="/login">Login</router-link></li>
        </ul>
      </div>
      <div class="nav-bg-fostrap">
        <div class="navbar-fostrap"> <span></span> <span></span> <span></span> </div>
        <a href="" class="title-mobile">Ecotek</a>
      </div>
    </nav>
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>
<script>
  export default {
    computed : {
      isLoggedIn : function(){ return this.$store.getters.isLoggedIn}
    },
    methods: {
      logout: function () {
        this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/login')
        })
      }
    },
    created: function () {
      this.$http.interceptors.response.use(undefined, function (err) {
        return new Promise(function (resolve, reject) {
          if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
            this.$store.dispatch(logout)
          }
          throw err;
        });
      });
    }
  }
</script>

<style>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #F0F0F0;
  font-size: 15px;
  color: #666;
  font-family: 'Roboto', sans-serif;
}

a { text-decoration: none; }

.container {
  margin: 120px 0 0 0;
}

.nav-fostrap {
  display: block;
  background: #28d;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
  border-radius: 3px;
}

.nav-fostrap ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: center;
}

.nav-fostrap li {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: inline-block;
  position: relative;
  font-size: 14px;
  color: #def1f0;
}

.nav-fostrap li a {
  padding: 15px 20px;
  font-size: 14px;
  color: #def1f0;
  display: inline-block;
  outline: 0;
  font-weight: 400;
}

.nav-fostrap li:hover ul.dropdown { display: block; }

.nav-fostrap li ul.dropdown {
  position: absolute;
  display: none;
  width: 200px;
  background: #28d;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
  padding-top: 0;
}

.nav-fostrap li ul.dropdown li {
  display: block;
  list-style-type: none;
}

.nav-fostrap li ul.dropdown li a {
  padding: 15px 20px;
  font-size: 15px;
  color: #fff;
  display: block;
  font-weight: 400;
}

.nav-fostrap li ul.dropdown li:last-child a { border-bottom: none; }

.nav-fostrap li:hover a {
  background: #2980B9;
  color: #fff !important;
}

.nav-fostrap li:first-child:hover a { border-radius: 3px 0 0 3px; }

.nav-fostrap li ul.dropdown li:hover a { background: rgba(0,0,0, .1); }

.nav-fostrap li ul.dropdown li:first-child:hover a { border-radius: 0; }

.nav-fostrap li:hover .arrow-down { border-top: 5px solid #fff; }

.arrow-down {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #def1f0;
  position: relative;
  top: 15px;
  right: -5px;
  content: '';
}
.title-mobile {
  display: none;
}
@media only screen and (max-width:900px) {
  .nav-fostrap {
    background: #fff;
    width: 200px;
    height: 100%;
    display: block;
    position: fixed;
    left: -200px;
    top: 0;
    transition: left 0.25s ease;
    margin: 0;
    border: 0;
    border-radius: 0;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .title-mobile {
    position: fixed;
    display: block;
    top: 10px;
    font-size: 20px;
    left: 100px;
    right: 100px;
    text-align: center;
    color: #FFF;
  }
  .nav-fostrap.visible {
    left: 0;
    transition: left 0.25s ease;
  }

  .nav-bg-fostrap {
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    height: 50px;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
    background: #28d;
    padding: 12px 0 0 10px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
  }

  .navbar-fostrap {
    display: inline-block;
    vertical-align: middle;
    height: 50px;
    cursor: pointer;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
    padding: 12px;
  }

  .navbar-fostrap span {
    height: 2px;
    background: #fff;
    margin: 5px;
    display: block;
    width: 20px;
  }

  .navbar-fostrap span:nth-child(2) { width: 20px; }

  .navbar-fostrap span:nth-child(3) { width: 20px; }

  .nav-fostrap ul { padding-top: 50px; }

  .nav-fostrap li { display: block; }

  .nav-fostrap li a {
    display: block;
    color: #505050;
    font-weight: 600;
  }

  .nav-fostrap li:first-child:hover a { border-radius: 0; }

  .nav-fostrap li ul.dropdown { position: relative; }

  .nav-fostrap li ul.dropdown li a {
    background: #2980B9 !important;
    border-bottom: none;
    color: #fff !important;
  }

  .nav-fostrap li:hover a {
    background: #03A9F4;
    color: #fff !important;
  }

  .nav-fostrap li ul.dropdown li:hover a {
    background: rgba(0,0,0,.1) !important;
    color: #fff !important;
  }

  .nav-fostrap li ul.dropdown li a { padding: 10px 10px 10px 30px; }

  .nav-fostrap li:hover .arrow-down { border-top: 5px solid #fff; }

  .arrow-down {
    border-top: 5px solid #505050;
    position: absolute;
    top: 20px;
    right: 10px;
  }

  .cover-bg {
    background: rgba(0,0,0,0.5);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

.fixed-top {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
}

nav a.router-link-exact-active {
  text-decoration: underline;
}
</style>
