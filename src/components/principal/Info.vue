<template>
  <v-card class="ma-4 pa-2">
    <v-toolbar :color="panelHeaderColor" dark>
      <v-toolbar-title>O que é a CLAV</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header
            >Plataforma para a Classificação e Avaliação da Informação
            Pública</v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <v-card>
              <v-card-text>
                <p>
                  A CLAV é uma Plataforma desenvolvida pela DGLAB, que visa
                  disponibilizar a “Lista Consolidada para a classificação e
                  avaliação da informação pública” enquanto instrumento
                  facilitador da elaboração dos planos de classificação e
                  tabelas de seleção da Administração Pública, de empresas
                  públicas e de outras entidades. Possibilita ainda a submissão
                  de propostas ou a atualização de planos de classificação e
                  tabelas de seleção organizacionais e pluriorganizacionais, bem
                  como a desmaterialização dos procedimentos de controlo da
                  eliminação da informação arquivística através da recolha e
                  análise de autos de eliminação.
                </p>
                <p>Funcionalidades disponíveis:</p>
                <ul>
                  <li>
                    Consulta da Lista Consolidada;
                  </li>
                  <li>
                    Proposta de criação de novos Processos de Negócio para a
                    Lista Consolidada;
                  </li>
                  <li>
                    Criação assistida ou submissão de Tabelas de seleção
                    organizacionais;
                  </li>
                  <li>
                    Criação assistida ou submissão de Tabelas de seleção
                    pluriorganizacionais;
                  </li>
                  <li>Submissão de Autos de eliminação;</li>
                  <li>
                    Consulta e registo de Entidades e Tipologia de Entidades;
                  </li>
                  <li>Consulta e registo de Legislação;</li>
                  <li>
                    Consulta de Termos de Índice (associados a cada Processo de
                    Negócio);
                  </li>
                  <li>Disponibilização de Documentação Técnica de Apoio;</li>
                  <li>
                    Disponibilização de Notícias relevantes relacionadas com a
                    classificação e avaliação da informação arquivística.
                  </li>
                </ul>
                <p>
                  Futuramente, estarão acessíveis novas funcionalidades::
                </p>
                <ul>
                  <li>
                    Submissão de Relatórios de Avaliação de Documentação
                    Acumulada (RADA);
                  </li>
                  <li>
                    Disponibilização de ferramentas para a elaboração e
                    submissão de planos de preservação digital e planos de
                    substituição de suporte.
                  </li>
                </ul>
                <p>
                  A Plataforma CLAV tem o apoio do Sistema de Apoios à
                  Modernização Administrativa (SAMA). A sua disponibilização
                  decorre do disposto na Medida 51 do Simplex + 2016 e na Medida
                  107 do Simplex + 2017.
                </p>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      panelHeaderColor: "indigo darken-4"
    };
  }
};
</script>
