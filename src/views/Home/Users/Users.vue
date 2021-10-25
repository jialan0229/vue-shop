<template>
  <div>
    卡莎 等级10 皮肤全有
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            class="input-with-select"
            clearable
            @clear="getUsersList"
            @change="getUsersList"
          >
            <template #append>
              <el-button
                icon="el-icon-search"
                @click="getUsersList"
              ></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column type="index" label="#" width="253" />
        <el-table-column prop="username" label="姓名" width="253" />
        <el-table-column prop="email" label="邮箱" width="253" />
        <el-table-column prop="mobile" label="电话" width="253" />
        <el-table-column prop="role_name" label="角色" width="253" />
        <el-table-column label="状态" width="253">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="253">
          <template v-slot="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改"
              placement="top"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="editDialog(scope.row.id)"
                circle
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="deleteTooltip(scope.row.id)"
                circle
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                circle
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>

      <!-- 添加用户对话框 -->
      <el-dialog
        v-model="dialogVisible"
        title="添加用户"
        width="50%"
        @close="addClose"
      >
        <el-form
          :label-position="labelPosition"
          label-width="100px"
          :model="formLabelAlign"
          :rules="rules"
          ref="formAddRef"
        >
          <el-form-item label="用户名：" prop="username">
            <el-input v-model="formLabelAlign.username"></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input
              v-model="formLabelAlign.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="formLabelAlign.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号：" prop="mobile">
            <el-input v-model="formLabelAlign.mobile"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="addUser">确定</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 修改用户对话框 -->
      <el-dialog
        v-model="modifyDialog"
        title="修改用户"
        width="50%"
        @close="editClose"
      >
        <el-form
          :label-position="labelPosition"
          label-width="100px"
          :model="formEditDialog"
          :rules="rules"
          ref="formEditRef"
        >
          <el-form-item label="用户名：" prop="username">
            <el-input v-model="formEditDialog.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="formEditDialog.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号：" prop="mobile">
            <el-input v-model="formEditDialog.mobile"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="modifyDialog = false">取消</el-button>
            <el-button type="primary" @click="editUser">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getUsers,
  putUsers,
  getAddUsers,
  getEditUser,
  putEditUser,
  deleteUser,
} from "@/http/index.js";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  name: "Users",
  data() {
    const checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的邮箱"));
    };
    const checkMobile = (rule, value, cb) => {
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的手机号"));
    };

    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      modifyDialog: false,
      //添加用户数据初始值
      formLabelAlign: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //修改用户数据初始值
      formEditDialog: {
        id: "",
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3~10个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 15,
            message: "用户名的长度在6~15个字符之间",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getUsersList();
  },
  methods: {
    handleSizeChange(newPage) {
      this.queryInfo.pagesize = newPage;
      this.getUsersList();
    },
    handleCurrentChange(p) {
      this.queryInfo.pagenum = p;
      this.getUsersList();
    },
    addClose() {
      //获取到form表单的ref掉用resetFields重置字段
      this.$refs.formAddRef.resetFields();
    },
    editClose() {
      //获取到form表单的ref掉用resetFields重置字段
      this.$refs.formEditRef.resetFields();
    },
    //添加用户信息
    addUser() {
      this.$refs.formAddRef.validate((valid) => {
        // console.log(!valid); // 返回false true
        if (!valid) return;
        //可以发起添加用户的网络请求
        console.log(
          this.formLabelAlign.username,
          this.formLabelAlign.password,
          this.formLabelAlign.email,
          this.formLabelAlign.mobile
        );
        getAddUsers(
          this.formLabelAlign.username,
          this.formLabelAlign.password,
          this.formLabelAlign.email,
          this.formLabelAlign.mobile
        ).then((res) => {
          // console.log(res);
          if (res.meta.status !== 201) return ElMessage.error("添加用户失败");
          this.dialogVisible = false;
          this.getUsersList();
        });
      });
    },
    editDialog(ids) {
      this.modifyDialog = true;
      // console.log(id);
      getEditUser(ids).then((res) => {
        // console.log(res);
        if (res.meta.status !== 200) return ElMessage.error("查询用户信息失败");
        this.formEditDialog.id = res.data.id;
        this.formEditDialog.username = res.data.username;
        this.formEditDialog.email = res.data.email;
        this.formEditDialog.mobile = res.data.mobile;
      });
    },
    //修改用户信息
    editUser() {
      putEditUser(
        this.formEditDialog.id,
        this.formEditDialog.email,
        this.formEditDialog.mobile
      ).then((res) => {
        console.log(res);
        if (res.meta.status !== 200) return ElMessage.error("修改用户信息失败");
        this.modifyDialog = false;
        this.getUsersList();
        ElMessage({ message: "更新用户信息成功", type: "success" });
      });
    },
    //删除用户信息
    deleteTooltip(id) {
      ElMessageBox.confirm("确定要删除用户信息吗?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "Warning",
      })
        .then(() => {
          // console.log(res);
          deleteUser(id).then((res) => {
            if (res.meta.status !== 200) return ElMessage.error("删除用户失败");
            ElMessage({
              type: "success",
              message: "成功删除用户信息",
            });
            this.getUsersList();
          });
        })
        .catch(() => {
          // ElMessage({
          //   type: "info",
          //   message: "成功删除用户信息",
          // });
        });
    },
    getUsersList() {
      getUsers(
        this.queryInfo.query,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      ).then((res) => {
        // console.log(res);
        if (res.meta.status !== 200) return ElMessage.error("获取用户列表失败");
        this.userList = res.data.users;
        this.total = res.data.total;
        // console.log(this.userList);
      });
    },
    userStateChange(userinfo) {
      putUsers(userinfo.id, userinfo.mg_state).then((res) => {
        if (res.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state;
          return ElMessage.error("更新用户状态失败");
        }
        ElMessage({ message: "更新用户状态成功", type: "success" });
      });
    },
  },
};
</script>
<style lang="less" scoped>
</style>