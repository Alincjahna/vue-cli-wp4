<template>
    <h2>{{title}}</h2>
    <!-- <router-view/> -->
</template>

<script >
import { test } from '../../utils/test'
export default {
    name: 'index',
    data() {
        return {
            title: 'This is a Index!22333444444444'
        }
    },
    mounted() {
        test('222222')
        console.log('4444444444', '')
    }
}
</script>

<style lang="stylus" scoped>
.common
    line-height 30px
</style>
