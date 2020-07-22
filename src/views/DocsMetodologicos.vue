<template>
  <v-content class="px-12">
    <p class="content-title-1">Documentos Metodológicos</p>
    <p class="content-text px-8 py-2">
      Para conhecer os princípios teóricos e metodológicos que estão na base da
      Lista Consolidada, veja os seguintes documentos técnicos:
    </p>
    <v-container fluid class="ma-0 px-12">
      <ul class="px-9 pt-3">
        <li>
          <a
            href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2013/10/egov_interoperabilidade.pdf"
          >
            Governo Electrónico e Interoperabilidade: documento metodológico
            para a elaboração de um esquema de metainformação para a
            interoperabilidade e de uma macroestrutura funcional</a
          >
        </li>
        <li>
          <a
            href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2014/02/2013_Orient-3-niveis_PC-MF.pdf"
          >
            Orientações básicas para o desenvolvimento dos 3ºs níveis em planos
            de classificação conformes à macroestrutura funcional</a
          >
        </li>
        <li>
          <a
            href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2016/03/ASIA_Doc-metodologico2016-03-10.pdf"
          >
            Avaliação suprainstitucional da Informação arquivística (ASIA):
            Documento metodológico.</a
          >
          Contém, em anexo, as Regras para a criação de termos do índice.
        </li>
        <li>
          Os
          <a :href="`${publicPath}documentos/mapas-conceptuais.pdf`">
            Mapas conceptuais
          </a>
          contêm informação sobre a subdivisão lógica das Funções (MEF) e o seu
          desdobramento em processos de negócio (classes de 3º nível). São a
          base para o enquadramento conceptual e a codificação de novos
          processos de negócio na Lista Consolidada.
        </li>
      </ul>
    </v-container>
  </v-content>
</template>

<script>
export default {
  name: "DocsMetodologicos",
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
