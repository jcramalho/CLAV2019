<template>
  <v-row>
    <v-col xs="12" sm="3">
      <div class="info-label">{{ label_1 }}</div>
    </v-col>
    <v-col xs="12" sm="3">
      <div class="info-content">
        {{ value_1 }}
        <slot name="valor1"></slot>
      </div>
    </v-col>
    <v-col xs="12" sm="3">
      <div class="info-label">{{ label_2 }}</div>
    </v-col>
    <v-col xs="12" sm="3">
      <div class="info-content">
        {{ value_2 }}
        <slot name="valor2"></slot>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["label_1", "value_1", "label_2", "value_2"]
};
</script>

<style>
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
