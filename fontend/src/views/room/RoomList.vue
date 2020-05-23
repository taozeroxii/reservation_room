<template>
  <layout>
    <div slot="buttons" class="form-group">
      <router-link class="btn" :to="{name:'room-list'}"> รายการข้อมูล</router-link>
      <router-link class="btn" :to="{name:'room-form'}"> เพิ่มข้อมูลใหม่</router-link>
    </div>
    <div class="card">
      <div class="card-body">
        <header class="mb-3">
          <h5>
             <Search :types="search_type" @onSearch="onSearch($event)" />
            <i class="fa fa-list"> รายการข้อมูลห้องประชุม</i>
          </h5>
        </header>
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>ชื่อห้องประชุม</th>
              <th>ขนาด</th>
              <th>รายละเอียด</th>
              <th>วันที่แก้ไขล่าสุด</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in rooms.result" :key="item.r_id">
              <td>
                <div class="img-container">
                  <img :src="`api/uploads/${item.r_image}`" :alt="item.r_name" />
                </div>
              </td>
              <td>{{item.r_name}}</td>
              <td>{{item.r_capacity}}</td>
              <td>{{item.r_detail||'ไม่มีข้อมูล'}}</td>
              <td>{{item.r_updated}}</td>
              <td class="text-right">
                <i v-on:click="onUpdate(item)" class="fa fa-edit text-info mr-3 pointer"></i>
                <i @click="onDelete(item)"  class="fa fa-trash text-danger pointer"></i>
              </td>
            </tr>
          </tbody>
        </table>
       <Pagination :data="rooms" :page="page" @onPage="onPage($event)" />
      </div>
    </div>
  </layout>
</template>


<script>
import layout from "@/components/layout";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import { mapState } from "vuex";
import Axios from 'axios';

export default {
  data(){
    return{
      page:1,
      search:{},
      search_type:[
          {name:"ชื่อห้องประชุม",value:"r_name"},
          {name:"ขนาด",value:"r_capacity"},
          {name:"รายละเอียด",value:"r_detail"}
        ]
    };
  },
  computed: {
    ...mapState(["rooms"])
  },
  components: {
    layout,
    Pagination,
    Search
  },
  created() {
   this.$store.dispatch("set_rooms");
   //console.log(this.equipments);
  },
  methods: { 
    //แก้ไขข้อมูลโดยส่งไปที่หน้าcreate 
    onUpdate(item){
      this.$router.push({name:"room-form",query:{id:item.r_id}})
    },
    onPage(page) {//แบ่งหน้า
         this.page = page;
         this.$store.dispatch("set_rooms",{page: this.page, ...this.search});
        // console.log(page);
    },
    onSearch(search){//ค้าหาข้อมูล
     // console.log(form);
      this.search = search;
      this.page = 1;
      this.$store.dispatch("set_rooms",{page:1, ... this.search});
    },
    onDelete(item){
       //console.log(item)
       this.alertify.confirm("ต้องการลบข้อมูลนี้หรือไม่", ()=>{   
        // console.log(item.eq_id)
         Axios.delete(`/api/room/${item.r_id}`)
          .then(() =>this.alertify.success('ลบสำเร็จ')
          .then( this.$store.dispatch("set_rooms")))
          .catch(error=> this.alertify.error(error.response.data.message))
        })
    }
  }
};
</script>

<style scoped>
.btn {
  color: white;
  background-color: #ced4da;
  margin-right: 3px;
}
.router-link-exact-active {
  background-color: #17a2b8;
}
</style>