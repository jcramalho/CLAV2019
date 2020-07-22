<template>
  <v-content class="px-12">
    <p class="content-title-1">Indicação de representante da entidade</p>
    <p class="content-text px-8 px-8 py-2">
      Para identificar os representantes que utilizarão os serviços CLAV a
      entidade deve preencher
      <a :href="`${publicPath}documentos/form-id-representante.pdf`"
        >este formulário</a
      >
      e remetê-lo, por via postal ou eletrónica, para:
    </p>
    <v-container fluid class="ma-0 px-12">
      <ul class="px-10">
        <li>
          DGLAB, Edifício da Torre do Tombo, Alameda da Universidade, 1649-010
          Lisboa;
        </li>
        <li>clav@dglab.gov.pt</li>
      </ul>
    </v-container>
  </v-content>
</template>

<script>
export default {
  data() {
    return {
      publicPath: process.env.BASE_URL
    };
  },
  mounted() {
    window.scrollTo(0, 0);
  }
};
</script>
<style scoped>
ul li {
  list-style: none;
  color: #606060;
  font-size: 0.9em;
  margin-bottom: 1rem;
  position: relative;
}
ul li::before {
  content: "\2022";
  position: absolute;
  left: -2rem;
  top: -2.35rem;
  font-size: 4em;
  color: #4da0d0;
}
</style>
