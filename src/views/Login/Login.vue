<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../../assets/logo.png" alt="" />
      </div>
      <el-form class="login_form" ref="loginFormRef" :rules="loginRules" :model="form" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" show-password prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <el-row class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getLogin } from '@/http/index.js'
import { ElMessage } from 'element-plus'
export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "admin",
        password: "123456"
      },
       loginRules: {
        username: [
          {
            required: true, //为true，表示必填项
            message: '请输入用户名',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 5,
            message: '长度在3-5之间',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true, 
            message: '请输入密码',
            trigger: 'blur',
          },
          {
            min: 6,
            max: 15,
            message: '长度在6-15之间',
            trigger: 'blur',
          },
        ],
      }
    }
  },
  methods: {
    login (){
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid);
        // console.log(o);
        if(!valid) return;
        // console.log(this.form.username,this.form.password);
        const res = await getLogin(this.form.username, this.form.password)
        // console.log(res);
        // console.log(res.data);
        if(res.meta.status !== 200) return ElMessage.error("用户名不存在")
        ElMessage({message: '登录成功', type: 'success'})

        //将token保存到session客户端里
        window.sessionStorage.setItem("token",res.data.token)
        this.$router.push('/home')
      })
    },
    resetLoginForm () {
      // console.log(this.$refs);
      this.$refs.loginFormRef.resetFields()
    }
  },
};
</script>
<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
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
      background-color: #2b4b6b;
    }
  }
  .login_form {
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: 0 10px;
    box-sizing: border-box;

    .btns {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 10px;
    }
  }
}
</style>