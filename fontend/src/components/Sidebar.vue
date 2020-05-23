<template>
  <div class="sidebar">
    <SidebarNav :item="admin" class="sidebar-nav" />
    <SidebarNav :item="user" class="sidebar-nav" />
    <SidebarNav :item="setting" class="sidebar-nav" />
  </div>
</template>

<script>
import SidebarNav from "./SidebarNav";
export default {
  data() {
    return {
      admin: {
        header: "<i class='fa fa-unlock' > ส่วนของผู้ดูแลระบบ</i>",
        navs: [
          { name: "ข้อมูลการจองห้องประชุม" },
          { name: "ข้อมูลอุปกรณ์ห้องประชุม", link: {name:"equipment-list"}},
          { name: "ข้อมูลห้องประชุม",link: {name:"room-list"} }
        ]
      },
      user: {
        header: "<i class='fa fa-user' > ส่วนของผู้ใช้งาน</i>",
        navs: [
          { name: "การจองห้องประชุม",link: {name:"booking-room"}   },
          { name: "แก้ไขข้อมูลส่วนตัว" },
          { name: "เปลี่ยนรหัสผ่าน" }
        ]
      },
      setting: {
        header: "<i class='fa fa-cog' > ตั้งค่าอื่นๆ</i>",
        navs: [
          { name: "ตั้งค่าข้อมูลส่วนตัว" },
          { name: "ตั้งค่าการแจ้งเตือน" },
          { name: "อัพเกรดบัญชี" }
        ]
      }
    };
  },
  components: {
    SidebarNav
  }
};
</script>

<style  scoped>
</style>