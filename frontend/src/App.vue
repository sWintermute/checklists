<template lang="pug">
  #app
    nav
      .nav-fostrap
        ul
          li(v-if='isLoggedIn')
            router-link(to='/') &CHcy;&iecy;&kcy;-&lcy;&icy;&scy;&tcy;&ycy;
          li(v-if='isLoggedIn')
            router-link(to='/reports') &Ocy;&tcy;&chcy;&iecy;&tcy;&ycy;
          li(v-if='isLoggedIn')
            router-link(to='/profile') &Pcy;&rcy;&ocy;&fcy;&icy;&lcy;&softcy;
          li(v-if='isLoggedIn')
            a(@click='logout') &Vcy;&ycy;&khcy;&ocy;&dcy;
          li(v-else='')
            router-link(to='/login') &Vcy;&khcy;&ocy;&dcy;
    .container
      router-view

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

<style lang="sass">
  *
    box-sizing: border-box
    &::before, &::after
      box-sizing: border-box

  html
    height: 100%

  body
    height: 100%
    margin: 0

  a
    text-decoration: none

  .container
    display: flex
    flex-direction: column
    flex-wrap: nowrap
    justify-content: center
    align-items: center

  nav
    margin: 0 0 20px 0

  .nav-fostrap
    display: block
    background: #28d
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26)
    ul
      list-style-type: none
      margin: 0
      padding: 0
      display: flex
      flex-direction: row
      flex-wrap: wrap
      justify-content: center
      align-content: center
    li
      list-style-type: none
      margin: 0
      padding: 0
      display: inline-block
      position: relative
      font-size: 14px
      color: #def1f0
      cursor: pointer
      a
        padding: 15px 20px
        font-size: 14px
        color: #def1f0
        display: inline-block
        outline: 0
        font-weight: 400
      ul.dropdown li
        display: block
        list-style-type: none
        a
          padding: 15px 20px
          font-size: 15px
          color: #fff
          display: block
          font-weight: 400
        &:last-child a
          border-bottom: none
      &:hover a
        background: #2980B9
        color: #fff !important
      &:first-child:hover a
        border-radius: 3px 0 0 3px
      ul.dropdown li
        &:hover a
          background: rgba(0, 0, 0, 0.1)
        &:first-child:hover a
          border-radius: 0

  nav a.router-link-exact-active
    text-decoration-line: underline
    text-decoration-color: #99d0ff
    text-decoration-skip-ink: none
    text-decoration-style: solid
</style>
