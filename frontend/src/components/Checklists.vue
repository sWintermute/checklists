<template lang="pug">
    .quiz-window
        .quiz-window-header
            .quiz-window-title Чеклисты
        .quiz-window-body
            .gui-window-awards
                ul.guiz-awards-row.guiz-awards-header
                    li.guiz-awards-header-title № п/п
                    li.guiz-awards-header-track Параметры
                    li.guiz-awards-header-time Примечание
                ul.guiz-awards-row.guiz-awards-row-even(v-for='list in lists')
                    a(:href="'checklist/' + list.id")
                        li.guiz-awards-title
                            | Чек-лист № {{list.id}}
                            .guiz-awards-subtitle
                        li.guiz-awards-track {{ list.name }}
                        li.guiz-awards-time {{ list.description }}
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'checklists',
    data() {
      return {
      }
    },
    created: function () {
      this.$store.dispatch('lists');
    },
    computed: {
      ...mapState(["lists"])
    },
    methods: {
    }
  }
</script>


<style>
  @import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,700);

  * {box-sizing: border-box;}
  *:hover, *:focus {outline:0}

  html {height: 100%;}

  body {
      height: 100%;
      background: rgba(0, 0, 0, 0.04);
      font-family: 'Roboto', sans-serif;
      font-weight: 300;
      font-size: 17px;
      color:#777;
  }
  button, select, input {
      font-family: 'Roboto', sans-serif;
      font-size: 17px;
  }
  .quiz-window {
      margin: auto;
      max-width: 600px;
      border-radius: 4px;
      background: #fff;
      overflow: hidden;
      box-shadow: 1px 1px 4px -1px black;
  }
  .quiz-window-header {
      padding: 20px 15px;
      text-align:center;
      position: relative;
  }
  .quiz-window-title {
      font-size: 26px;
  }
  .quiz-window-body {
      background-color: #f9f9f9;
  }
  .guiz-awards-row {
      margin:0;
      padding: 10px 40px;
      list-style: none;
  }
  .guiz-awards-row:after {
      content: '';
      display: table;
      clear:both;
  }
  .guiz-awards-row-even {
      background-color: #fff;
      border-bottom: 1px solid #d4d4d4;
  }
  .guiz-awards-row li {
      display:inline-block;
      vertical-align: top;
      float: left;
  }
  .guiz-awards-header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #d4d4d4;
  }
  .guiz-awards-title {
      width: 40%;
      min-width: 160px;
      font-size: 18px;
      font-weight: normal;
      padding-top: 3px;
  }
  .guiz-awards-title a:hover {
      color: black;
      transition: color 0.5s;
  }
  .guiz-awards-header-title {
      width: 40%;
      min-width: 160px;
  }
  .guiz-awards-subtitle {
      color: #858585;
      font-size: 14px;
      font-weight: 300;
  }
  .guiz-awards-track, .guiz-awards-time {
      width: 22%;
      min-width: 80px;
      font-size: 18px;
      line-height: 45px
  }
  .guiz-awards-header-track, .guiz-awards-header-time {
      width: 22%;
      min-width: 100px;
  }
  .guiz-awards-track .null, .guiz-awards-time .null {
      color:#bababa;
  }

  .guiz-awards-but-back i {
      font-size: 26px;
      line-height: 17px;
      margin-right: 20px;
      position: relative;
      top: 2px;
  }

</style>
