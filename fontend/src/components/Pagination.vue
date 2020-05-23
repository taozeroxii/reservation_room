<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-end">
      <li class="page-item" :class="{disabled:page<=1}">
        <a @click.prevent="onPage(page-1)"  class="page-link" href="#" ><<</a>
      </li>

      <li class="page-item"  v-for="item in getPageItems" :key="item" :class="{active:page === item}"  >
        <a @click.prevent="onPage(item)" class="page-link" href="#">{{item}}</a>
      </li>

      <li class="page-item" :class="{disabled:page>=getPageItems.length}">
        <a @click.prevent="onPage(page+1)"  class="page-link" href="#">>></a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    data: {
      required: true//ค่าที่รับมาจากหน้า equipment ต้องมีอยู่
    },
    page:{
      types:Number,
      required:true,
      default:1
    }
  },
  computed: {
    getPageItems() {
      const pages = [];
      if (this.data) {
        // เช็คมีข้อมูลไหม
        if (this.data.result && this.data.rows) {
          //เช็คว่าต้องมีข้อมูลและมีการส่งค่า rows มาจาก props ด้วย
          const rows = this.data.rows; //สร้างตัวแปรเก้บแถว
          const limit = this.data.limit; //สร้างมาเก็บจำนวนข้อมูลว่าดึงมาจากฐานมี่กี่แถว
          for (let index = 1; index <= Math.ceil(rows / limit); index++) {
            pages.push(index);
          }
          // console.log(rows, limit);
        }
      }
      return pages;
    }
  },
  methods:{
      onPage(page){
          this.$emit('onPage',page)
      }
  }
};
</script>