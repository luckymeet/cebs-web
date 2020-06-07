<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.realName" placeholder="真实姓名" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="listQuery.loginName" placeholder="登录账号" style="width: 200px;" class="filter-item" clearable />
      <el-button v-waves style="margin-left: 10px;" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh-left" @click="listQuery={}">
        重置
      </el-button>
    </div>
    <div class="filter-container">
      <el-button v-permission="['sys:user:add']" class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">
        新增
      </el-button>
      <el-button v-permission="['sys:user:password:reset']" class="filter-item" type="primary" icon="el-icon-refresh-left" @click="handleCreate">
        密码重置
      </el-button>
    </div>
    <el-table :key="tableKey" :data="list" border fit highlight-current-row style="width: 98%;">
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
          <el-switch v-model="row.status" :disabled="!checkPermission(['sys:user:status:change'])" :active-value="1" :inactive-value="0" @click="changeStatus(row)" />
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
      <el-table-column label="操作" align="center" width="200px" fixed="right">
        <template slot-scope="{row}">
          <el-button v-permission="['sys:user:edit']" size="mini" type="text" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-permission="['sys:user:view']" size="mini" type="text" @click="handleView(row)">
            查看
          </el-button>
          <el-button v-permission="['sys:user:delete']" size="mini" type="text" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="user" label-position="right" :disabled="disabled" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="user.realName" clearable />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="user.nickName" clearable />
        </el-form-item>
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="user.loginName" clearable />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="user.sex" class="filter-item" placeholder="请选择" clearable>
            <el-option v-for="item in sexTypeOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker v-model="user.birthday" type="date" placeholder="请选择" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobilePhone">
          <el-input v-model="user.mobilePhone" clearable />
        </el-form-item>
        <el-form-item label="电子邮箱" prop="eMail">
          <el-input v-model="user.eMail" clearable />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="user.idCard" clearable />
        </el-form-item>
        <el-form-item label="生效状态">
          <el-switch v-model="user.status" :inactive-value="0" :active-value="1" />
        </el-form-item>
        <el-form-item label="权限">
          <el-tree ref="permTree" :data="permTree" node-key="id" :default-checked-keys="permArray" show-checkbox />
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
import { fetchUserList, getUser, addUser, editUser, deleteUser, viewUser, changeStatus } from '@/api/user'
import { queryCurUserPermTree } from '@/api/perm'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const sexTypeOptions = [
  { key: 0, label: '女' },
  { key: 1, label: '男' }
]

export default {
  name: 'User',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      user: {},
      permTree: [],
      permArray: [],
      dialogFormVisible: false,
      disabled: false,
      dialogStatus: '',
      sexTypeOptions,
      textMap: {
        update: '编辑',
        create: '新增',
        view: '查看'
      },
      rules: {
        nickName: [{ required: true, message: '请输入昵称', trigger: 'change' }],
        loginName: [{ required: true, message: '请输入登录名', trigger: 'change' }],
        mobilePhone: [{ pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }],
        eMail: [{ type: 'email', message: '请输入正确的电子邮箱', trigger: 'blur' }],
        idCard: [{ pattern: /^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入正确的身份证号', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchUserList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
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
        status: 1
      }
      this.permArray = []
    },
    handleCreate() {
      this.resetUser()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.disabled = false
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
            this.dialogFormVisible = false
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            this.handleFilter()
          })
        }
      })
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.disabled = false
      getUser(row.id).then(response => {
        this.user = response.data
        this.loadPermTree()
        this.permArray = this.user.permIds.split(',')
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var keys = this.$refs['permTree'].getCheckedKeys()
          this.user.permIds = keys.join()
          editUser(this.user).then(response => {
            this.dialogFormVisible = false
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.handleFilter()
          })
        }
      })
    },
    handleView(row) {
      this.dialogStatus = 'view'
      this.dialogFormVisible = true
      this.disabled = true
      viewUser(row.id).then(response => {
        this.user = response.data
        this.loadPermTree()
        this.permArray = this.user.permIds.split(',')
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.handleFilter()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    loadPermTree() {
      queryCurUserPermTree().then(response => {
        this.permTree = response.data
      })
    },
    changeStatus(row) {
      changeStatus({ 'id': row.id, 'status': row.status }).then(
        response => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        },
        error => {
          row.status = (row.status + 1) % 2
        })
    },
  }
}

</script>
