<template>
  <div class="home">
    <Wysiwyg msg="Time to customized your Vue App" />
  </div>
</template>

<script>
// @ is an alias to /src
import Wysiwyg from '@/components/Wysiwyg.vue'

export default {
  name: 'home',
  components: {
    Wysiwyg
  }
}
</script>
