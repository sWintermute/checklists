<template>
    <v-container
            class="fill-height"
            fluid
    >
        <v-row
                align="center"
                justify="center"
        >
            <v-col
                    cols="12"
                    sm="8"
                    md="4"
            >
                <v-card class="elevation-2 rounded-card" tile>
                    <v-toolbar
                            color="primary"
                            dark
                            flat
                    >
                        <v-toolbar-title>{{ list.name }}</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text class="px-6 pt-6 pb-0">
                            <form>
                                <div v-for="(question, i) in list.questions" :key="i">
                                    <template v-if="question.type === 'textarea'">
                                        <header>{{ question.text }}</header>
                                        <v-textarea
                                                solo
                                                label="Оставьте замечания..."
                                                class="mt-3"
                                                v-model="answers[question.id]"
                                        ></v-textarea>
                                    </template>
                                    <template v-else-if="question.type === 'radio'">
                                        <header>{{ question.text }}</header>
                                        <v-radio-group v-model="answers[question.id]">
                                            <v-radio
                                                    v-for="n in question.choices.split(';')"
                                                    :key="n"
                                                    :label="n"
                                                    :value="n"
                                            ></v-radio>
                                        </v-radio-group>
                                    </template>
                                    <template v-else-if="question.type === 'select-multiple'">
                                        <header>{{ question.text }}</header>
                                        <v-checkbox v-model="answers[question.id]" label="John" value="John"></v-checkbox>
                                        <v-checkbox v-model="answers[question.id]" label="John2" value="John2"></v-checkbox>
                                        <v-checkbox v-model="answers[question.id]" label="John3" value="John3"></v-checkbox>
                                    </template>
                                    <template v-else-if="question.type === 'select-image'">
                                        <uploader
                                                v-model="fileList"
                                                title="Загрузите фото"
                                                :autoUpload="false"
                                        ></uploader>
                                    </template>
                                    <template v-else>
                                        <header>{{ question.text }}</header>
                                        <v-text-field
                                                v-model="answers[question.id]"
                                                label="Введите текст..."
                                        ></v-text-field>
                                    </template>
                                </div>
                            </form>
                    </v-card-text>
                    <v-card-actions class="justify-center px-6">
                        <v-btn class="ma-2" tile outlined color="primary">Очистить</v-btn>
                        <v-btn tile color="primary" @click="sendChecklist">Отправить</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { ValidationObserver, ValidationProvider } from "vee-validate";
    import { mapGetters, mapActions } from "vuex";
    import Uploader from "../components/checklist/Uploader.vue";
    import types from "@/store/types/checklists.js"

    export default {
        name: "Checklist",
        components: {
            Uploader,
            ValidationObserver,
            ValidationProvider
        },
        data: () => ({
            test: [],
            fileList: [],
            answers: {},
            choices: {},
            toggleChecked: false
        }),
        created() {
            this.FETCH_CHECKLIST();
        },
        computed: {
            ...mapGetters(["list", "errors", "isLoading"])
        },
        methods: {
            ...mapActions([types.FETCH_CHECKLIST]),
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