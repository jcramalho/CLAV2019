<template>
  <v-col style="text-align:center;">
    <p>A carregar {{ message }}...</p>
    <v-progress-circular
      indeterminate
      size="100"
      width="10"
      color="blue darken-3"
    />
  </v-col>
</template>

<script>
export default {
  props: ["message"]
};
</script>
