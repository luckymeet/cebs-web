<template>
  <div class="createPost-container">
    <sticky :z-index="10" :class-name="article.status == 1 && article.id != null ? 'sub-navbar published' : 'sub-navbar draft'">
      <el-button v-loading="loading" style="margin-left: 10px;" v-if="!isView" type="success" @click="submitForm">
        保存
      </el-button>
      <el-button v-loading="loading" type="warning" @click="back()">
        返回
      </el-button>
    </sticky>
    <el-form ref="article" :model="article" :rules="rules" class="form-container" :disabled="isView">
      <div class="createPost-main-container" :disabled="isView">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="article.title" :maxlength="100" name="name" required :disabled="isView">
                标题
              </MDinput>
            </el-form-item>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item prop="author" label-width="60px" label="作者:" class="postInfo-container-item">
                    <el-input v-model="article.author" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item prop="publishTime" label-width="120px" label="发布时间:" class="postInfo-container-item">
                    <el-date-picker v-model="article.publishTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item prop="status" label-width="90px" label="生效状态:" class="postInfo-container-item">
                    <el-switch v-model="article.status" :inactive-value="0" :active-value="1" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item prop="sourceAuthor" label-width="60px" label="源作者:" class="postInfo-container-item">
                    <el-input v-model="article.sourceAuthor" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item prop="sourceLink" label-width="120px" label="源链接:" class="postInfo-container-item">
                    <el-input v-model="article.sourceLink" :rows="1" type="textarea" style="width: 150%" class="article-textarea" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item prop="isShowDisclaimer" label-width="90px" label="免责申明:" class="postInfo-container-item">
                    <el-switch v-model="article.isShowDisclaimer" :inactive-value="0" :active-value="1" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-form-item prop="introduction" label-width="60px" label="简介:">
          <el-input v-model="article.introduction" :rows="1" type="textarea" class="article-textarea" autosize />
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;">
          <span v-show="contentShortLength" style="float: right;" class="word-counter">字数：{{ contentShortLength }}</span>
        </el-form-item>
        <el-form-item prop="content" style="margin-bottom: 30px;" :disabled="isView">
          <Tinymce ref="editor" v-model="article.content" :height="400" :disabled="isView" />
        </el-form-item>
        <el-form-item prop="imageUri" style="margin-bottom: 30px;">
          <Upload v-model="article.imageUri" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { fetchArticle, createArticle, updateArticle } from '@/api/article'

const defaultForm = {
  status: 1,
  title: '', // 文章题目
  content: '', // 文章内容
  introduction: '', // 文章摘要
  sourceLink: '', // 文章外链
  imageUri: '', // 文章图片
  publishTime: undefined, // 前台展示时间
  id: undefined
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce, MDinput, Upload, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          callback(new Error('源链接url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      article: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        title: [{ validator: validateRequire, message: '请输入标题' }, { max: 50, message: '标题长度不能超过50个字符', trigger: 'change' }],
        content: [{ validator: validateRequire, message: '请输入内容' }],
        introduction: [{ validator: validateRequire, message: '请输入简介' }, { max: 200, message: '简介长度不能超过200个字符', trigger: 'change' }],
        sourceLink: [{ validator: validateSourceUri, trigger: 'blur' }, { max: 500, message: '源链接不能超过500个字符', trigger: 'change' }]
      },
      tempRoute: {}
    }
  },
  computed: {
    contentShortLength() {
      return this.article.introduction.length
    }
    // publishTime: {
    // set and get is useful when the data
    // returned by the back end api is different from the front end
    // back end return => "2013-06-25 06:59:25"
    // front end need timestamp => 1372114765000
    // get() {
    //   return (+new Date(this.article.publishTime))
    // },
    // set(val) {
    //   this.article.publishTime = new Date(val)
    // }
    // }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else if (this.isView) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchArticle(id).then(response => {
        this.article = response.data

        // just for test
        // this.article.title += `   Article Id:${this.article.id}`
        // this.article.introduction += `   Article Id:${this.article.id}`

        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '修改文章'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.article.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '修改文章'
      document.title = `${title} - ${this.article.id}`
    },
    submitForm() {
      if (this.article.id) {
        this.updateArticle()
      } else {
        this.createArticle()
      }
    },
    createArticle() {
      this.loading = true
      createArticle(this.article).then(response => {
        this.article.id = response.data
        this.loading = false
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
      // this.$ajax({
      //   url: "/info/article",
      //   method: "post",
      //   headers: {
      //     'Content-type': 'application/json;charset=UTF-8'
      //   },
      //   data: this.$ajax.adornData(this.article, false, 'json')
      // }).then((res) => {
      //   if (res && res.code === 200) {
      //     this.$notify({
      //       title: '成功',
      //       message: '修改成功',
      //       type: 'success',
      //       duration: 2000
      //     })
      //   }
      // })
    },
    updateArticle() {
      this.loading = true
      updateArticle(this.article).then(response => {
        this.loading = false
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
      // this.$ajax({
      //   url: "/info/article",
      //   method: "put",
      //   headers: {
      //     'Content-type': 'application/json;charset=UTF-8'
      //   },
      //   data: this.$ajax.adornData(this.article, false, 'json')
      // }).then((res) => {
      //   if (res && res.code === 200) {
      //     this.$notify({
      //       title: '成功',
      //       message: '修改成功',
      //       type: 'success',
      //       duration: 2000
      //     })
      //   }
      // })
    },
    back() {}
  }
}

</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 80px;
    position: absolute;
    right: 0px;
    top: 0px;
    color: #606266
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}

</style>
