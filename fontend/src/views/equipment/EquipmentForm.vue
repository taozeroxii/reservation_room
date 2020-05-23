<template>
  <layout>
    <div slot="buttons" class="form-group">
      <router-link class="btn btn-menu" :to="{name:'equipment-list'}">รายการข้อมูล</router-link>
      <router-link class="btn btn-menu" :to="{name:'equipment-form'}">เพิ่มข้อมูลใหม่</router-link>
    </div>
    <div class="card">
      <div class="card-body">
        <header>
          <i class="fa fa-edit">เพิ่ม/แก้ไข ข้อมูลอุปกรณ์ห้องประชุม</i>
        </header>
        <hr />

        <form @submit.prevent="onSubmit()">
          <div class="form-group">
            <label>ชื่ออุปกรณ์</label>
            <input type="text" name="eq_name"
             v-model.trim="form.eq_name" 
             v-validate="{required:true}"
             :class="{'is-invalid':errors.has('eq_name')}"
             class="form-control" />
            <span class="invalid-feedback">{{ errors.first('eq_name') }}</span>
          </div>

          <div class="form-group">
            <label>รายละเอียดอุปกรณ์</label>
            <textarea rows="4" v-model.trim="form.eq_detail"  class="form-control"></textarea>
          </div>

          <div class="form-group">
            <label class="btn btn-secondary btn-block">
              <i class="fa fa-upload"></i>อัพโหลดรูปภาพ
              <input @change="onChangeFile($event.target)" type="file" class="d-none">
            </label>
            <img class="img-fulid" :src="form.eq_image || '/img/noimage.png'" alt="example" />
          </div>

          <div class="form-group">
            <div class="row">
              <div class="col-sm-6">
                <button type="submit" class="btn btn-info btn-block">บันทึกข้อมูล</button>
              </div>
              <div class="col-sm-6">
                <router-link :to="{name:'equipment-list'}" class="btn btn-danger btn-block">ยกเลิก</router-link>
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
        eq_name:"",
        eq_detail:"",
        eq_image:""
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
        eq_name:"",
        eq_detail:"",
        eq_image:""
      }
      this.$validator.reset();
    }
  },

  methods:{
    onSubmit(){
      this.$validator.validateAll().then(valid=>{
        if(!valid) return;    // console.log(valid);
        if(this.jquery.trim(this.form.eq_image)=="")
          return this.alertify.error('กรุณาอัพโหลดภาพ');
          // console.log(this.form);
          const updateid = this.$router.currentRoute.query.id;
          const request = isNaN(updateid) //ตรวจสอบว่ามีค่า id ส่งมาด้วยไหมหากมี
          ? axios.post('/api/equipment',this.form) //ส่งค่าไปยังroute ของ backend เพิ่มข้อมูล
          : axios.put(`/api/equipment/${updateid}`,this.form) //ส่งค่าไปยัง route ของ backend แก้ไข
        //ส่งข้อมูลไปหา server
        request
            .then(res => this.alertify.success("เพิ่มข้อมูลสำเร็จ")
            .then(this.$router.push({name:"equipment-list"}))
          )//หาก insert สำเร็จให้ไปรันหน้าแสดงลิส
            .catch(error=> this.alertify.error(error.response.data.message))
      });
    },
    // แปลงไฟล์ภาพเป็น BASE64  string
    onChangeFile(input){//ส้ราง method เพื่อเรียกใช้เมื่อมีการอัพโหลดรูปภาพให้เปลี่ยนภาพแสดง
      //console.log(input);//แสดงค่าออกมาดูก้อน
      //console.log(input.files);//แสดงค่าออกมาดูก้อน
      this.form.eq_image  = ""
      if(input.files && input.files.length > 0 ){
        const file = input.files[0];
        if(file.type.indexOf('image/') >= 0 ){//เช็ค type ต้องเป้น image
          const reader = new FileReader();
          reader.readAsDataURL(file);//อ่านตัว data Url และเอาไปทำการแปลงเป็น base 64 ส่งไป backend
          reader.addEventListener('load',()=>{
            //console.log(reader.result);
            this.form.eq_image = reader.result;
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
     Axios.get(`/api/equipment/${id}`)
        .then(res =>{
            //console.log(res))
            const form = res.data; // สร้างตัวแปรเก็บค่าที่ตอบกลับมาจากserver  
            this.form.eq_name = form.eq_name;//กำหนดให้ค่าใน form ที่ชื่อ eq_name =  ค่าที่ตอบกลับมา
            this.form.eq_detail = form.eq_detail;
            this.form.eq_image = form.eq_image;
          })
        .catch(() => this.$router.push({name:'equipment-list'}))
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