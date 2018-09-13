import Vue from 'vue'
import Router from 'vue-router'
// import Header from '@/components/header'
import Index from '@/pages/index/index'
import Person from '@/pages/person/person'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Index',
            component: Index
        },
        {
            path: '/person',
            name: 'Person',
            component: Person
        }
    ]
})
