import UserService from "@/services/user.service";

export default {
    namespaced: true,
    state: () => ({
        loggedUser: null,
    }),
    mutations: {
        SET_USER(state, user) {
            state.loggedUser = user;
        },
        CLEAR_USER(state) {
            state.loggedUser = null;
        },
    },
    actions: {
        async loginUser({ commit }, data) {
            let response = await UserService.loginUser(data);

            if (response.error === 0) {
                commit('SET_USER', response.data);
            } else {
                console.log(response.data)
            }
        },
        logout({ commit }) {
            commit('CLEAR_USER');
        },
    },
    getters: {
        isLogged: (state) => state.loggedUser !== null,
        loggedUser: (state) => state.loggedUser,
    },
};