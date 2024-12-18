<template>
    <div>
        {{cart}}
    </div>
</template>

<script>
export default {
    name: "BasketList",
    props: {
        cart: {
            type: Array,
            required: true
        }
    },
}
</script>