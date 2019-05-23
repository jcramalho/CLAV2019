<template>
  <v-container grid-list-md fluid>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm20>
        <v-card>
          <v-toolbar class="header">
            <v-toolbar-title
              >Passos para a criação de uma Tabela de Seleção</v-toolbar-title
            >
          </v-toolbar>
          <v-card-text>
            <v-expansion-panel>
              <v-expansion-panel-content class="expansion-panel-heading">
                <template v-slot:header>
                  <div class="subheading font-weight-bold">
                    Tabela de Seleção Organizacional
                  </div>
                </template>
                <v-card>
                  <table>
                    <tr>
                      <td>
                        <div class="infobox" style="text-align:center">
                          <b>Passo 1</b>
                        </div>
                      </td>
                      <td
                        rowspan="3"
                        width="30%"
                        style="height:1px; padding-top:5px; padding-bottom:5px"
                      >
                        <div class="whitebox" style="height:100%;">
                          Identificação da natureza de intervenção da sua
                          entidade, como dono ou participante, em cada processo
                          de negócio, a partir da lista de:
                        </div>
                      </td>
                      <td>
                        <div class="whitebox">
                          Processos comuns (passíveis de existirem em qualquer
                          entidade)
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <div class="whitebox">
                          Processos de negócio específicos da entidade e
                          tipologia em que se enquadre
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <div class="whitebox">
                          Processos de negócio específicos restantes
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="infobox" style="text-align:center;">
                          <b>Passo 2</b>
                        </div>
                      </td>
                      <td colspan="2">
                        <div class="whitebox">
                          Alteração do conteúdo dos campos nos processos de
                          negócio selecionados: Notas de aplicação; Exemplos de
                          NA; Notas de exclusão; Termos de índice; Legislação.
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="infobox" style="text-align:center;">
                          <b>Passo 3</b>
                        </div>
                      </td>
                      <td colspan="2">
                        <div class="whitebox">
                          Proposta de novos processos de negócio
                        </div>
                      </td>
                    </tr>
                  </table>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-content class="expansion-panel-heading">
                <template v-slot:header>
                  <div class="subheading font-weight-bold">
                    Tabela de Seleção Pluriorganizacional
                  </div>
                </template>
                <v-card>
                  <table>
                    <tr>
                      <td>
                        <div class="infobox" style="text-align:center">
                          <b>Passo 1</b>
                        </div>
                      </td>
                      <td
                        rowspan="2"
                        width="30%"
                        style="height:1px; padding-top:5px; padding-bottom:5px"
                      >
                        <div class="whitebox" style="height:100%;">
                          Identificação da natureza de intervenção da sua
                          entidade, como dono ou participante, em cada processo
                          de negócio, a partir da lista de:
                        </div>
                      </td>
                      <td>
                        <div class="whitebox">
                          Processos comuns (passíveis de existirem em qualquer
                          entidade)
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <div class="whitebox">
                          Processos de negócio específicos da entidade e
                          tipologia em que se enquadrem
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="infobox" style="text-align:center">
                          <b>Passo 2</b>
                        </div>
                      </td>
                      <td colspan="2">
                        <div class="whitebox">
                          Alteração do conteúdo dos campos nos processos de
                          negócio selecionados: Notas de aplicação; Exemplos de
                          NA; Notas de exclusão; Termos de índice; Legislação.
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="infobox" style="text-align:center">
                          <b>Passo 3</b>
                        </div>
                      </td>
                      <td colspan="2">
                        <div class="whitebox">
                          Proposta de novos processos de negócio
                        </div>
                      </td>
                    </tr>
                  </table>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card-text>
          <div style="text-align:center">
            <v-btn medium color="primary" @click="voltar()">Voltar</v-btn>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  methods: {
    voltar: function() {
      this.$router.push("/ts/criar");
    }
  }
};
</script>

<style>
.header {
  color: beige !important;
  background-color: #0d47a1 !important;
}
.expansion-panel-heading {
  color: #1a237e !important;
  background-image: linear-gradient(to bottom, #e8eaf6 0, #8c9eff 100%);
}
.infobox {
  background: #c5cae9;
  color: #1a237e;
  border-style: solid;
  border-width: 1px;
  padding: 5px;
  margin: 5px;
}
.whitebox {
  border-style: solid;
  background-color: #e8eaf6;
  border-width: 1px;
  padding: 5px;
  margin: 5px;
}

.panel-custom .panel-title {
  color: #1a237e;
}
</style>
