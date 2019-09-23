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
                        <v-toolbar-title class="">Чеклист №{{ list.id }}</v-toolbar-title>
                        <div class="flex-grow-1"></div>
                    </v-toolbar>
                    <v-card-text class="px-6 pt-6 pb-0">
                        <ValidationObserver v-slot="{ passes }">
                            <form>
                                <ValidationProvider name="email" rules="required|email" v-slot="{ errors }" v-for='question in list.questions'>
                                    <template v-if="question.type === 'textarea'"></template>
                                    <template v-else-if="question.type === 'radio'"></template>
                                    <template v-else-if="question.type === 'select-multiple'"></template>
                                    <template v-else-if="question.type === 'select-image'"></template>
                                    <template v-else>
                                        <v-text-field
                                                label="Regular"
                                        ></v-text-field>
                                    </template>
                                </ValidationProvider>
                            </form>
                            <div v-if="errors" class="subtitle1 text-center red--text">
                                <p v-for="(errorMessage, i) in errors" :key="i">{{ errorMessage[0] }}</p>
                            </div>
                        </ValidationObserver>
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
    import { mapState, mapGetters } from 'vuex';
    import Uploader from "../components/checklist/Uploader.vue";

    export default {
        name: "checklist",
        components: {
            Uploader,
            ValidationObserver,
            ValidationProvider
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
            ...mapState(["list"]),
            ...mapGetters(['errors'])
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

<style scoped>
</style>