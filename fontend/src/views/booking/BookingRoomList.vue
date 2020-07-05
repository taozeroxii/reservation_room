<template>
  <Layout>
    <Search :types="search_types" @onSearch="onSearch($event)" />
    <div class="form-group">
      <router-link class="btn btn-menu" :to="{name:'booking-room'}">จองห้องประชุม</router-link>
      <router-link class="btn btn-menu" :to="{name:'booking-history'}">ประวัติการจอง</router-link>
    </div>

    <div class="card mb-3" v-for="item in rooms.result" :key="item.r_id">
      <div class="row align-items-center">
        <div class="col-lg-4">
          <div class="card-body">
            <img :src="`/api/uploads/${item.r_image}`" alt class="img-booking" />
          </div>
        </div>
        <div class="col-lg-8">
          <div class="card-body">
            <div>ชื่อห้อง :{{item.r_name}}</div>
            <div>ขนาด :{{item.r_capacity}}</div>
            <div>รายละเอียด :{{ item.r_detail || 'ไม่มีข้อมูล'}}</div>
            <div>
              <button @click="onBooking(item)" class="btn btn-info">
                <i class="fa fa-ticket"> จองห้องนี้</i>
              </button>
              <button @click="onDetail(item)" class="btn btn-secondary">
                <i class="fa fa-info"> รายละเอียด</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Pagination :data="rooms" :page="page" @onPage="onPage($event)" />
    <BookingDialog :room="roomItem" @onClose="roomItem = null" />
    <BookingDetailDialog :room="roomDetailItem" @onClose="roomDetailItem = null" @onBooking="roomItem = $event"/>

  </Layout>
</template>

<script>
import Layout from  '@/components/layout'
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import BookingDialog from "./BookingDialog";
import BookingDetailDialog from "./BookingDetailDialog";
import { mapState } from "vuex";

export default {
  components: {
    Search,
    Pagination,
    BookingDialog,
    BookingDetailDialog
  },
  computed: {
    ...mapState(["rooms"])
  },
  data() {
    return {
      search_types: [
        { name: "ชื่อห้อง", value: "r_name" },
        { name: "ขนาดห้อง", value: "r_capacity" },
        { name: "รายละเอียด", value: "r_detail" }
      ],
      page: 1,
      search: "",
      roomItem: null,
      roomDetailItem:null
    };
  },
  mounted() {
    this.$store.dispatch("set_booking_rooms");
  },
  methods: {
    //เมื่อกดปุ่มจองห้องให้แสดง modal ตามไอดีปุ่มนั้นๆ 
    onBooking(item) {
      // console.log(item)
      this.roomItem = item;//เก็บค่า roomItem = item คือค่าไอเท็มนั้นๆทั้งหมด เพื่อส่งค่าผ่าน props ไปหน้า bookingdialog
    },
    //เมื่อกดปุ่ม Detail  modal ตามไอดีปุ่มนั้นๆ 
    onDetail(item) {
      this.roomDetailItem = item;
    },

    onSearch(search) {
      this.search = search;
      this.$store.dispatch("set_booking_rooms", {
        page: 1,
        ...this.search
      });
    },
    onPage(page) {
      this.page = page;
      //console.log(this.page);
      this.$store.dispatch("set_booking_rooms", {
        page: this.page,
        ...this.search
      });
    }
  }
};
</script>

<style scoped>
.btn-menu {
  color: white;
  background-color: #ced4da;
  margin-right: 3px;
}
.router-link-exact-active {
  background-color: #17a2b8;
}
.img-booking {
  height: 150px;
}
.card {
  border-right: solid 5px #17a2b8;
}
</style>
