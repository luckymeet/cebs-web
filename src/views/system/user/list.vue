<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.realName" placeholder="真实姓名" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="listQuery.loginName" placeholder="登录账号" style="width: 200px;" class="filter-item" clearable />
<!--       <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item"> -->
<!--         <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" /> -->
<!--       </el-select> -->
<!--       <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px"> -->
<!--         <el-option v-for="item in sexTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" /> -->
<!--       </el-select> -->
<!--       <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter"> -->
<!--         <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" /> -->
<!--       </el-select> -->
      <el-button v-waves style="margin-left: 10px;" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
		查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh-left" @click="listQuery={}">
		重置
      </el-button>
    </div>
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">
      	新增
      </el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
      	修改
      </el-button>

    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
<!--       <el-table-column type="selection" align="center" width="50"></el-table-column> -->
      <el-table-column label="用户编号" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.userNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录账号" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.loginName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生效状态" class-name="status-col" width="100px">
        <template slot-scope="{row}">
		<el-switch
		  @click="changeStatus(row.id)"
		  v-model="row.status"
		  :active-value="1"
		  :inactive-value="0">
		</el-switch>
        </template>
      </el-table-column>
      <el-table-column label="最后登录时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lastLoginTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
           	 编辑
          </el-button>
          <el-button size="mini" type="success" @click="handleView(row)">
             查看
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
           	 删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="user" label-position="right" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="user.realName" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="user.nickName" />
        </el-form-item>
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="user.loginName" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="user.sex" clearable class="filter-item" placeholder="请选择">
            <el-option v-for="item in sexTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker v-model="user.birthday" type="date" placeholder="请选择" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobilePhone">
          <el-input v-model="user.mobilePhone" />
        </el-form-item>
        <el-form-item label="电子邮箱" prop="eMail">
          <el-input v-model="user.eMail" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="user.idCard" clearable/>
        </el-form-item>
        <el-form-item label="生效状态">
          <el-switch
		    v-model="user.status"
		    :active-value="1"
		    :inactive-value="0">
		  </el-switch>
        </el-form-item>
        <el-form-item label="权限">
          <el-tree
			:data="permTree"
		    node-key="id"
		    ref="permTree"
		    :default-checked-keys="permArray"
		    show-checkbox
		    @check-change="handleCheckChange">
		  </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
        	取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          	确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchUserList, getUser, addUser, editUser, deleteUser } from '@/api/user'
import { queryCurUserOneLevelPermList, queryCurUserPermTree } from '@/api/perm'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const sexTypeOptions = [
  { key: '0', display_name: '女' },
  { key: '1', display_name: '男' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = sexTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'User',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
    	pageNum: 1,
    	pageSize: 10
      },
      user: {
        status: '1'
      },
      permTree:[],
      permArray:[],
      dialogFormVisible: false,
      dialogStatus: '',
      sexTypeOptions,
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchUserList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetUser() {
      this.user = {
    	status:'1'
      }
    },
    handleCreate() {
      this.resetUser()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.loadPermTree()
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addUser(this.user).then(response => {
        	  this.user.id = response.data
			  this.$message({
			    type: 'success',
			    message: '新增成功!'
			  });
          })
        }
      })
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      getUser(row.id).then(response => {
        this.user = response.data
        this.loadPermTree()
        this.permArray = this.user.permIds.split(',')
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var keys = this.$refs.permTree.getCheckedKeys()
          this.user.permIds = keys.join()
          editUser(this.user).then(response => {
		    this.$message({
		      type: 'success',
			  message: '修改成功!'
	        });
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
		  confirmButtonText: '确定',
		  cancelButtonText: '取消',
		  type: 'warning'
      }).then(() => {
	      deleteUser(this.user).then(response => {
			  this.$message({
			    type: 'success',
			    message: '删除成功!'
			  });
	      })
	  }).catch(() => {
		  this.$message({
		    type: 'info',
		    message: '已取消删除'
		  });
	  });
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
//     handleNodeClick(data) {
//       console.log(data);
//     },
 	loadPermTree() {
      queryCurUserPermTree().then(response => {
    	this.permTree = response.data;
	  })
    }

//     loadNode(node, resolve) {
//       if (node.level === 0) {
//     	queryCurUserOneLevelPermList().then(response => {
//         	return resolve(response.data);
//       	})
//       }
//       if (node.level > 1) return resolve([]);

//       var hasChild;
//       if (node.data.name === 'region1') {
//         hasChild = true;
//       } else if (node.data.name === 'region2') {
//         hasChild = false;
//       } else {
//         hasChild = Math.random() > 0.5;
//       }

//       setTimeout(() => {
//         var data;
//         if (hasChild) {
//           data = [{
//             name: 'zone' + this.count++
//           }, {
//             name: 'zone' + this.count++
//           }];
//         } else {
//           data = [];
//         }

//         resolve(data);
//       }, 500)
//     }
  }
}
</script>
