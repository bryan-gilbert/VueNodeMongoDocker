<template lang="pug">
  div(class="home")
    Collab
</template>

<script>
// @ is an alias to /src
import Wysiwyg from '@/components/Wysiwyg.vue'
import Collab from '@/components/Collab.vue'

export default {
  name: 'home',
  components: {
    Collab,
    Wysiwyg
  }
}
</script>
