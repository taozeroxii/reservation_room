<template>
  <div class="modal fade" tabindex="-1" role="dialog" id="booking-dialog">
    <div class="modal-dialog" role="document">
      <form class="modal-content" @submit.prevent="onSubmit()">
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
            <input type="text" 
              v-model.trim="form.bk_title" 
              v-validate="{required:true}"
              name="bk_title"
              :class="{'is-invalid':errors.has('bk_title')}"
              class="form-control" />
              <p class="invalid-feedback">{{errors.first('bk_title')}}</p>
          </div>
          <div class="form-group">
            <label for>รายละเอียดอื่นๆ</label>
            <textarea type="text" rows="4" v-model.trim="form.bk_detail" class="form-control" />
          </div>
          <div class="row">
            <div class="col-7">
              <div class="form-group">
                <label for>เริ่มประชุมวันที่</label>
                <input type="date"  name="bk_time_start_date"
                 :class="{'is-invalid':errors.has('bk_time_start_date')}" 
                 class="form-control" required/>
                <label for>สิ้นสุดวันที่</label>
                <input type="date" v-model="form.bk_time_end.date" class="form-control" required/>
              </div>
            </div>
            <div class="col-5">
              <div class="form-group">
                <label for>เวลา</label>
                <input type="time" v-model="form.bk_time_start.time" class="form-control" required/>
                <label for>เวลา</label>
                <input type="time" v-model="form.bk_time_end.time" class="form-control" required/>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for>อุปกรณ์ห้องประชุม</label>
            <div class="form-row" >
              <div class="col-sm-4" v-for="(item , index) in equipments" :key="item.eq_id">
                <div class="form-check" :title="item.eq_name">
                  <label class="form-check-label">
                    <input class="form-check-input" 
                    :true-value="item.eq_id"
                    v-model="form.equipments[index]" 
                    type="checkbox"/>{{item.eq_name}}
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
      this.jquery("#booking-dialog").modal();
      this.form.tb_rooms_r_id = value.r_id;
      //console.log(value);
    }
  },
  data() {
    return {
      equipments:[],
      form:{
        tb_rooms_r_id:"",
        bk_title:"",
        bk_detail:"",
        bk_time_start:{date:"",time:""},
        bk_time_end:{date:"",time:""},
        equipments:[]

      }
    };
  },
  mounted() {
    //ตรวจจับ event การปิดหน้า modal dialog 
    this.jquery("#booking-dialog").on('hidden.bs.modal',(e) => {
       this.$emit('onClose',event);
       });
    // ดึงข้อมูลอุปกรณืห้องประชุม
    this.initialLoadEquipments()
  },
  methods:{
    //ดึงข้อมูล
    initialLoadEquipments(){
      axios.get('/api/booking/equipments')
      .then(response => {  this.equipments = response.data })
      .catch(err =>this.alertify.error(err.response.data.message))
    },
    //บันทึก
    onSubmit(){
      this.$validator.validateAll().then(valid=>{
        if(!valid) return;
        console.log(this.form)
      })
    
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
.form-check {
  margin-bottom: 7px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow:ellipsis;
}
</style>