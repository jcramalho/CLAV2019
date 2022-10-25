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
import Campo from "@/components/generic/CampoCLAV";
export default {
  props: ["c"],
  components: { Campo },
  data() {
    return {};
  },
};
</script>

<style scoped></style>
