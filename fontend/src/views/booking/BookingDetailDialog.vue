<template>
  <div class="modal fade" tabindex="-1" role="dialog" id="booking-detaildialog">
    <div class="modal-dialog" role="document">
      <form class="modal-content" @submit.prevent="onSubmit()">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fa fa-info"></i> รายละเอียดห้องประชุม
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="modal-body">
         
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-info btn-block mt-2 mb-4">จองห้องประชุมนี้</button>
        </div>
      </form>
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
        console.log(response.data)
      })
      .catch(err =>{
        this.alertify.error(err.response.data.message)
      })
    }
  },

  mounted() {
    //ตรวจจับ event การปิดหน้า modal dialog 
    this.jquery("#booking-detaildialog").on('hidden.bs.modal',(e) => {
       this.$emit('onClose',event);
    });
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
</style>