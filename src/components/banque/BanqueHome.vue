<template>
    <div>
        <p>Bienvenue dans la banque</p>
        <p>Pour accéder à votre compte, veuillez vous connecter</p>
        <v-btn color="primary" :to="{name: 'bankLogin'}">Connexion</v-btn>
    </div>
</template>

<script>
export default {
    name: "MainBank",
};
</script>

