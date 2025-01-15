<template>
    <v-card>
        <v-app-bar color="primary" dark>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>Dr Mad</v-toolbar-title>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" absolute height="100dvh" temporary>
            <v-list dense nav>
                <v-list-item-group v-model="selectedItem" active-class="primary--text text--accent-4">
                    <template v-for="(link, index) in links">
                        <v-list-item
                            v-if="link.to"
                            :key="link.title"
                            :to="link.to"
                            :value="index"
                            class="d-flex align-center"
                            exact
                        >
                            <slot :link="link" name="link">
                                <v-list-item-icon>
                                    <v-icon>{{ link.icon }}</v-icon>
                                </v-list-item-icon>
                                <v-list-item-title>{{ link.title }}</v-list-item-title>
                            </slot>
                        </v-list-item>

                        <v-list-item
                            v-else
                            :key="index"
                            :value="index"
                            class="d-flex align-center"
                            @click="handleAction(link.action)"
                        >
                            <slot :link="link" name="link">
                                <v-list-item-icon>
                                    <v-icon>{{ link.icon }}</v-icon>
                                </v-list-item-icon>
                                <v-list-item-title>{{ link.title }}</v-list-item-title>
                            </slot>
                        </v-list-item>
                    </template>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
    </v-card>
</template>

<script>
import {mapActions} from "vuex";

export default {
    name: "NavBar",
    props: {
        links: {
            type: Array,
            required: true,
        }
    },
    data: () => ({
        drawer: false,
        selectedItem: null,
    }),
    methods: {
        ...mapActions('user', ['logout']),
        handleAction(action) {
            this[action]();
        }
    },
};
</script>
