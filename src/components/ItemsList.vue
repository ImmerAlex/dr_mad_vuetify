<template>
  <div class="d-flex flex-column gap-3">
    <div class="d-flex flex-column gap-2">
      <h3>Filtres</h3>

      <div class="d-flex flex-column">
        <div class="form-check">
          <input id="filterpriceactive" v-model="prizeFilterActive" class="form-check-input" type="checkbox">
          <label class="form-check-label" for="filterpriceactive">Prix min</label>
        </div>

        <div v-if="prizeFilterActive">
          <input id="filterprice" v-model="prizeFilter" class="form-control" type="number">
        </div>
      </div>

      <div class="d-flex flex-column">
        <div class="form-check">
          <input id="filternameactive" v-model="nameFilterActive" class="form-check-input" type="checkbox">
          <label class="form-check-label" for="filternameactive">Nom contient</label>
        </div>

        <div v-if="nameFilterActive">
          <input id="filtername" v-model="nameFilter" class="form-control">
        </div>
      </div>

      <div class="d-flex flex-column">
        <div class="form-check">
          <input id="filterstockactive" v-model="stockFilterActive" class="form-check-input" type="checkbox">
          <label class="form-check-label" for="filterstockactive">En stock</label>
        </div>
      </div>
    </div>

    <p v-if="error" style="color: red;">{{ error }}</p>

    <button class="btn btn-success" @click="addAllSelected">Ajouter tout</button>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>
            <input type="checkbox" @click="toggleAll">
          </th>
          <th>name</th>
          <th>stock</th>
          <th>price</th>
          <th>number</th>
          <th>promotion</th>
          <th>button</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in filterItems()" :key="index" class="item-row">
          <td>
            <input class="item-checkbox" type="checkbox">
          </td>
          <td>{{ item.name }}</td>
          <td>{{ item.stock }}</td>
          <td>{{ item.price }}</td>
          <td>
            <input :max="item.stock" class="form-control" min="0" type="number" value="0">
          </td>
          <td v-if="item.promotion.length>0">
            <span v-for="(promo, i) in item.promotion" :key="i">
              <b>{{ promo.discount }}%</b> pour <i><b>{{ promo.amount }}</b></i> achetés <br/><br/>
            </span>
          </td>
          <td v-else>Aucune Promotion</td>
          <td>
            <button class="btn btn-primary" @click="addSelected(index)">Ajouter</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';

  export default {
    name: "ItemsList",
    data: () => ({
      error: null,
      selected: [],
      prizeFilter: 0,
      nameFilter: '',
      prizeFilterActive: false,
      nameFilterActive: false,
      stockFilterActive: false,
      cart: []
    }),
    props: {
      items: {
        type: Array,
        required: true
      }
    },
    methods: {
      ...mapActions('shop', ['addVirusToCart']),
      toggleAll() {
        const checkboxes = document.querySelectorAll('.item-checkbox');
        checkboxes.forEach(checkbox => {
          checkbox.checked = !checkbox.checked;
        });
      },
      addAllSelected() {
        const checkboxes = document.querySelectorAll('.item-checkbox');
        checkboxes.forEach((checkbox, index) => {
          if (checkbox.checked) {
            this.addSelected(index);
          }
        });
      },
      async addSelected(index) {
        const row = document.querySelectorAll('.item-row')[index];
        const wanted_nb = parseInt(row.querySelector('input[type="number"]').value);
        const stock = parseInt(row.querySelector('td:nth-child(3)').textContent);

        if (wanted_nb === 0) {
          this.error = "Vous devez commander au moins un virus";
          return;
        } else {
          this.error = null;
        }

        if (wanted_nb > stock) {
          this.error = "Vous ne pouvez pas commander plus que ce qui est en stock";
          return;
        } else {
          this.error = null;
        }

        const virus = this.items[index];

        for (let i = 0; i < wanted_nb; i++) {
          try {
            await this.addVirusToCart(virus);
          } catch (e) {
            this.error = e.message;
            return;
          }
        }
      },
      filterItems() {
        return this.items.filter(item => {
          if (this.prizeFilterActive && item.price < this.prizeFilter) {
            return false;
          }

          if (this.nameFilterActive && !item.name.includes(this.nameFilter)) {
            return false;
          }

          if (this.stockFilterActive && item.stock === 0) {
            return false;
          }
          return true;
        });
      }
    },
  }
</script>
