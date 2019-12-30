<template>
  <div class="login">
    <div class="login_box">
      <!--头像区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!--表单区域-->
      <el-form ref='ref' :model="loginForm" label-width="0px" :rules="rules" class="login_form">
        <!--用户区域-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!--密码区域-->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" v-on:click="dl">登录</el-button>
          <el-button type="info" @click="cz">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      rules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cz () {
      // console.log(this)
      this.$refs.ref.resetFields(() => {

      })
    },
    dl () {
      this.$refs.ref.validate ( async valid =>{
        // console.log(valid);
        if (!valid) return
       const {data}= await this.$http.post('login',this.loginForm)
      //  console.log(data);
      if(data.meta.status != 200) {return this.$message.error('登陆失败')
      }else{this.$message.success('登陆成功')
      sessionStorage.setItem('token',data.data.token)
      this.$router.push('/home')
      }
       
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.btn {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
</style>
