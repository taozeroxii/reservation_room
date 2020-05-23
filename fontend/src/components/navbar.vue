<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
     <router-link class="navbar-brand img" :to="{name:'home'}">
      <img src="/img/logo.png" alt />
    </router-link>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarText"
      aria-controls="navbarText"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active"></li>
        <li class="nav-item"></li>
        <li class="nav-item"></li>
      </ul>
      <span class="navbar-text mr-4 text-info">ผู้ใช้งาน:{{this.$store.state.user.u_firstname}} {{this.$store.state.user.u_lastname}} </span>

      <a @click="onLogout()" class="btn-logout">
        <i class="fa fa-sign-out" aria-hidden="true">logout</i>
      </a>
    </div>
  </nav>
</template>

<script>
import axios from "axios";

export default {
  name: "navbar",
  created() {
  //  console.log(this.$store.state.user); // แสดงข้อมูลuserคนนั้นๆออกมา
  },
  methods: {
    onLogout() {
      axios.post("api/account/logout").then(response => {
        console.log(response);
        this.$store.commit("set_user", null);
        console.log("set store is:", this.$store.state.user);
        this.$router.push("/login");
      });
      //.catch(error => alert(error.response.data.message));
    }
  }
};
</script>

<style  scoped>
.navbar {
  background-color: white;
  border-bottom: solid gray;
}

.navbar-brand img{
  width:50px;
}
.btn-logout {
  padding: 0;
  width: 50px;
  height: 100%;
  color: green;
  line-height: 43px;
  text-align: center;
  cursor: pointer;
}
</style>