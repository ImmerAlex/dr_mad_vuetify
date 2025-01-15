import UserService from "@/services/user.service";
import OrdersService from "@/services/orders.service";

export default {
    namespaced: true,
    state: () => ({
        loggedUser: null,
        userOrders: null,
        orderError: null,
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
        UPDATE_ORDERS(state, order) {
            let orderIndex = state.userOrders.findIndex(o => o.uuid === order.uuid);

            if (orderIndex !== -1) {
                state.userOrders[orderIndex] = order;
            } else {
                state.userOrders.push(order);
            }
        },
        SET_ORDER_ERROR(state, error) {
            state.orderError = error;
        },
    },
    actions: {
        async addOrder({commit}, data) {
            commit('UPDATE_ORDERS', data);
        },
        async makePayment({commit}, {userId, orderUuid, transactionUuid}) {
            const response = await OrdersService.payOrder(userId, orderUuid, transactionUuid);

            if (response.error === 0) {
                commit('UPDATE_ORDERS', response.data);
                commit('SET_ORDER_ERROR', {error: response.error, message: 'Le paiement a été effectué avec succès'});
            } else {
                commit('SET_ORDER_ERROR', {error: response.error, message: response.data});
            }
        },
        async fetchOrders({commit}, data) {
            let response = await OrdersService.getUserOrders(data);

            if (response.error === 0) {
                commit('SET_ORDER', response.data);
            } else {
                console.log('Error fetching orders');
            }
        },
        async loginUser({commit, dispatch}, data) {
            let response = await UserService.loginUser(data);

            if (response.error === 0) {
                commit('SET_USER', response.data);
                dispatch('fetchOrders', response.data._id);
            } else {
                console.log('Error logging in');
            }
        },
        logout({commit}) {
            commit('CLEAR_USER');
        },

    },
    getters: {
        isLoggedUser: (state) => state.loggedUser !== null,
        loggedUser: (state) => state.loggedUser,
        userOrders: (state) => state.userOrders,
        orderError: (state) => state.orderError,
    },
};
