<template>
  <div class="modal fade" tabindex="-1" role="dialog" id="booking-detaildialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fa fa-info"></i> รายละเอียดห้องประชุม
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="modal-body" v-if="roomItem">
          <div class="form-group">
            <img class="img-fluid" :src="`/api/uploads/${roomItem.r_image}`" :alt="roomItem.r_name">
          </div>

          <div class="row">
            <div class="col-sm-4 form-group">ชื่อห้อง</div>
            <div class="col-sm-8 form-group"> : {{roomItem.r_name}}</div>
          </div>

          <div class="row">
            <div class="col-sm-4 form-group">ขนาดความจุ</div>
            <div class="col-sm-8 form-group"> : {{roomItem.r_capacity}}  คน</div>
          </div>

          <div class="row">
            <div class="col-sm-4 form-group">การจอง</div>
            <div class="col-sm-8 form-group">: {{roomItem.r_booking}} ครั้ง</div>
          </div>

          <div class="row">
            <div class="col-sm-4 form-group">รายละเอียด</div>
            <div class="col-sm-8 form-group">: {{roomItem.r_detail || 'ไม่มีข้อมูล' }} </div>
          </div>
         
        </div>

        <div class="modal-footer">
          <button @click="onBooking()" class="btn btn-info btn-block mt-2 mb-4">จองห้องประชุมนี้</button>
        </div>
      </div>
    </div>
  </div>
</template>





<script>
import axios from 'axios';

export default {
  props: {
    room: {
      required: true
    }
  },
  watch: {
    room(value) {
      if(!value){ return }
      //console.log(value);
      //ส่ง r_id ไปหา รายละเอียดห้องประชุม
      axios.get(`/api/booking/room/${value.r_id}`)
      .then(response =>{
        this.jquery("#booking-detaildialog").modal();
        // console.log(response.data)
        this.roomItem = response.data
       
      })
      .catch(err =>{
        this.alertify.error(err.response.data.message)
      })
    }
  },

  data(){
    return{
      roomItem:null
    }
  },

  mounted() {
    //ตรวจจับ event การปิดหน้า modal dialog 
    this.jquery("#booking-detaildialog").on('hidden.bs.modal',(e) => {
       this.$emit('onClose',event);
    });
  },

  methods:{
    //ฟังก์ชันเมื่อกดจองให้มันปิด modal แล้วไปเปิดหน้าจอง
    onBooking(){
      this.jquery("#booking-detaildialog").modal('hide');
      const room = {... this.room};
      setTimeout(() => {
         this.$emit('onBooking',room);//สร้าง emit ส่งค่ากลับไปให้หน้า bookingroomlist เพื่อไปเปิดหน้า bookingdialog
      }, 500);
    }

  }


};
</script>

<style  scoped>
.modal {
  color: #525b62;
}
.modal-body,
.modal-footer {
  padding-left: 5%;
  padding-right: 5%;
}
img-fluid{
  border:solid 1px #6C7570;
}
</style>