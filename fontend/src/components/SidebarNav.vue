<template>
  <div class="sidebar">
    <section class="card">
      <header class="card-header text text-center">
        <h6 v-html="item.header"></h6>
      </header>

      <div class="card-body">
        <router-link v-for="(item,index) in item.navs" 
        :key="index" 
        :to="item.link || '' "
        class="sidebar-link" >
          <i class="fa fa-chevron-circle-right"> {{item.name}}  </i>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
    props:["item"]
}
</script>

<style scoped>
.card {
  background: none;
  border: none;
}
.card-body {
  padding: 1rem 0;
}
.fa-chevron-circle-right {
  color: #17a2bb;
  margin: 2px;
}

.sidebar-link {
  display: block;
  padding: 0.5em 1rem;
  margin-bottom: 2px;
  color: #525662;
  padding: 7px 0;
  font-weight: 400;
  text-decoration: none;
}

.sidebar-link.active,
.sidebar-link.active .fa-chevron-circle-right,
.sidebar-link:hover .fa-chevron-circle-right,
.sidebar-link:hover
 {
  color: black;
  background-color: #dee2e6;
}

</style>