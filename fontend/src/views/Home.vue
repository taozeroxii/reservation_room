<template>

</template>


<script>
import Layout from "../components/layout.vue";
export default {
  name: "home",
  components: {
    Layout
  },
  created(){
    const userLogin = this.$store.state.user;
    //console.log(userLogin)
    if(userLogin.u_role === 'admin')this.$router.push({name:'booking-manage'})
    else this.$router.push({name:'booking-room'})


  }
};
</script>
