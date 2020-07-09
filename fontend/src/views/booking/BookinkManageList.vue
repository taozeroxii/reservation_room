<template>
  <Layout>
     <div class="card">
      <div class="card-body">
        <header class="mb-3">
            <Search :types="search_types" @onSearch="onSearch($event)"/>
            <i class="fa fa-list"> รายการจองข้อมูลห้องประชุม</i>
        </header>

        <br/>

        <table class="table">
                <thead>
                    <tr>
                    <th>#</th>
                    <th>หัวข้อประชุม</th>
                    <th>วัน-เวลาเริ่ม</th>
                    <th>วัน-เวลาสิ้นสุด</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in bookings.result" :key="item.bk_id" :class="getApplyStatusClass(item)">
                        <td>{{item.bk_id}}</td>
                        <td>{{item.bk_title}}</td>
                        <td>{{item.bk_time_start}}</td>
                        <td>{{item.bk_time_end}}</td>
                        <td class="btns">
                            <div v-if="item.bk_status === 'pending'">
                                <button @click="onUpdateStatus('allowed',item)" class="btn btn-warning mr-2"> <i class="fa fa-check-circle"></i>  อนุมัติ </button>
                                <button @click="onUpdateStatus('not allowed',item)"  class="btn btn-danger"> <i class="fa fa-times-circle"></i>  ไม่อนุมัติ </button>
                            </div>

                            <div v-if="item.bk_status === 'allowed'">
                                <i class="fa fa-check-circle"></i>  อนุมัติแล้ว
                            </div>

                            <div v-if="item.bk_status === 'not allowed'">
                                <i class="fa fa-times-circle ml-2"></i>  ไม่อนุมัติ
                                <button @click="onDelete(item)" class="btn btn-danger"> <i class="fa fa-trash"></i>  ลบ </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
             </table>
       
       <Pagination :data="bookings" :page="page" @onPage="onPage($event)"/>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/components/layout";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import {mapState} from 'vuex'
import Axios from 'axios';
export default {
  components: {
    Layout,Search,Pagination
  },
  computed:{
       ...mapState(['bookings'])
  },
  data(){
      return{
         search_types:[
              { name:'หัวข้อประชุม',value:'bk_title'},
              { name:'วันที่เริ่ม',value:'bk_time_start',type:'date'},
              { name:'วันที่สิ้นสุด',value:'bk_time_end',type:'date'}
            ],
          search: {},
          page:1
      }
  },

  mounted(){
      this.$store.dispatch('set_bookings')
  },

  methods:{
    onSearch(search) {
      this.search = search;
      this.$store.dispatch("set_bookings", {  page: 1, ...this.search});
    },
    onPage(page) {
      this.page = page;
      //console.log(this.page);
      this.$store.dispatch("set_bookings", {
        page: this.page,
        ...this.search
      });
    },
    //เปลี่ยนสถานะการจองเป็นชื่อ class
    getApplyStatusClass(item){
        const statusClass = {}
        statusClass[item.bk_status] = true
        return statusClass
    },
    //เปลี่ยนสถานะการจองส่งไป backend
    onUpdateStatus(bk_status,item){
        //console.log(status,item)
        this.alertify.confirm("คุณต้องการทำรายการต่อไปหรือไม่",() => {
           Axios.put(`/api/booking/manage/${item.bk_id}`,{ bk_status })
           .then(response =>{      
                 this.$store.dispatch("set_bookings", {page: 1});
            })
           .catch(error =>{ this.alertify.error(error.response.data.message)})
        });
    },
    //ลบการจอง
    onDelete(item){
         this.alertify.confirm("คุณต้องการลบรายการนี้หรือไม่",() => {
           Axios.delete(`/api/booking/manage/${item.bk_id}`)
           .then(response =>{      
                 this.$store.dispatch("set_bookings");
            })
           .catch(error =>{ this.alertify.error(error.response.data.message)})
        });
    }

  }

};
</script>


<style  scoped>
.btns{
    text-align: right;
}

tr.allowed td{
    color:green;
}
tr.not.allowed td{
    color:red;
}
</style>