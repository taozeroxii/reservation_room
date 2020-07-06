<template>
  <form @submit.prevent="onSearch" class="search-form form-inline">
    <select class="form-control" v-model="form.search_key">
      <option v-for="item in types" :key="item.value" :value="item.value">{{item.name}}</option>
    </select>
    <input
      :type="getInputType"
      class="form-control"
      v-model.trim="form.search_text"
      placeholder="ค้นหาข้อมูล"
    />
    <button type="submit" class="btn btn-secondary">
      <i class="fa fa-search"></i>
    </button>
  </form>
</template>

<script>
export default {
  props: {
    types: {
      type: Array,
      required: true
    }
  },
  computed:{
    //แปลี่ยนค่า type ให้ input
    getInputType(){
      const findType = this.types.find(type => type.value == this.form.search_key)
      //console.log(findType)
      if(findType && findType.type) return findType.type 
      return "text";
    }
  },
  data() {
    return {
      form: {
        search_key: "",
        search_text: ""
      }
    };
  },
  mounted() {
    if (this.types && this.types.length > 0) { //เช็คว่าtypes มีค่าส่งมาไหมหากมีให้นำค่า type=ช่่อง 0 ออกมาแสดง
      this.form.search_key = this.types[0].value;//ตั้งdefault value
    }
  },
  methods:{
      onSearch(){//สร้าง method เพื่อใช้รับค่าจาก user ที่พิมค่าลง formตอนกด summit
         // console.log(this.form)//แสดงค่าออกมาโชว
         this.$emit('onSearch',this.form);
      }
  }
};
</script>

<style scoped>
.search-form {
  float: right;
  margin-bottom: 15px;
}

.form-control {
  margin-right: 5px;
}
</style>