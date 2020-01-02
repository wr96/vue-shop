<template>
  <el-container class="box">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt class="tp" />
        <span class="bt">电商后台管理系统</span>
      </div>
      <el-button type="info" v-on:click="tc" class="tc">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧面 -->
      
      <el-aside :width="iszhedie?'64px':'200px'">
        <div class="zhedie" v-on:click='zhedie' collapse-transition>|&nbsp;|&nbsp;|</div>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409FFF" 
        :unique-opened='true' 
        :collapse="iszhedie"
         :collapse-transition='false' :router='true'
         :default-active=activepath>
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id" >
            <!-- 一级菜单导航 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iocnsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" v-on:click="bcdz('/'+subItem.path)">
             <template slot="title"> <i class="el-icon-menu"></i>
              <span>{{subItem.authName}}</span>
             </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menulist: [],
      iocnsObj:{
        '125':'iconfont icon-users',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'
      },
      iszhedie:false,
        //被激活的链接地址
      activepath:''
    }
  },
  created() {
    this.getMenuList()
    this.activepath=sessionStorage.getItem('activepath')
  },
  methods: {
    tc() {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    zhedie () {
      this.iszhedie=!this.iszhedie
    },
    //保存链接的激活地址
    bcdz (activepath) {
    sessionStorage.setItem("activepath",activepath)
     this.activepath=activepath
    },
    async getMenuList() {
      const { data: data } = await this.$http.get('menus')
      console.log(data)
      if (data.meta.status != 200) {
        return this.$message.error(data.meta.mag)
      } else {
        this.menulist = data.data
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: white;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.box {
  width: 100%;
  height: 100%;
}
.el-menu {
    border-right: 0;
}
.iconfont {
  margin-right: 15px;
}
.zhedie {
    color:white;
    font-size: 10px;
    background-color: #4A5064;
    line-height: 24px;
    text-align: center;
    cursor: pointer;
}
</style>