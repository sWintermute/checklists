<template>
  <div class="checklists__block">
    <div class="table__title">
      <h3 class="table__title__text">Чек-листы</h3>
    </div>
    <table class="table__container">
      <thead>
        <tr>
          <th><h1>№ п/п</h1></th>
          <th><h1>Параметры</h1></th>
          <th><h1>Примечание</h1></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="list in lists">
          <td><a :href="'checklist/' + list.id">Чек-лист № {{list.id}}</a></td>
          <td>{{ list.name }}</td>
          <td>{{ list.description }}</td>
        </tr>
      </tbody>
    </table>
    {{lists}}
  </div>
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

  body {
    font-family: 'Open Sans', sans-serif;
    font-weight: 300;
    line-height: 1.42em;
    color:#A7A1AE;
    background-color:#1F2739;
  }

  h1 {
    font-size:3em;
    font-weight: 300;
    line-height:1em;
    text-align: center;
    color: #4DC3FA;
  }

  h2 {
    font-size:1em;
    font-weight: 300;
    text-align: center;
    display: block;
    line-height:1em;
    padding-bottom: 2em;
    color: #FB667A;
  }

  h2 a {
    font-weight: 700;
    text-transform: uppercase;
    color: #FB667A;
    text-decoration: none;
  }

  .table__container th h1, .table__container tr td a {
    font-weight: bold;
    font-size: 1em;
    text-align: center;
    color: #185875;
  }

  .table__container tr td a:hover {
    text-decoration: underline;
  }

  .table__container td {
    font-weight: normal;
    font-size: 1em;
    -webkit-box-shadow: 0 2px 2px -2px #0E1119;
    -moz-box-shadow: 0 2px 2px -2px #0E1119;
    box-shadow: 0 2px 2px -2px #0E1119;
  }

  .table__container {
    text-align: left;
    overflow: hidden;
    width: 80%;
    margin: 0 auto;
    display: table;
    padding: 0 0 8em 0;
  }

  .table__container td, .table__container th {
    padding-bottom: 2%;
    padding-top: 2%;
    padding-left:2%;
  }

  /* Background-color of the odd rows */
  .table__container tr:nth-child(odd) {
    background-color: #323C50;
  }

  /* Background-color of the even rows */
  .table__container tr:nth-child(even) {
    background-color: #2C3446;
  }

  .table__container th {
    background-color: #1F2739;
  }

  .table__container td:first-child { color: #FB667A; }

  .table__container tr:hover {
    background-color: #464A52;
    -webkit-box-shadow: 0 6px 6px -6px #0E1119;
    -moz-box-shadow: 0 6px 6px -6px #0E1119;
    box-shadow: 0 6px 6px -6px #0E1119;
  }

  @media (max-width: 800px) {
    .table__container td:nth-child(4),
    .table__container th:nth-child(4) { display: none; }
  }

  .checklists__block {}
  .table__title {
    text-align: center;
  }
  h3.table__title__text {}
</style>
