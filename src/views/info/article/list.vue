<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="标题" style="width: 200px;" class="filter-item" clearable />
      <el-date-picker v-model="publishTimeRange" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" unlink-panels range-separator="-" start-placeholder="发布开始日期" end-placeholder="发布结束日期" align="right" class="filter-item" />
      <el-select v-model="listQuery.status" placeholder="生效状态" class="filter-item">
        <el-option label="生效" value="1" />
        <el-option label="未生效" value="0" />
      </el-select>
      <el-select v-model="listQuery.isRecommend" placeholder="是否推荐" class="filter-item">
        <el-option label="推荐" value="1" />
        <el-option label="未推荐" value="0" />
      </el-select>
      <el-button style="margin-left: 10px;" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-refresh-left" @click="listQuery={};publishTimeRange=['', '']">
        重置
      </el-button>
    </div>
    <div class="filter-container">
      <router-link :to="'/info/article/create'">
        <el-button class="filter-item" type="primary" icon="el-icon-plus">
          新增
        </el-button>
      </router-link>
    </div>
    <el-table :data="list" border fit highlight-current-row style="width: 98%">
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="300px" label="标题">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" label="简介">
        <template slot-scope="{row}">
          <span>{{ row.introduction }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="发布时间">
        <template slot-scope="{row}">
          <span>{{ row.publishTime }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="作者">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生效状态" class-name="status-col" width="100px">
        <template slot-scope="{row}">
          <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @input="changeStatus(row)" />
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" class-name="status-col" width="100px">
        <template slot-scope="{row}">
          <el-switch v-model="row.isRecommend" :active-value="1" :inactive-value="0" @input="changeRecommend(row)" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px" fixed="right">
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="router.push('/info/article/edit/' + row.id);">
            编辑
          </el-button>
          <el-button type="text" size="mini" @click="router.push('/info/article/view/' + row.id);">
            查看
          </el-button>
          <el-button type="text" size="mini" v-if="!row.publishTime" @click="handlePublish(row)">
            发布
          </el-button>
          <el-button type="text" size="mini" v-if="row.publishTime" @click="cancelPublish(row)">
            取消发布
          </el-button>
          <el-button type="text" size="mini" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog title="文章发布" :visible.sync="publishDialogVisible" width="30%">
      <el-form :model="article">
        <el-form-item label="发布时间" prop="publishTime">
          <el-date-picker v-model="article.publishTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="publishDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="publish()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { fetchArticleList, deleteArticle, publish, cancelPublish, changeStatus, changeRecommend } from '@/api/article'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ArticleList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      publishTimeRange: ['', ''],
      article: {},
      publishDialogVisible: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近7天',
          onClick(picker) {
            const start = new Date(new Date().setHours(0, 0, 0, 0))
            const end = new Date(new Date().setHours(23, 59, 59, 999))
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '往后7天',
          onClick(picker) {
            const start = new Date(new Date().setHours(0, 0, 0, 0))
            const end = new Date(new Date().setHours(23, 59, 59, 999))
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近30天',
          onClick(picker) {
            const start = new Date(new Date().setHours(0, 0, 0, 0))
            const end = new Date(new Date().setHours(23, 59, 59, 999))
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '往后30天',
          onClick(picker) {
            const start = new Date(new Date().setHours(0, 0, 0, 0))
            const end = new Date(new Date().setHours(23, 59, 59, 999))
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 29)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listQuery.publishStartTime = this.publishTimeRange[0]
      this.listQuery.publishEndTime = this.publishTimeRange[1]
      fetchArticleList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handlePublish(row) {
      if (row.status !== 1) {
        this.$message({
          type: 'warning',
          message: '请先将文章置为生效状态'
        })
        return
      }
      this.article.id = row.id
      this.publishDialogVisible = true
    },
    publish() {
      publish({ 'id': this.article.id, 'publishTime': this.article.publishTime }).then(response => {
        this.publishDialogVisible = false
        this.$message({
          type: 'success',
          message: '发布成功'
        })
        this.handleFilter()
      })
    },
    cancelPublish(row) {
      cancelPublish(row.id).then(response => {
        row.publishTime = ''
        this.$message({
          type: 'success',
          message: '取消成功'
        })
      })
    },
    changeStatus(row) {
      if (row.status === 1 && (!row.title || !row.introduction || !row.content)) {
        this.$message({
          message: '请先将标题、简介、内容填写完整',
          type: 'warning'
        })
        row.status = 0
        return
      }
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
    changeRecommend(row) {
      if (row.isRecommend === 1 && row.status !== 1) {
        this.$message({
          type: 'warning',
          message: '请先将文章置为生效状态'
        })
        row.isRecommend = 0
        return
      }
      changeRecommend({ 'id': row.id, 'isRecommend': row.isRecommend }).then(
        response => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        },
        error => {
          row.isRecommend = (row.isRecommend + 1) % 2
        })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(row.id).then(response => {
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
    }
  }
}

</script>
<style scoped>
.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}

</style>
