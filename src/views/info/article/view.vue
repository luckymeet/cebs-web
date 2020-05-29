<template>
  <article-detail :is-view="true" />
</template>

<script>
import ArticleDetail from './articleDetail'

export default {
  name: 'EditArticle',
  components: { ArticleDetail }
}
</script>

