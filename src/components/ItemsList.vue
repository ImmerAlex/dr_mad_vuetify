<template>
    <div class="d-flex flex-column gap-3">
        <div class="d-flex flex-column gap-2">
            <h3>Filtres</h3>

            <div class="d-flex flex-column">
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="filterpriceactive" v-model="prizeFilterActive">
                    <label for="filterpriceactive" class="form-check-label">Prix min</label>
                </div>

                <div v-if="prizeFilterActive">
                    <input type="number" id="filterprice" class="form-control" v-model="prizeFilter">
                </div>
            </div>

            <div class="d-flex flex-column">
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="filternameactive" v-model="nameFilterActive">
                    <label for="filternameactive" class="form-check-label">Nom contient</label>
                </div>

                <div v-if="nameFilterActive">
                    <input id="filtername" class="form-control" v-model="nameFilter">
                </div>
            </div>

            <div class="d-flex flex-column">
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="filterstockactive" v-model="stockFilterActive">
                    <label for="filterstockactive" class="form-check-label">En stock</label>
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
                    <th>button</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(item, index) in items" :key="index" class="item-row">
                    <td>
                        <input type="checkbox" class="item-checkbox">
                    </td>
                    <td>{{item.name}}</td>
                    <td>{{item.stock}}</td>
                    <td>{{item.price}}</td>
                    <td>
                        <input type="number" class="form-control" :max="item.stock" min="0" value="0">
                    </td>
                    <td>
                        <button class="btn btn-primary" @click="addSelected(index)">Ajouter</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

// TODO: add filters
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
        }
    },
}
</script>
