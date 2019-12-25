<template lang="pug">
    v-container(
        class="fill-height"
        fluid
    )
        v-row(
            align="center"
            justify="center"
        )
            v-col(
                cols="12"
                sm="8"
                md="4"
            )
                v-card(class="elevation-2 rounded-card" tile)
                    v-toolbar(
                        color="primary"
                        dark
                        flat
                    )
                        v-toolbar-title {{ list.name }}
                    v-card-text(class="px-6 pt-6 pb-0")
                            v-form
                                div(v-for="(question, i) in list.questions" :key="i")
                                    template(v-if="question.type === 'address-autocomplete'")
                                        header {{ question.text }}
                                        v-autocomplete(
                                            label="Components"
                                            :items="components"
                                        )
                                    template(v-else-if="question.type === 'textarea'")
                                        header {{ question.text }}
                                        v-textarea(
                                            solo
                                            label="Оставьте замечания..."
                                            class="mt-3"
                                            v-model="answers[question.id]"
                                        )
                                    template(v-else-if="question.type === 'radio'")
                                        header {{ question.text }}
                                        v-radio-group(v-model="answers[question.id]")
                                            v-radio(
                                                v-for="n in question.choices.split(';')"
                                                :key="n"
                                                :label="n"
                                                :value="n"
                                            )
                                    template(v-else-if="question.type === 'select-multiple'")
                                        header {{ question.text }}
                                        v-checkbox(v-model="answers[question.id]" label="John" value="John")
                                        v-checkbox(v-model="answers[question.id]" label="John2" value="John2")
                                        v-checkbox(v-model="answers[question.id]" label="John3" value="John3")
                                    template(v-else-if="question.type === 'select-image'")
                                        uploader(
                                            v-model="fileList"
                                            title="Загрузите фото"
                                            :autoUpload="false"
                                        )
                                    template(v-else)
                                        header {{ question.text }}
                                        v-text-field(
                                            v-model="answers[question.id]"
                                            label="Введите текст..."
                                        )

                    v-card-actions(class="justify-center px-6")
                        v-btn(class="ma-2" tile outlined color="primary") Очистить
                        v-btn(tile color="primary" @click="sendChecklist") Отправить
</template>

<script>
    import { ValidationObserver, ValidationProvider } from "vee-validate";
    import { mapGetters, mapActions } from "vuex";
    import Uploader from "../components/checklist/Uploader.vue";
    import types from "@/store/types"

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
            this.FETCH_CHECKLIST(this.$route.params.id);
        },
        computed: {
            ...mapGetters(["list", "error", "isLoading", "userProfile"])
        },
        methods: {
            ...mapActions([types.FETCH_CHECKLIST, types.SEND_CHECKLIST]),
            sendChecklist() {
                this.$store.commit('SET_ANSWERS', this.answers);
                this.SEND_CHECKLIST({
                    fileList: this.fileList,
                    userProfile: this.userProfile,
                    listId: this.$route.params.id
                });
            }
        }
    }
</script>