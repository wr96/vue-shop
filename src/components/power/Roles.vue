<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

     <!-- 卡片试图 -->
    <el-card>
        <!-- 添加角色区域 -->
        <el-row>
            <el-col>
                <el-button type='primary'>添加角色</el-button>
            </el-col>
        </el-row>

        <!-- 角色列表 -->
         <el-table :data='rolelist' stripe border>
             <!-- 展开列 -->
              <el-table-column type='expand' >
                  <template slot-scope="scope">
                    <el-row :class="['bb' ,index===0?'bt':'','center']" v-for="(item1,index) in scope.row.children" :key='item1.id'>
                        <!-- 一级列表 -->
                       <el-col :span='5'>
                           <el-tag @close='RemoveId(scope.row,item1.id)' closable>{{item1.authName}}</el-tag>
                           <i class="el-icon-caret-right"></i>
                           </el-col> 
                           <!-- 二级三级列 -->
                       <el-col :span='19'>
                       <el-row  :class="[index2===0?'':'bt' ,'center']" v-for="(item2,index2) in item1.children" :key='item2.id'>
                           <el-col  :span='6'><el-tag type='success' @close='RemoveId(scope.row,item2.id)' closable>{{item2.authName}}</el-tag>
                           <i class="el-icon-caret-right"></i></el-col>
                           <!-- 三级列 -->
                           <el-col :span='18'>
                            <el-tag type='warning' v-for='(item3) in item2.children' :key='item3.id' closable @close='RemoveId(scope.row,item3.id)'>{{item3.authName}}</el-tag>
                           </el-col>
                       </el-row>
                       
                       <el-row></el-row>       
                       </el-col> 
                    </el-row>

                      
                  </template>
              </el-table-column>
             <!-- 索引列 -->
            <el-table-column type='index' ></el-table-column>
            <el-table-column label='角色名称' prop='roleName'></el-table-column>
            <el-table-column label='角色描述' prop='roleDesc'></el-table-column>
            <el-table-column label='操作' prop='level'>
                <template slot-scope="scope">
                   
                    <el-button v-model="scope.row" type="primary" size='mini' icon="el-icon-edit">编辑</el-button>
                    <el-button type="danger" size='mini' icon="el-icon-delete">删除</el-button>
                    <el-button type="warning" size='mini' icon="el-icon-setting" @click='fpqx(scope.row)'>分配权限</el-button>
                  
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <!-- 分配权限 -->
    <el-dialog
  title="分配权限"
  :visible.sync="fengpeiquanxian"
  width="50%"
  @close='setRightDialogClosed'>
     <!-- 树形控件 -->
 <el-tree :data="rightList" :props="treeProps" show-checkbox default-expand-all node-key='id'
 :default-checked-keys='defKyes' ref='treeRef'></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="fengpeiquanxian = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>


    </div>

   
</template>

<script>
export default {
    data (){
        return {
            //列表角色数据
            rolelist:[],
            fengpeiquanxian:false,
            rightList:[],
            treeProps:{
                 children: 'children',
                 label:'authName'
            },
            
            defKyes: [],
            roleId:'',
             //控制对话框的显示与英藏
        setRoleDialogVisible:false
        }
       
    },
    created(){
     this.getRolesList()
    },
    methods:{
       async getRolesList(){
         const {data} = await this.$http.get('roles')
         if(data.meta.status!==200){
             this.$message.error('获取角色列表失败')
         }else{
             this.rolelist=data.data
         }
        },
        //根据id删除权限
      async  RemoveId (s,i) {
     const conf =  await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch( err=>err )
           if(conf!=='confirm'){
               this.$message.info('取消了删除')
           }else {
               console.log(s);
               
           const {data} = await  this.$http.delete(`roles/${s.id}/rights/${i}`)
           console.log(data);
           
               if(data.meta.status!==200){
                   this.$message.error('删除失败')
               }else{
                //    this.$message.success('删除成功')
                //    this.getRolesList()
                 s.children=data.data
               }
           }
        },   
     async fpqx(role){
         this.roleId=role.id
       const {data} = await this.$http.get('rights/tree')
       if(data.meta.status!==200){
           this.$message.error('获取权限失败')
       }else{
          this.rightList=data.data
        //   console.log(this.rightList);
       }  
       this.getKeys(role,this.defKyes)
            this.fengpeiquanxian=true
      },
      //通过递归 获取角色下三级节点
      getKeys(node,arr){
        if(!node.children) {
            arr.push(node.id)
        }else{
            node.children.forEach(item=>
            this.getKeys(item,arr))
        }
      },
      setRightDialogClosed(){
          this.defKyes=[]
      },
     async allotRights(){
         const keys=[
             ...this.$refs.treeRef.getCheckedKeys(),
             ...this.$refs.treeRef.getHalfCheckedKeys()
         ]
        //  console.log(keys);
        const idStr=keys.join(',')
        console.log(this.roleId);
        
        const {data} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
         if(data.meta.status!==200){
             this.$message.error('分配权限失败')
             console.log(data);
             
         }else{
             this.$message.success('分配权限成功')
             this.getRolesList()
             this.fengpeiquanxian=false
         }
      }
    
    }

}
</script>

<style lang="less" scoped>
.el-tag {
    margin: 7px;
}
.bt {
    border-top: 1px solid #eee
}
.bb {
    border-bottom: 1px solid #eee
}
.center {
    display: flex;
    align-items: center;
}
</style>