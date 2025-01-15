<template>
    <v-dialog v-model="showNavModal" max-width="500px">
        <v-card>
            <v-card-title class="text-h5">
                <slot name="header" />
            </v-card-title>

            <v-card-text class="d-flex flex-column gap-3">
                <slot name="content" />
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <slot name="actions" />

                <v-btn color="grey darken-1" class="text-white" @click="closeNavModal">fermer</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "ModalComponent",
    data: () => ({
        showNavModal: false,
    }),
    methods: {
        openNavModal() {
            this.showNavModal = true;
        },
        closeNavModal() {
            this.showNavModal = false;
        },
    }
};
</script>

<style scoped>

</style>