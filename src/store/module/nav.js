export default {
    namespaced: true,
    state: () => ({
        links: [],
    }),
    mutations: {
        updateNavItems(state, links) {
            state.links = links
        },
    },
    actions: {
        async getNavItems({commit, rootState}) {
            let navItem = [];

            if (rootState.shop.shopUser) {
                navItem.push(
                    {
                        text: 'Acheter',
                        pathName: 'buy',
                    },
                    {
                        text: 'Payer',
                        pathName: 'pay',
                    },
                    {
                        text: 'Mes commandes',
                        pathName: 'myorders',
                    }
                );
            } else {
                navItem.push(
                    {
                        text: 'Login',
                        pathName: 'shoplogin',
                    }
                );
            }

            commit('updateNavItems', navItem);
        }
    }
}