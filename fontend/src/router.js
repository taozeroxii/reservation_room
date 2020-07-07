import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Register from './views/Register'
import Login from './views/Login'
import EquipmentList from './views/equipment/EquipmentList'
import EquipmentForm from './views/equipment/EquipmentForm'
import RoomList from './views/room/RoomList'
import RoomForm from './views/room/RoomForm'
import BookingRoomList from './views/booking/BookingRoomList'
import BookingHistoryList from './views/booking/BookingHistoryList'
import BookingCalendar from './views/booking/BookingCalendar'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', name: 'home', component: Home, meta: { auth: true } },
    //equipment
    { path: '/equipment', name: 'equipment-list', component: EquipmentList, meta: { auth: true }},
    { path: '/equipment/form', name: 'equipment-form', component: EquipmentForm, meta: { auth: true }},

    //room
    { path: '/room', name: 'room-list', component: RoomList, meta: { auth: true }},
    { path: '/room/form', name: 'room-form', component: RoomForm, meta: { auth: true }},
    
    //booking
    { path: '/booking/room', name: 'booking-room', component: BookingRoomList, meta: { auth: true }},
    { path: '/booking/history', name: 'booking-history', component: BookingHistoryList, meta: { auth: true }},
    { path: '/booking/calendar', name: 'booking-calendar', component: BookingCalendar, meta: { auth: true }},
    
    { path: '/register', name: 'register', component: Register },
    { path: '/login', name: 'login', component: Login }
  ]
})

// ตรวจสอบสิทธิการเข้าถึงหน้า
router.beforeEach((to, from, next) => {
  //console.log(to.meta);
  if (!to.meta.auth) return next();
  router.app.$store.dispatch('get_user_login')
    .then(() => { next(); })
    .catch(() => next({ name: 'login' }))
});



export default router;