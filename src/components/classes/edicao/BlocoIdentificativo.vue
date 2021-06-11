<template>
  <v-card flat>
    <Campo nome="Nível" color="neutralpurple">
      <template v-slot:conteudo>
        <v-text-field
          :value="c.nivel"
          disabled
          hide-details
          dense
          color="primary"
        ></v-text-field>
      </template>
    </Campo>
    <Campo nome="Título" color="neutralpurple">
      <template v-slot:conteudo>
        <v-text-field
          v-model="c.titulo"
          text
          hide-details
          dense
          clearable
          color="primary"
        ></v-text-field>
      </template>
    </Campo>
  </v-card>
</template>

<script>
import Campo from "@/components/generic/Campo";
export default {
  props: ["c"],
  components: { Campo },
  data() {
    return {};
  },
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
