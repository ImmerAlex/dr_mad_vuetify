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
        SET_ORDER_STATUS_BY_ID(state, {id, status}) {
            if (state.userOrders) {
                const order = state.userOrders.find(o => o.uuid === id)
                if (order) {
                    order.status = status
                }
            }
        },
        SET_ORDER_ERROR(state, error) {
            state.orderError = error;
        },
    },
    actions: {
        async makePayment({commit}, {userId, orderUUID, transId, accountNumber}) {
            let response = await OrdersService.payOrder(userId, orderUUID, transId, accountNumber);

            if (response.error === 0) {
                commit('SET_ORDER_STATUS_BY_ID', {id: response.data.uuid, status: 'finalized'});
                commit('SET_ORDER_ERROR', {error: 0, message: "Paiement effectué"});
            } else {
                commit('SET_ORDER_ERROR', {error: -1, message: response.data});
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
    },
};
