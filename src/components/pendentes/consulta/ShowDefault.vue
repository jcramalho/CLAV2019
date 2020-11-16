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
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
