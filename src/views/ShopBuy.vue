<template>
  <div class="containerBuy">

    <ItemsList class="itemList" :items="viruses"/>

    <BasketList class="basketList" :cart="cart"/>

  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import ItemsList from "@/components/ItemsList.vue";
import BasketList from "@/components/BasketList.vue";

export default {
  name: "ShopBuy",
  components: {ItemsList, BasketList},
  computed: {
    ...mapState("shop", ["viruses", "cart"]),
  },
  methods: {
    ...mapActions("shop", ["getAllViruses"]),
  },
  mounted() {
    this.getAllViruses();
  },
};
</script>

<style scoped>
/*
 class="d-flex flex-column-reverse flex-md-row align-items-start justify-content-between"
*/
.containerBuy {
    display: flex;
    align-items: flex-start;
    gap: 30px;
}

.itemList {
    width: 100%;
}

.basketList {
    width: 100%;
    min-height: 200px;
}

@media (max-width: 768px) {
    .containerBuy {
        flex-direction: column-reverse;
        margin: 0 30px;
    }
}

</style>
