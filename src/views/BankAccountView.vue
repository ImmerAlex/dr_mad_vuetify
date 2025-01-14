<template>
    <div>
        <v-dialog v-model="showNavModal" max-width="500px">
            <v-card>
                <v-card-title class="text-h5">
                    Navigation
                </v-card-title>

                <v-card-text class="d-flex flex-column gap-3">

                    <router-link :to="{name: 'bankSolde'}" class="link">
                        <v-btn color="primary" class="w-100" @click="closeNavModal">solde</v-btn>
                    </router-link>


                    <router-link :to="{name: 'bankVirement'}" class="link">
                        <v-btn color="success" class="w-100" @click="closeNavModal">virement</v-btn>
                    </router-link>


                    <router-link :to="{name: 'bankTransactions'}" class="link">
                        <v-btn color="warning" class="w-100" @click="closeNavModal">historique</v-btn>
                    </router-link>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="logoutBankAccount">deconnexion</v-btn>
                    <v-btn color="grey darken-1" @click="closeNavModal">fermer</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <div class="d-flex justify-space-between">
            <h3>Account</h3>

            <div id="burger" :class="showNavModal === true ? 'active' : ''" @click="openNavModal">
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

export default {
    name: "BankAccountView",
    data: () => ({
        showNavModal: false,
    }),
    methods: {
        ...mapActions('bank', ['logoutBankAccount']),
        ...mapGetters('bank', ['isLoggedBankAccount']),
        openNavModal() {
            this.showNavModal = true;
        },
        closeNavModal() {
            this.showNavModal = false;
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