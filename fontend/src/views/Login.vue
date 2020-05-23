<template>
  <div class="register container col-md-6 col-lg-4">
   <!-- <img src="../../public/img/logo.png" alt class="img-logo mt-3 mb-3" /> -->
    <div class="card mt-5">
      <h1 class="card-header">LOGIN</h1>
      <div class="card-body">
        <form @submit.prevent="onSubmit()">
          <div class="form-group">
            <label for="username">ชื่อผู้ใช้งาน</label>
            <input
              type="text"
              v-validate="'required'"
              name="u_username"
              v-model.trim="form.u_username"
              :class="{'is-invalid':errors.has('u_username')}"
              placeholder="Username"
              class="form-control"/>
            <span class="invalid-feedback">{{ errors.first('u_username') }}</span>
          </div>

          <div class="form-group">
            <label for="username">รหัสผ่าน</label>
            <input
              type="password"
              name="u_password"
              v-validate="'required'"
              v-model.trim="form.u_password"
              :class="{'is-invalid':errors.has('u_password')}"
                  placeholder="password"
              class="form-control" />
            <span class="invalid-feedback">{{ errors.first('u_password') }}</span>
          </div>

          <div v-if="errorMessage" class="alert alert-warning text-center">{{errorMessage}}</div>

          <div class="form-group button">
            <button type="submit" class="btn btn-info btn-block">เข้าสู่ระบบ</button>
            <button type="button" @click="ongoToRegister()" class="btn btn-secondary btn-block">ลงทะเบียน</button>
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
  margin-top: 30%;
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
        u_password: ""
      },
      errorMessage: ""
    };
  },
  methods: {
    //ตรวจสอบ login
    onSubmit() {
      this.$validator.validateAll().then(valid => {
        if (!valid) return;
        axios
          .post("api/account/login", this.form)
          .then(response => {
             //console.log(response.data); 
             this.$router.push("/");
          })
          .catch(err => {
            this.errorMessage = err.response.data.message;
          });
      });
    },
    ongoToRegister(){
      this.$router.push('/register')
    }
  }
};
</script>