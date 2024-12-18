<template>
  <div class="d-flex flex-column-reverse flex-md-row align-items-start justify-content-between">

    <ItemsList :items="viruses" style="width: 55%;"/>

    <BasketList :cart="cart" style="width: 40%; border: 1px solid black; padding: 10px; min-height: 200px"/>

  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import ItemsList from "@/components/ItemsList.vue";
import BasketList from "@/components/BasketList.vue";

export default {
  name: "ShopBuy",
  components: { ItemsList, BasketList },
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
