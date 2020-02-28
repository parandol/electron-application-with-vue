import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
    routes: [
        {
            path: '/',
            name: 'main-page',
            meta: {
                title : "TCP Socket Router"
            },
            component: require('@/views/MainPage').default
        },
        {
            path: "/preferences",
            name: "preferences-page",
            meta: {
                layout: "dialog",
                title : "Preferences"
            },
            component: require("@/views/Preperences").default
        },
        {
            path: '/landing',
            name: 'landing-page',
            component: require('@/components/LandingPage').default
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    next()
})

export default router;
