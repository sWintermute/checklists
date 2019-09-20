<template lang="pug">
    form(@submit.prevent='sendChecklist')
        .checklist__info__wrap
            .checklist__info
                .info__id
                    span.info__id__text &CHcy;&iecy;&kcy;&lcy;&icy;&scy;&tcy; &numero; {{list.id}}
                .info__name
                    h2.info__name__text {{list.name}}
                .info__description
                    p.info__description__text {{list.description}}
            fieldset(v-for='question in list.questions')
                div(v-if="question.type === 'textarea'")
                    label(for='textarea') {{question.text}}
                    textarea#textarea(
                        :type='question.type'
                        v-model='answers[question.id]'
                        name='textarea'
                        placeholder='Введите текст ...'
                        )
                div(v-else-if="question.type === 'radio'")
                    legend {{question.text}}
                    div(v-for="choice in question.choices.split(';')")
                        input#radio1(
                            type='radio'
                            :value='choice'
                            v-model='answers[question.id]'
                        )
                        label(for='radio1') {{choice}}
                        br
                div(v-else-if="question.type === 'select-multiple'")
                    legend {{question.text}}
                    div(v-for="(choice, id) in question.choices.split(';')")
                        input(
                            type='checkbox'
                            :id="'check'+ id"
                            :value="choice"
                            @change="foo($event.target.value, question.id)"
                        )
                        label(:for="'check'+ id") {{choice}}
                        br
                div(v-else-if="question.type === 'select-image'")
                    template
                        uploader(
                            v-model="fileList"
                            title="Загрузите фото"
                            :autoUpload="false"
                        )
                    br
                div(v-else='')
                    label(for='firstName') {{question.text}}
                    input#firstName(
                        v-model='answers[question.id]'
                        :type='question.type'
                        name='name'
                        placeholder='Введите текст ...'
                        required
                        )
            button(type="submit") Отправить
</template>

<script>
    import { mapState } from 'vuex';
    import Uploader from "../components/checklist/Uploader.vue";

    export default {
        name: "checklist",
        components: {
            Uploader
        },
        data() {
            return {
                test: [],
                fileList: [],
                answers: {},
                choices: {},
                toggleChecked: false,
            }
        },
        created: function () {
            this.$store.dispatch('list', this.$route.params.id);
        },
        computed: {
            ...mapState(["list"])
        },
        methods: {
            foo(value, id) {
                if (!!this.answers[id]) {
                    ~this.answers[id].indexOf(value) ?
                        this.answers[id].splice(this.answers[id].indexOf(value), 1):
                        this.answers[id].push(value);
                } else {
                    this.answers[id] = [];
                    this.answers[id].push(value);
                }
                // Array.isArray(this.answers[id]) ? this.answers[id].split(";"): this.answers[id].join(";");
            },
            sendChecklist() {
                this.$store.commit('SET_ANSWERS', this.answers);
                this.$store.dispatch('create_list', {
                    fileList: this.fileList,
                    listId: this.$route.params.id
                });
            }
        }
    }
</script>

<style lang="sass" scoped>
</style>