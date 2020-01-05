<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="showAddCateDialog" >添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
        style="margin-top:15px"
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope>
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3,5,7,8,9,10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加列表对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close='addCateDialogClosed'>
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类:" prop="cat_name">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            style="width:100%;"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearabl clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //商品分类的数据列表，默认为空
      cateList: [],
      //总数量
      total: 0,
      //为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          //当前列为自定义模板
          type: 'template',
          //当前这里一列的模板名称
          template: 'isOk'
        },
        {
          label: '排序',
          //当前列为自定义模板
          type: 'template',

          template: 'order'
        },
        {
          label: '操作',
          //当前列为自定义模板
          type: 'template',

          template: 'opt'
        }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        //将要添加分类的名称
        cat_name: '',
        //父级分类的id
        cat_pid: 0,
        //分类层级
        cat_level: 0
      },
      //添加表单的验证规则
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类的名称',
            trigger: 'blur'
          }
        ]
      },
      addCateFormRef: {},
      //父级分类的列表
      parentCateList: [],
      //指定练级选择器配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      //选中父级分类的ID素组
      selectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      //  console.log(data);

      if (data.meta.status !== 200) {
        this.$message.error('获取商品列表失败')
      } else {
        //把数据列表赋值给cateList
        this.cateList = data.data.result
        //为总数据条数赋值
        this.total = data.data.total
      }
    },
    //监听pigesize的变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum
      this.getCateList()
    },
    showAddCateDialog() {
      //先获取父级数据列表
      this.getOarentCateList()
      //在展示对话框
      this.addCateDialogVisible = true
    },
    //获取父级分类列表的数据
    async getOarentCateList() {
      const { data } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (data.meta.status !== 200) {
        this.$message.error('获取数据失败')
      } else {
        this.parentCateList = data.data
      }
    },
    parentCateChanged() {
      if(this.selectedKeys.length>0){
         this.addCateForm.cat_pid= this.selectedKeys[this.selectedKeys.length-1]
         this.addCateForm.cat_level=this.selectedKeys.length
      }else{
          this.addCateForm.cat_pid=0
         this.addCateForm.cat_level=0
      }
    },
    addCate(){
       this.$refs.addCateFormRef.validate(async valid=>{
           if(!valid){
               return
           }else {
             const {data} =await this.$http.post('categories',this.addCateForm) 
              if(data.meta.status!==201){
                  this.$message.error('添加商品失败')
              }else{
                  this.getCateList()
                   this.$message.success('添加商品成功')
                  this.addCateDialogVisible=false
              }
           }

       })
        
    },
    addCateDialogClosed(){
        this.$refs.addCateFormRef.resetFields()
       this.selectedKeys=[]
       this.addCateForm.cat_pid=0
       this.addCateForm.cat_level=0
        
    }
  }
}
</script>

<style lang="less" scoped>

</style>