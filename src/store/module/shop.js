import ShopService from "@/services/shop.service";

export default {
  namespaced: true,
  // state = les données centralisées
  state: () => ({
    viruses: [],
    cart: [],
  }),
  // mutations = fonctions synchrones pour mettre à jour le state (!!! interdit de modifier directement le state)
  mutations: {
    updateViruses(state, viruses) {
      state.viruses = viruses;
    },
    addToCart(state, virus) {
      let virusInCart = state.cart.find((item) => item.id === virus._id);
      if (virusInCart) {
        
        if (virusInCart.quantity === virus.stock) {
          throw new Error("Limite de stock atteinte");
        }

        virusInCart.quantity++;
      } else {
        state.cart.push({ id: virus._id, name: virus.name, price: virus.price, quantity: 1 });
      }
    },
  },
  // actions = fonctions asynchrone pour mettre à jour le state, en faisant appel aux mutations, via la fonction commit()
  actions: {
    async getAllViruses({ commit }) {
      console.log("récupération des viruses");
      let response = await ShopService.getAllViruses();
      if (response.error === 0) {
        commit("updateViruses", response.data);
      } else {
        console.log(response.data);
      }
    },
    addVirusToCart({ commit }, virus) {
      return commit("addToCart", virus);
    },
  },
};
