<template lang="pug">
    v-row(no-gutters)
        component(:is="component" :data="data" v-if="component")
</template>

<script>
const components = {
    addressAutocomplete: () => import('./templates/address-autocomplete'),
    integer: () => import('./templates/integer'),
    phoneNumber: () => import('./templates/phone-number'),
    radio: () => import('./templates/radio'),
    select: () => import('./templates/select'),
    selectImage: () => import('./templates/select-image'),
    selectMultiple: () => import('./templates/select-multiple'),
    text: () => import('./templates/text'),
    textarea: () => import('./templates/textarea')
}
// const addressAutocomplete = () => import('./templates/address-autocomplete')
// const integer = () => import('./templates/integer')
// const phoneNumber = () => import('./templates/phone-number')
// const radio = () => import('./templates/radio')
// const select = () => import('./templates/select')
// const selectImage = () => import('./templates/select-image')
// const selectMultiple = () => import('./templates/select-multiple')
// const text = () => import('./templates/text')
// const textarea = () => import('./templates/textarea')

export default {
    name: 'dynamic-link',
    props: ['data', 'type'],
    data: () => ({
        components
    }),
    computed: {
        loader() {
            if (!this.type) return null;
            return () => import(`./templates/${this.type}`);
        },
    },
    mounted() {
        this.loader()
            .then(() => {
                this.component = () => this.loader();
            })
            .catch(() => {
                this.component = () => import('./templates/default');
            });
    },
}
</script>