<template>
  <div class="d-flex flex-column gap-3">
    <h1>Login</h1>
    <router-view name="shoplogin"></router-view>

    <div class="mb-3">
      <label class="form-label" for="login">Username</label>
      <input id="login" v-model="login" class="form-control" type="text">
    </div>

    <div class="mb-3">
      <label class="form-label" for="password">Password</label>
      <input id="password" v-model="password" class="form-control" type="password">
    </div>

    <button class="btn btn-primary" @click="loginUser({login, password})">Login</button>

    <table v-if="loggedUser" class="table table-striped">
      <thead>
      <tr>
        <th>id</th>
        <th>name</th>
        <th>login</th>
        <th>email</th>
        <th>session</th>
      </tr>
      </thead>

      <tbody>
      <tr>
        <td>{{ loggedUser._id }}</td>
        <td>{{ loggedUser.name }}</td>
        <td>{{ loggedUser.login }}</td>
        <td>{{ loggedUser.email }}</td>
        <td>{{ loggedUser.session }}</td>
      </tr>
      </tbody>
    </table>
  </div>

</template>

<script>

import {mapActions, mapState} from 'vuex'

export default {
  name: 'ShopLoginView',
  data: () => ({
    login: '',
    password: '',
  }),
  computed: {
    ...mapState('user', ['loggedUser']),
  },
  methods: {
    ...mapActions('user', ['loginUser']),
  }
}
</script>
