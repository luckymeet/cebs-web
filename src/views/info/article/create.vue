<template>
  <article-detail :is-edit="false" />
</template>

<script>
import ArticleDetail from './articleDetail'

export default {
  name: 'CreateArticle',
  components: { ArticleDetail }
}
</script>

