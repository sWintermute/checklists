<template lang="pug">
  .checklists__block
    .table__title
      h3.table__title__text &CHcy;&iecy;&kcy;-&lcy;&icy;&scy;&tcy;&ycy;
    table.table__container
      thead
        tr
          th
            h1 № п/п
          th
            h1 Параметры
          th
            h1 Примечание
      tbody
        tr(v-for='list in lists')
          td
            a(:href="'checklist/' + list.id") Чек-лист № {{list.id}}
          td {{ list.name }}
          td {{ list.description }}
    |     {{lists}}
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


<style lang="sass">
  @import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,700)

  body
    font-family: 'Open Sans', sans-serif
    font-weight: 300
    line-height: 1.42em
    color: #A7A1AE
    background-color: #1F2739

  h1
    font-size: 3em
    font-weight: 300
    line-height: 1em
    text-align: center
    color: #4DC3FA

  h2
    font-size: 1.5em
    font-weight: 300
    text-align: center
    display: block
    line-height: 1em
    padding-bottom: 0.4em
    color: #000000
    a
      font-weight: 700
      text-transform: uppercase
      color: #FB667A
      text-decoration: none

  .table__container
    th h1
      font-weight: bold
      font-size: 1em
      text-align: center
      color: #185875
    tr td a
      font-weight: bold
      font-size: 1em
      text-align: center
      color: #185875
      &:hover
        text-decoration: underline
    td
      font-weight: normal
      font-size: 1em
      -webkit-box-shadow: 0 2px 2px -2px #0E1119
      -moz-box-shadow: 0 2px 2px -2px #0E1119
      box-shadow: 0 2px 2px -2px #0E1119
      padding-bottom: 2%
      padding-top: 2%
      padding-left: 2%
    text-align: left
    overflow: hidden
    width: 80%
    margin: 0 auto
    display: table
    padding: 0 0 8em 0
    th
      padding-bottom: 2%
      padding-top: 2%
      padding-left: 2%
    tr
      &:nth-child(odd)
        background-color: #323C50
      &:nth-child(even)
        background-color: #2C3446
    th
      background-color: #1F2739
    td:first-child
      color: #FB667A
    tr:hover
      background-color: #464A52
      -webkit-box-shadow: 0 6px 6px -6px #0E1119
      -moz-box-shadow: 0 6px 6px -6px #0E1119
      box-shadow: 0 6px 6px -6px #0E1119

  /* Background-color of the odd rows

  /* Background-color of the even rows

  @media (max-width: 800px)
    .table__container
      td:nth-child(4), th:nth-child(4)
        display: none

  .checklists__block

  .table__title
    text-align: center

  h3.table__title__text
</style>
