<template>
  <div>
    <v-textarea v-model="json" rows="20" readonly />
  </div>
</template>

<script>
export default {
  props: ["p"],

  data() {
    return {
      json: null,
    };
  },

  mounted() {
    this.json = JSON.stringify(this.p, null, 2);
  },
};
</script>
