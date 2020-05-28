<template>
  <article-detail :is-edit="true" />
</template>

<script>
import ArticleDetail from './articleDetail'

export default {
  name: 'EditArticle',
  components: { ArticleDetail }
}
</script>

