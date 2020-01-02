<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加搜索框 -->

      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" v-on:click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="ss">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>v-on:
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              v-on:click="xiugai(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click='removeUserId(scope.row.id)'></el-button>
            <!-- 角色分配 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 3, 4, 6]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" v-on:close="addClose">
      <!-- 内容主题区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" v-on:close="addClose1">
      <el-form :model="editForm" :rules="ediFormRules" ref="editFormRef" label-width="70px" >
        <el-form-item label="用户">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop='email'>
          <el-input v-model="editForm.email" ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop='mobile'>
          <el-input v-model="editForm.mobile" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ediUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //验证邮箱
    var checkEmail = (rule, value, callback) => {
      //  const email = this.value;
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (regEmail.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入合法的邮箱'))
      }
    }
    //验证手机
    var checkMobile = (rule, value, callback) => {
      var mobile = /^1[34578]\d{9}$/
      if (mobile.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入正确的手机号码'))
      }
    }
    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: '',
        //当前页数
        pagenum: 1,
        //每页显示多少条
        pagesize: 2
      },
      userlist: [],
      total: 0,
      //控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      //添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度在3-10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码长度在6-15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制用户修改的显示与隐藏
      editDialogVisible: false,
      //查询到的用户信息对象
      editForm: {},
      //修改表单的验证规则对象
      ediFormRules:{
        email:[
          {required:true,message:'请输入用户邮箱',trigger:'blur'},
          {validator:checkEmail,trigger:'blur'}
        ],
        mobile:[
          {required:true,message:'请输入手机号码',trigger:'blur'},
          {validator:checkMobile,trigger:'blur'}
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },

  methods: {
    async getUserList() {
      const { data: data } = await this.$http.get('users', {
        params: this.queryInfo
      })
      //  console.log(data);
      if (data.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      } else {
        this.userlist = data.data.users
        this.total = data.data.total
      }
    },
    //监听总页数
    handleSizeChange(newsize) {
      //    console.log(newsize);
      this.queryInfo.pagesize = newsize
      this.getUserList()
    },
    //监听页码
    handleCurrentChange(newpage) {
      // console.log(newpage);
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
    //监听watch开关
    async userStateChanged(userInfo) {
      //  console.log(userInfo);
      const { data: data } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (data.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      } else {
        this.$message.success('更新用户成功')
      }
    },
    ss() {
      this.addDialogVisible = true
    },
    //监听添加对话框关闭时重置
    addClose() {
      this.$refs.addFormRef.resetFields()
    },
    addClose1(){
      this.$refs.editFormRef.resetFields()
    },
    //点击确定按钮 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        //  console.log(valid);
        if (!valid) {
          return
        } else {
          const { data } = await this.$http.post('users', this.addForm)
          // console.log(data);
          if (data.meta.status !== 201) {
            this.$message.error('添加用户失败')
          } else {
            this.$message.success('添加用户成功')
            //影藏添加对话框
            this.addDialogVisible = false
            //更新表单
            this.getUserList()
          }
        }
      })
    },
    //展示编辑用户对话框
    async xiugai(id) {
      const {data} = await this.$http.get('users/' + id)
      console.log(data.data.meta)
      console.log(id)
      if (data.meta.status !== 200) {
         this.$message.error('查询用户失败')
      } else {
        this.editForm = data.data
      }

      this.editDialogVisible = true
    },
    ediUserInfo (){
      this.$refs.editFormRef.validate(async valid=>{
        // console.log(valid)
        if(!valid){
          return
        }else{
        const {data} = await this.$http.put('users/'+this.editForm.id,{
            email:this.editForm.email,
            mobile:this.editForm.mobile
          })
          if (data.meta.status!==200){
            this.$message.error('用户列表更新失败')
          }else{
            //关闭对话框
            this.editDialogVisible=false
            //跟新列表数据
            this.getUserList()
            //提示修改成功
            this.$message.success('用户列表更新成功')
          }
        };
        
      })
    },
    //根据ID删除用户信息
   async removeUserId(id){
      //提示是否要删除
      const date = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        // console.log(date);
        if(date!=='confirm'){
          this.$message.info('删除已取消')
        }else{
          
          const {data} = await this.$http.delete('users/'+id)
          if(data.meta.status!==200){
            this.$message.error('删除失败')
             console.log(id);
          }else{
            this.$message.success('删除成功')
            this.getUserList()
           
            
          }
        }
        

    }
  }
}
</script>

<style lang="less" scoped>
</style>