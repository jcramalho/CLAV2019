<template>
    <v-card  class="mb-4 pa-2" >
      <v-toolbar :color="panelHeaderColor" dark>
        <v-toolbar-title>Documentação Técnica de Apoio</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>Documentos Metodológicos</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card>
              <v-card-text>
                <p>
                  Para conhecer os princípios teóricos e metodológicos que estão
                  na base da Lista Consolidada, veja os seguintes documentos
                  técnicos:
                </p>
                <ul>
                  <li>
                    <a
                      href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2013/10/egov_interoperabilidade.pdf"
                    >
                      Governo Electrónico e Interoperabilidade: documento
                      metodológico para a elaboração de um esquema de
                      metainformação para a interoperabilidade e de uma
                      macroestrutura funcional</a
                    >
                  </li>
                  <li>
                    <a
                      href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2014/02/2013_Orient-3-niveis_PC-MF.pdf"
                    >
                      Orientações básicas para o desenvolvimento dos 3ºs níveis
                      em planos de classificação conformes à macroestrutura
                      funcional</a
                    >
                  </li>
                  <li>
                    <a
                      href="http://arquivos.dglab.gov.pt/wp-content/uploads/sites/16/2016/03/ASIA_Doc-metodologico2016-03-10.pdf"
                    >
                      Avaliação suprainstitucional da Informação arquivística
                      (ASIA): Documento metodológico.</a
                    >
                    Contém, em anexo, as Regras para a criação de termos do
                    índice.
                  </li>
                </ul>
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
      panelHeaderColor: "indigo accent-4"
    };
  }
};
</script>
