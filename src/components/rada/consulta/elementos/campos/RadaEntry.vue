<template>
  <v-row>
    <v-col cols="12" xs="12" sm="3">
      <div class="info-label">{{label}}</div>
    </v-col>
    <v-col cols="12" xs="12" sm="9">
      <div class="info-content">
        {{value}}
        <slot name="valor"></slot>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["label", "value"]
};
</script>

<style scoped>
.info-label {
  color: #1a237e;
  padding: 6px;
  font-weight: 400;
  height: auto;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  margin: 5px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}
</style>