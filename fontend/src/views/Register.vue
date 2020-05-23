<template>
  <div class="register container col-md-6 col-lg-4">
    <!--<img src="../../public/img/logo.png" alt class="img-logo mt-3 mb-3" />-->
    <div class="card">
      <h1 class="card-header">REGISTER</h1>
      <div class="card-body">
        <form @submit.prevent="onSubmit()">
          <div class="form-group">
            <label for="username">ชื่อผู้ใช้งาน</label>
            <input
              type="text"
              v-validate="{required:true,regex:/^[A-Za-z0-9]{1,15}$/}"
              name="u_username"
              v-model.trim="form.u_username"
              :class="{'is-invalid':errors.has('u_username')}"
              class="form-control"
            />
            <span class="invalid-feedback">{{ errors.first('u_username') }}</span>
          </div>

          <div class="form-group">
            <label for="username">รหัสผ่าน</label>
            <input
              type="password"
              name="u_password"
              v-validate="{required:true,regex:/^[A-Za-z0-9]{1,15}$/}"
              v-model.trim="form.u_password"
              :class="{'is-invalid':errors.has('u_password')}"
              class="form-control"
            />
            <span class="invalid-feedback">{{ errors.first('u_password') }}</span>
          </div>

          <div class="form-group">
            <label for="username">ชื่อ</label>
            <input
              type="text"
              name="u_firstname"
              v-validate="'required'"
              v-model.trim="form.u_firstname"
              :class="{'is-invalid':errors.has('u_firstname')}"
              class="form-control"
            />
            <span class="invalid-feedback">{{ errors.first('u_firstname') }}</span>
          </div>

          <div class="form-group">
            <label for="username">นามสกุล</label>
            <input
              type="text"
              name="u_lastname"
              v-validate="'required'"
              v-model.trim="form.u_lastname"
              :class="{'is-invalid':errors.has('u_lastname')}"
              class="form-control"
            />
            <span class="invalid-feedback">{{ errors.first('u_lastname') }}</span>
          </div>

          <div v-if="errorMessage" class="alert alert-warning text-center">{{errorMessage}}</div>

          <div class="form-group button">
            <button type="submit" class="btn btn-info btn-block">ลงทะเบียน</button>
            <button type="button" @click="ongoToLogin()" class="btn btn-secondary btn-block">เข้าสู่ระบบ</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style  scoped>
.img-logo {
  display: block;
  margin: auto;
}
h1 {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 6px;
}
.card {
  margin-top: 1%;
  margin-bottom: 15%;
}
.card-body {
  padding-left: 15%;
  padding-right: 15%;
}
.button {
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>

<script>
import axios from "axios";

export default {
  data() {
    return {
      form: {
        u_username: "",
        u_password: "",
        u_firstname: "",
        u_lastname: ""
      },
      errorMessage: ""
    };
  },
  methods: {
    //ลงทะเบียน
    onSubmit() {
      this.$validator.validateAll().then(valid => {
        //console.log(valid);
        if (!valid) return;
        axios
          .post("api/account/register", this.form)
          .then(response => {
             //console.log(response); แสดงผลค่าตอบกลับมาจากเซิฟว่าสำเร็จไหมและมีข้อมูอะไรบ้าง
            this.errorMessage = null;
            this.$validator.reset();//สั่งให้ form resetและเซ็ตค่าเป็นค่าว่าง
            this.form = {
              u_username: "",
              u_password: "",
              u_firstname: "",
              u_lastname: ""
            };
            this.ongoToLogin();
          })
          .catch(err => {
            //console.log(err.response.data.message);//แสดงข้อความเออเร่อ err เออเร่อ response ค่าที่ตอบจากเซิฟ data.message ข้อความที่เซ็ตไวในส่วนbackendหากมีข้อผิดพลาด
            this.errorMessage = err.response.data.message;
          });
      });
    },
    ongoToLogin(){
      this.$router.push('/login')
    }
  }
};
</script>