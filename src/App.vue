<template>
    <div id="app">
        <img src="./asset/logo.png">
        <div><img src="./asset/images/007.jpg" alt=""></div>
        <ul>
            <li>11</li>
        </ul>
        <router-link to="/">Go to Index</router-link>
        <router-link to="/person">Go to Person</router-link>
        <router-view/>
    </div>
</template>

<script >
export default {
    name: 'App'
}
</script>

<style lang="stylus" scoped>
#app
    font-size 24px
    box-sizing border-box
</style>
