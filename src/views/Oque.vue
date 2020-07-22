<template>
  <v-content class="px-12">
    <p class="content-title-1">O que é a CLAV</p>
    <p class="content-text px-8 py-2">
      A CLAV é uma Plataforma desenvolvida pela Direção-Geral do Livro, dos
      Arquivos e das Bibliotecas, que disponibiliza a “Lista Consolidada para a
      classificação e avaliação da informação pública” enquanto instrumento
      facilitador da elaboração dos planos de classificação e tabelas de seleção
      da Administração Pública, de empresas públicas e de outras entidades.
    </p>
    <p class="content-text px-8 py-2">
      Integram ainda a ontologia que serve de base à Plataforma CLAV o catálogo
      de entidades e de tipologias de entidades produtoras ou gestoras de
      informação e o catálogo de legislação que regula e enquadra os processos
      de negócio e a avaliação da respetiva informação.
    </p>
    <p class="content-text px-8 py-2">
      A Plataforma permite a submissão de propostas de classes para a Lista
      Consolidada, de tabelas de seleção organizacionais e pluriorganizacionais,
      bem como a desmaterialização dos procedimentos de controlo da eliminação
      da informação arquivística através da recolha e análise de autos de
      eliminação.
    </p>
    <p class="content-title-2 px-8 pt-5">Funcionalidades disponíveis:</p>
    <v-container fluid class="ma-0 px-12">
      <ul class="px-9 pt-3">
        <li>Consulta da Lista Consolidada;</li>
        <li>
          Proposta de criação de novas Classes para a Lista Consolidada;
        </li>
        <li>
          Criação assistida ou submissão de Tabelas de seleção organizacionais
          (destinadas a uma organização ou a uma tipologia de entidades);
        </li>
        <li>
          Criação assistida ou submissão de Tabelas de seleção
          pluriorganizacionais (destinadas a um conjunto de entidades, como as
          de âmbito ministerial);
        </li>
        <li>Criação ou submissão de Autos de eliminação;</li>
        <li>
          Consulta e registo de Entidades e Tipologia de Entidades (conjunto de
          entidades com uma área de intervenção comum, por exemplo autarquias
          locais, estabelecimentos de ensino);
        </li>
        <li>Consulta e registo de Legislação;</li>
        <li>Consulta de Termos de Índice;</li>
        <li>Disponibilização de Documentação Técnica de Apoio;</li>
        <li>
          Disponibilização de Notícias relevantes relacionadas com a
          classificação e avaliação da informação arquivística.
        </li>
      </ul>
    </v-container>
    <p class="content-title-2 px-8 pt-2">
      Futuramente, estarão acessíveis novas funcionalidades:
    </p>
    <v-container fluid class="ma-0 px-12">
      <ul class="px-9 pt-3">
        <li>Disponibilização de Documentação Técnica de Apoio;</li>
        <li>
          Disponibilização de Notícias relevantes relacionadas com a
          classificação e avaliação da informação arquivística.
        </li>
      </ul>
    </v-container>
    <p class="content-text px-8 pt-12">
      A Plataforma CLAV tem o apoio do Sistema de Apoios à Modernização
      Administrativa (SAMA). A sua disponibilização decorre do disposto na
      Medida 51 do Simplex + 2016 e na Medida 107 do Simplex + 2017.
    </p>
  </v-content>
</template>

<script>
export default {
  name: "Oque",
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
