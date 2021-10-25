<template>
  <div class="home-container">
    <el-container class="home-container">
      <el-header class="header">
        <span>电商管理系统</span>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="isApse ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
            class="el-menu-vertical-demo"
            text-color="#fff"
            unique-opened
            :collapse="isApse"
            :collapse-transition="false"
            router
            :default-active="activePath"
          >
            <el-sub-menu
              v-for="item in menulist"
              :key="item.id"
              :index="item.id"
            >
              <template #title
                >
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
              </template
              >
              <el-menu-item
                v-for="subItem in item.children"
                :key="subItem.id"
                :index="'/'+ subItem.path"
                @click="actionPaths(subItem.path)"
              >
                <i class="el-icon-menu"></i>
                {{ subItem.authName }}
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getHomeMenu } from "@/http";
export default {
  name: "Home",
  data() {
    return {
      menulist: [],
      iconsObj: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      isApse: "false",
      activePath: ''
    };
  },
  created() {
    getHomeMenu().then((res) => {
      console.log(res);
      if (res.meta.status !== 200) return console.log(res.meta.msg);
      this.menulist = res.data;
      console.log(this.menulist);
    });
    this.activePath = window.sessionStorage.getItem('active');
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    toggleCollapse() {
      this.isApse = !this.isApse;
    },
    actionPaths(activePath) {
      // console.log(this.$route);
      //用监听方式获取活跃路由来实现高亮最好
    //  this.actionPath = this.$route.path
    window.sessionStorage.setItem('active', activePath)
    this.activePath = window.sessionStorage.getItem('active');
    }
  },
  computed: {
    
  }
};
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
    color: #fff;
    font-size: 25px;
  }
  .el-aside {
    background-color: #545c64;
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #fff;
  }
}
 .iconfont{
   margin-right: 10px;
 }
 .toggle-button{
   background-color: #4a5064;
   font-size: 14px;
   line-height: 24px;
   color: #fff;
   text-align: center;
   letter-spacing: 0.2rem;
   cursor: pointer;
 }
</style>