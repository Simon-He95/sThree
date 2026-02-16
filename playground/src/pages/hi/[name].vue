<script setup lang="ts">
const route = useRoute()
const name = computed(() => String(route.params.name || 'Visitor'))
</script>

<template>
  <main>
    <h1>Hi, {{ name }}</h1>
    <p>This is a lightweight sThree demo route.</p>
    <RouterLink to="/">
      Back to Home
    </RouterLink>
  </main>
</template>
