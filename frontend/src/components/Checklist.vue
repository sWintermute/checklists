<template>
    <form @submit.prevent="sendChecklist">
        <div class="checklist__info__wrap">
            <div class="checklist__info">
                <div class="info__id">
                    <span class="info__id__text">Чеклист № {{list.id}}</span>
                </div>
                <div class="info__name">
                    <h2 class="info__name__text">{{list.name}}</h2>
                </div>
                <div class="info__description">
                    <p class="info__description__text">{{list.description}}</p>
                </div>
            </div>

            <fieldset v-for="question in list.questions">
                <div v-if="question.type === 'textarea'">
                    <label for="textarea">{{question.text}}</label>
                    <textarea :type="question.type" name="textarea" id="textarea" placeholder="Введите текст ..."></textarea>
                </div>
                <div v-else-if="question.type === 'radio'">
                    <legend>{{question.text}}</legend>
                    <div v-for="choice in question.choices.split(';')" v-model="answers[question.id]" v-bind="answers[question.id] = []">
                        <input type="radio" id="radio1" name="radios" :value="choice">
                        <label for="radio1">{{choice}}</label><br>
                    </div>
                </div>
                <div v-else-if="question.type === 'select-multiple'">
                    <legend>{{question.text}}</legend>
                    <div v-for="choice in question.choices.split(';')" v-model="answers[question.id]" v-bind="answers[question.id] = []">
                        <input type="checkbox" id="check1" name="checkboxes" :value="choice">
                        <label for="check1">{{choice}}</label><br>
                    </div>
                </div>
                <div v-else>
                    <label for="firstName">{{question.text}}</label>
                    <input v-model="answers[question.id]" :type="question.type" name="name" id="firstName" placeholder="Введите текст ...">
                </div>
            </fieldset>
            <!--
            <fieldset>
                <label for="select-choice">Transformers fan?</label>
                <select name="select-choice" id="select-choice">
                    <option value="Choice 1">- - select one - -</option>
                    <option value="Choice 2">Yes!</option>
                    <option value="Choice 3">They're kinda cool, yeah.</option>
                    <option value="Choice 4">Meh... not really.</option>
                    <option value="Choice 5">What's Transformers?</option>
                </select>
            </fieldset>
-->
            <button>Submit</button>
            {{list}}
            <br>
            {{answers}}
        </div>
    </form>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
    import axios from 'axios';

    export default {
        name: "checklist",
        data() {
            return {
                answers: {},
            }
        },
        created: function () {
            this.$store.dispatch('list', this.$route.params.id);
        },
        computed: {
            ...mapState(["list"])
        },
        methods: {
            sendChecklist() {
                this.$store.dispatch('change_list', this.$route.params.id, this.answers);
            }
        }
    }
/*

 */
</script>

<style lang="scss" scoped>
    @import url(https://fonts.googleapis.com/css?family=Roboto:400,300);


    form {
        max-width: 300px;
        background: #FFFFFF;
        padding: 10px 20px;
    }

    fieldset {
        margin: 0 0 1rem 0;
        padding: 0;
        border: none;
    }

    legend {
        font-weight: 400;
    }

    legend,
    label {
        display: inline-block;
        margin-bottom: .5rem;
    }

    input[type='text'],
    textarea,
    select {
        display: block;
        padding: .5rem;
        width: 100%;
        background-color: white;
        border-radius: .25rem;
        border: 1px solid #e5e5e5;
        outline: none;

        /* List some properties that might change */
        transition-property: none;
        transition-duration: inherit;

        &:focus {
            border-color: #2980B9;
        }
    }

    textarea {
        max-width: 300px;
        height: 100px;
    }

    input[type='text'],
    select {
        height: 34px;
    }

    select {
        font-size: .875rem;
    }

    input[type='checkbox'],
    input[type='radio'] {
        position: relative;
        top: 5px;
        width: 22px;
        height: 22px;
        margin: 0 .5rem;
        background-color: white;
        border: 1px solid #e5e5e5;
        outline: none;
        -moz-appearance: none;
        -webkit-appearance: none;

        /* List some properties that might change */
        transition-property: none;
        transition-duration: inherit;
    }

    input[type='checkbox'] {
        border-radius: 5px;

    &:checked {
         background-color: #2980B9;
         border: none;

    &:after {
         display: block;
         content: '';
         height: 8px;
         width: 10px;
         border-bottom: 3px solid #fff;
         border-left: 3px solid #fff;
         transform: translate(5px,6px) rotate(-45deg) scale(1);
     }
    }
    }

    input[type='radio'] {
        border-radius: 50%;
        &:checked {
             border-width: 5px;
             border-color: white;
             background-color: #2980B9;
         }
    }



    button {
        display: block;
        margin: 3em auto;
        padding: .5rem 2rem;
        font-size: 125%;
        color: white;
        border: none;
        border-radius: .25rem;
        background-color: #2980B9;
        outline: none;
        box-shadow: 0 .4rem .1rem -.3rem rgba(0,0,0,.1);

        /* We'll talk about this next */
        transform: perspective(300px) scale(.95) translateZ(0);
        transform-style: preserve-3d;

        /* List the properties that you're looking to transition.
           Try not to use 'all' */
        transition-property: none;

        /* This applies to all of the above properties */
        transition-duration: inherit;

    &:hover {
         cursor: pointer;
         background-color: #2980B9;
         box-shadow: 0 0 0 0 rgba(0,0,0,0);
         transform: scale(1.1) rotateX(0);
     }

    &:active {
         background-color: #2980B9;
         transform: scale(1.05) rotateX(-10deg);
     }
    }
</style>