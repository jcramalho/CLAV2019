<template>
      <div class="info-content">{{ JSON.stringify(p) }}</div>
</template>

<script>
export default {
  props: ["p"]
};
</script>
<style scoped>
.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
  border-radius: 3px;
}
</style>
