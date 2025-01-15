<template>
    <div>
        <ModalComponent ref="modalComponent">
            <template v-slot:header>
                Navigation
            </template>

            <template v-slot:content>
                <router-link :to="{name: 'bankSolde'}" class="link">
                    <v-btn color="primary" class="w-100" @click="handleCloseNavModal">solde</v-btn>
                </router-link>

                <router-link :to="{name: 'bankVirement'}" class="link">
                    <v-btn color="success" class="w-100" @click="handleCloseNavModal">virement</v-btn>
                </router-link>

                <router-link :to="{name: 'bankTransactions'}" class="link">
                    <v-btn color="warning" class="w-100" @click="handleCloseNavModal">historique</v-btn>
                </router-link>
            </template>

            <template v-slot:actions>
                <v-btn color="error" @click="logoutBankAccount">deconnexion</v-btn>
            </template>
        </ModalComponent>

        <div class="d-flex justify-space-between">
            <h3>Account</h3>

            <div id="burger" @click="handleOpenNavModal">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>

        <router-view/>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import ModalComponent from "@/components/ModalComponent.vue";

export default {
    name: "BankAccountView",
    components: {ModalComponent},
    methods: {
        ...mapActions('bank', ['logoutBankAccount']),
        ...mapGetters('bank', ['isLoggedBankAccount']),
        handleOpenNavModal() {
            this.$refs.modalComponent.openNavModal();
        },
        handleCloseNavModal() {
            this.$refs.modalComponent.closeNavModal();
        },
    },
    created() {
        if (!this.isLoggedBankAccount()) {
            this.$router.push({name: 'bankLogin'});
        }
    }
};
</script>

<style scoped>
#burger {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 30px;
    position: relative;
    cursor: pointer;
}

#burger span {
    display: block;
    width: 100%;
    height: 3px;
    background: black;
    border-radius: 10px;
    transition: all 0.3s;
}

#burger span:nth-child(1) {
    transform-origin: 0 0;
}

#burger span:nth-child(3) {
    transform-origin: 0 100%;
}

#burger.active span:nth-child(1) {
    transform: rotate(45deg);
}

#burger.active span:nth-child(2) {
    opacity: 0;
}

#burger.active span:nth-child(3) {
    transform: rotate(-45deg);
}

.link {
    color: white;
    text-decoration: none;
}
</style>