<template>
  <Layout>
    <div class="card">
      <div class="card-body">
        <header class="mb-3">
          <h5>
            <form @submit.prevent="onSearch" class="search-form form-inline">
              <select class="form-control" v-model="roomId">
               <option value="">เลือกห้องประชุม</option>
                <option  v-for="item in roomItems" :key="item.r_id" :value="item.r_id" >{{item.r_name}}</option>
              </select>
             

              <button type="submit" class="btn btn-secondary">  <i class="fa fa-search"></i> </button>
            </form>

            <i class="fa fa-list">ปฎิทินรายการจองห้องประชุม</i>
          </h5>
        </header>
        <br/>
        <div class="fullcalendar" id="calendar"></div>

      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/components/layout.vue";
import axios from 'axios';
const calendarId = "#calendar";
export default {
  components: {
    Layout
  },
  data(){
      return {
          roomId:"",
          roomItems:[]
      }
  },
  mounted(){
    this.LoadRoomSelect();
    this.InitialLoadCalendar();
  },
  methods:{

      //ส่ง id ที่เลือกไปหาข้อมูลการจอง
      onSearch(){
         this.jquery("#calendar").fullCalendar("removeEvents") //ล้างข้อมูล

          //console.log(this.roomId)
          if(!this.jquery.isNumeric(this.roomId)) return this.alertify.warning("โปรดเลือกชื่อห้อง");
          axios.get(`/api/booking/calendar/room/${this.roomId}`)
            .then(response => {  
                // console.log(response.data) ค่าที่ส่งมาจาก backend
                const events = response.data.map(item => {//เอาค่ามา map ใหม่ให้ตรง format fullcalendar
                    return {
                        title: item.bk_title,
                        start: new Date(item.bk_time_start),
                        end: new Date(item.bk_time_end),
                        className : item.bk_status
                    };
                });
            this.jquery("#calendar").fullCalendar("renderEvents",events) //กำหนด event ให้ปฎิทิน

            })
            .catch(err => this.alertify.warning(response.data.message))
      },

      //โหลดข้อมูลมาแสดงใน select
      LoadRoomSelect(){
        axios.get('/api/booking/rooms/select')
            .then(response => {
                //console.log(response)
                this.roomItems = response.data //เอาตัวแปร roomitems เก็บค่าที่ดึงมาจาก backend
            })
            .catch(err => this.alertify.warning(response.data.message))
      },

      //โหลดข้อมูลcalendar ui
      InitialLoadCalendar(){
        this.jquery("#calendar").fullCalendar({
            locale: 'th',
            header:{
                left: 'prev,next today', // will normally be on the left. if RTL, will be on the right
                center: 'title',
                right: 'month ,agendaWeek ,agendaDay' // will normally be on the right. if RTL, will be on the left
            },
            buttonText:{
                today:    'วันนี้',
                month:    'เดือน',
                week:     'สัปดาห์',
                day:      'วันที่',
                //list:     'list'
            }
    
        })
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

.form-control:first-child {
  width:270px
}
#calendar{
    padding-bottom: 30px;
}

</style>