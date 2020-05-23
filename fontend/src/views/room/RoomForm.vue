<template>
  <layout>
    <div slot="buttons" class="form-group">
      <router-link class="btn btn-menu" :to="{name:'room-list'}">รายการข้อมูล</router-link>
      <router-link class="btn btn-menu" :to="{name:'room-form'}">เพิ่มข้อมูลใหม่</router-link>
    </div>

    <div class="card">
      <div class="card-body">
        <header>
          <i class="fa fa-edit">เพิ่ม/แก้ไข ข้อมูลห้องประชุม</i>
        </header>
        <hr />

        <form @submit.prevent="onSubmit()">
          <div class="form-group">
            <label>ชื่อห้องประชุม</label>
            <input type="text" name="r_name"
             v-model.trim="form.r_name" 
             v-validate="{required:true}"
             :class="{'is-invalid':errors.has('r_name')}"
             class="form-control" />
            <span class="invalid-feedback">{{ errors.first('r_name') }}</span>
          </div>

        <div class="form-group">
            <label>ขนาดความจุ (คน)</label>
            <input type="number" name="r_capacity"
             v-model.trim="form.r_capacity" 
             v-validate="{required:true}"
             :class="{'is-invalid':errors.has('r_capacity')}"
             class="form-control" />
            <span class="invalid-feedback">{{ errors.first('r_capacity') }}</span>
          </div>

          <div class="form-group">
            <label>รายละเอียดห้อง</label>
            <textarea rows="4" v-model.trim="form.r_detail"  class="form-control"></textarea>
          </div>

          <div class="form-group">
            <label class="btn btn-secondary btn-block">
              <i class="fa fa-upload"></i>อัพโหลดรูปภาพ
              <input @change="onChangeFile($event.target)" type="file" class="d-none">
            </label>
            <img class="img-fulid" :src="form.r_image || '/img/noimage.png'" alt="example" />
          </div>

          <div class="form-group">
            <div class="row">
              <div class="col-sm-6">
                <button type="submit" class="btn btn-info btn-block">บันทึกข้อมูล</button>
              </div>
              <div class="col-sm-6">
                <router-link :to="{name:'room-list'}" class="btn btn-danger btn-block">ยกเลิก</router-link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </layout>
</template>


<script>
import layout from "@/components/layout";
import axios from 'axios';
import Axios from 'axios';
export default {
  data(){
    return{
      form:{
        r_name:"",
        r_image:"",
        r_capacity:"",
        r_detail:""
      }
    }
  },
  components: {
    layout
  },
  mounted(){
    this.initialUpdateItem();
  },
  watch:{//เช็ค urlหากมีการเปลี่ยนแปลงใน route เดียวกันให้ทำการเคลียค่าในฟอร์ม
    "$route.query.id"(){
       this.form = {
        r_name:"",
        r_image:"",
        r_capacity:"",
        r_detail:""
      }
      this.$validator.reset();
    }
  },

  methods:{
    onSubmit(){
      this.$validator.validateAll().then(valid=>{
        if(!valid) return;    // console.log(valid);
        if(this.jquery.trim(this.form.r_image)=="")
          return this.alertify.error('กรุณาอัพโหลดภาพ');
          // console.log(this.form);
          const updateid = this.$router.currentRoute.query.id;
          const request = isNaN(updateid) //ตรวจสอบว่ามีค่า id ส่งมาด้วยไหมหากมี
          ? axios.post('/api/room',this.form) //ส่งค่าไปยังroute ของ backend เพิ่มข้อมูล
          : axios.put(`/api/room/${updateid}`,this.form) //ส่งค่าไปยัง route ของ backend แก้ไข
        //ส่งข้อมูลไปหา server
        request
            .then(res => this.alertify.success("เพิ่มข้อมูลสำเร็จ")
            .then(this.$router.push({name:"room-list"}))
          )//หาก insert สำเร็จให้ไปรันหน้าแสดงลิส
            .catch(error=> this.alertify.error(error.response.data.message))
      });
    },
    // แปลงไฟล์ภาพเป็น BASE64  string
    onChangeFile(input){//ส้ราง method เพื่อเรียกใช้เมื่อมีการอัพโหลดรูปภาพให้เปลี่ยนภาพแสดง
      //console.log(input);//แสดงค่าออกมาดูก้อน
      //console.log(input.files);//แสดงค่าออกมาดูก้อน
      this.form.r_image  = ""
      if(input.files && input.files.length > 0 ){
        const file = input.files[0];
        if(file.type.indexOf('image/') >= 0 ){//เช็ค type ต้องเป้น image
          const reader = new FileReader();
          reader.readAsDataURL(file);//อ่านตัว data Url และเอาไปทำการแปลงเป็น base 64 ส่งไป backend
          reader.addEventListener('load',()=>{
            //console.log(reader.result);
            this.form.r_image = reader.result;
          })
          return;
        }
      }
      this.alertify.warning('กรุณาเลือกภาพที่จะอัพโหลด!!');
    },
    // นำข้อมูลจาก server ไปใส่ใน form เพื่อใช้ update ใหม่
    initialUpdateItem(){
      const id = this.$route.query.id;
     // console.log(id);
     if(!id) return;
     Axios.get(`/api/room/${id}`)
        .then(res =>{
            //console.log(res))
            const form = res.data; // สร้างตัวแปรเก็บค่าที่ตอบกลับมาจากserver  
            this.form.r_name = form.r_name;//กำหนดให้ค่าใน form ที่ชื่อ eq_name =  ค่าที่ตอบกลับมา
            this.form.r_capacity = form.r_capacity;
            this.form.r_detail = form.r_detail;
            this.form.r_image = form.r_image;
          })
        .catch(() => this.$router.push({name:'room-list'}))
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
form{
  max-width: 350px;
  margin:auto;
}
img{
  width:100%;
}
</style>