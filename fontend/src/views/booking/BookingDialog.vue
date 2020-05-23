<template>
  <div class="modal fade" tabindex="-1" role="dialog" id="booking-dialog">
    <div class="modal-dialog" role="document">
      <form class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fa fa-ticket"></i> จองห้องประชุมนี้
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label for>หัวข้อห้องประชุม</label>
            <input type="text" class="form-control" />
          </div>
          <div class="form-group">
            <label for>รายละเอียดอื่นๆ</label>
            <textarea type="text" rows="4" class="form-control" />
          </div>
          <div class="row">
            <div class="col-7">
              <div class="form-group">
                <label for>เริ่มประชุมวันที่</label>
                <input type="date" class="form-control" />
                <label for>สิ้นสุดวันที่</label>
                <input type="date" class="form-control" />
              </div>
            </div>
            <div class="col-5">
              <div class="form-group">
                <label for>เวลา</label>
                <input type="time" class="form-control" />
                <label for>เวลา</label>
                <input type="time" class="form-control" />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for>อุปกรณ์ห้องประชุม</label>
            <div class="form-row" v-for="item in checkFakeitem" :key="item">
              <div class="col-sm-4">
                <div class="form-check">
                  <label class="form-check-label" for="defaultCheck1">
                    <input class="form-check-input" type="checkbox" id="defaultCheck1" />ลำโพงกลางแจ้ง
                  </label>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="form-check">
                  <label class="form-check-label" for="defaultCheck2">
                    <input class="form-check-input" type="checkbox" id="defaultCheck2" />ไมโครโฟน
                  </label>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="form-check">
                  <label class="form-check-label" for="defaultCheck3">
                    <input class="form-check-input" type="checkbox" id="defaultCheck3" />โปรเจคเตอร์
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="submit" class="btn btn-info btn-block mt-2 mb-4">จองห้องประชุมนี้</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    room: {
      required: true
    }
  },
  watch: {
    room(value) {
      if(!value){ return }
      this.jquery("#booking-dialog").modal();
      //console.log(value);
    }
  },
  data() {
    return {
      checkFakeitem: [1, 2, 3]
    };
  },
  mounted() {
    //ตรวจจับ event การปิดหน้า modal dialog 
     this.jquery("#booking-dialog").on('hidden.bs.modal',(e) => {
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
.form-check {
  margin-bottom: 7px;
}
</style>