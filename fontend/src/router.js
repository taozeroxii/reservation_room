import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Register from './views/Register'
import PageNotFound from './views/PageNotFound'
import Login from './views/Login'
import EquipmentList from './views/equipment/EquipmentList'
import EquipmentForm from './views/equipment/EquipmentForm'
import RoomList from './views/room/RoomList'
import RoomForm from './views/room/RoomForm'
import BookingRoomList from './views/booking/BookingRoomList'
import BookingHistoryList from './views/booking/BookingHistoryList'
import BookingCalendar from './views/booking/BookingCalendar'
import BookinkManageList from './views/booking/BookinkManageList'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', name: 'home', component: Home, meta: { auth: true } },
    //equipment
    { path: '/equipment', name: 'equipment-list', component: EquipmentList, meta: { auth:['admin'] }},
    { path: '/equipment/form', name: 'equipment-form', component: EquipmentForm, meta: { auth:['admin'] }},

    //room
    { path: '/room', name: 'room-list', component: RoomList, meta: { auth:['admin'] }},
    { path: '/room/form', name: 'room-form', component: RoomForm, meta: {  auth:['admin'] }},
    
    //booking
    { path: '/booking/room', name: 'booking-room', component: BookingRoomList, meta: { auth: true }},
    { path: '/booking/history', name: 'booking-history', component: BookingHistoryList, meta: { auth: true }},
    { path: '/booking/calendar', name: 'booking-calendar', component: BookingCalendar, meta: { auth: true }},
    { path: '/booking/manage', name: 'booking-manage', component: BookinkManageList, meta: { auth:['admin'] }},
    
    { path: '/register', name: 'register', component: Register },
    { path: '/about', name: 'about', component: About },
    { path: '/login', name: 'login', component: Login },

    { path: "*", component: PageNotFound }
  ]
})



// ตรวจสอบสิทธิการเข้าถึงหน้า
router.beforeEach((to, from, next) => {
  //console.log(to.meta);
  const auth =  to.meta.auth;
  if (!auth) return next();
  router.app.$store.dispatch('get_user_login')
    .then(() => { 
      //console.log(router.app.$store.state.user); //เช็คค่าที่เก็บลง store หลังจาก login
      //console.log(userLogin,Array.isArray(auth))// เช็คว่าค่าที่ส่งมาเป็น อาเรย์ไหมจาก router หากใช่จะเท่ากับว่ามีการเช็คสิทธืการเข้าถึงหากไม่เข้าได้เลย
      if(!Array.isArray(auth))return next(); 
      const userLogin = router.app.$store.state.user;
      if(auth.indexOf(userLogin.u_role) >=0 )return next()
    })
    .catch(() => next({ name: 'login' }))
});



export default router;