import UserService from "@/services/user.service";
import OrdersService from "@/services/orders.service";

export default {
  namespaced: true,
  state: () => ({
    loggedUser: null,
    userOrders: null,
  }),
  mutations: {
    SET_USER(state, user) {
      state.loggedUser = user;
    },
    SET_ORDER(state, orders) {
      state.userOrders = orders;
    },
    CLEAR_USER(state) {
      state.loggedUser = null;
    },
  },
  actions: {
    async fetchOrders({ commit }, data) {
      let response = await OrdersService.getUserOrders(data);

      if (response.error === 0) {
        commit('SET_ORDER', response.data);
      } else {
        console.log(response.data)
      }
    },
    async loginUser({ commit,dispatch }, data) {
      let response = await UserService.loginUser(data);

      if (response.error === 0) {
        commit('SET_USER', response.data);
        dispatch('fetchOrders', response.data._id);
      } else {
        console.log(response.data)
      }
    },
    logout({ commit }) {
      commit('CLEAR_USER');
    },

  },
  getters: {
    isLoggedUser: (state) => state.loggedUser !== null,
    loggedUser: (state) => state.loggedUser,
    userOrders: (state) => state.userOrders,
  },
};
