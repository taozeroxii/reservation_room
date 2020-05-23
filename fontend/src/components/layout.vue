<template>
  <div class="layout">
    <Navbar />
    <div class="container mt-4">
      <slot name="buttons"></slot>
      <div class="row">
        <div class="col-md-9 col-9">
          <slot></slot>
        </div>
        <div class="col-md-3 col-3">
            <Sidebar/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "./navbar";
import Sidebar from "./Sidebar";
export default {
  name: "home",
  components: {
    Navbar,
    Sidebar
  }
};
</script>