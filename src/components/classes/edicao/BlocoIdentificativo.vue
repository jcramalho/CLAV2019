<template>
  <v-container fluid class="pa-0 ma-0" style="max-width:100%;">
    <v-row>
      <v-col cols="12" lg="2">
        <div class="info-label">Nível</div>
      </v-col>
      <v-col cols="12" lg="10">
        <div class="info-content pa-4 px-5 pb-6" style="min-height: 50px;">
          <v-text-field
            :value="c.nivel"
            class="mt-n4 px-3"
            disabled
            text
            hide-details
            single-line
            color="blue darken-3"
          ></v-text-field>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="2">
        <div class="info-label">Título</div>
      </v-col>
      <v-col cols="12" lg="10">
        <div class="info-content pa-4 px-5 pb-6" style="min-height: 50px;">
          <v-text-field
            v-model="c.titulo"
            class="mt-n4 px-3"
            text
            hide-details
            single-line
            clearable
            color="blue darken-3"
          ></v-text-field>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ["c"],

  data() {
    return {};
  }
};
</script>

<style scoped>
.info-label {
  color: #1a237e !important;
  padding: 8px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
  text-align: center;
}
.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
