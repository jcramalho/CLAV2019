<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <v-app-bar color="indigo darken-4" dark>
          <v-toolbar-title class="card-heading"
            >Passos para a criação de uma Tabela de Seleção</v-toolbar-title
          >
        </v-app-bar>
        <v-card-text>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header class="expansion-panel-heading">
                Tabela de Seleção Organizacional
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-card>
                  <table>
                    <tr>
                      <td>
                        <div class="infobox" style="text-align:center;">
                          <b>Passo 1</b>
                        </div>
                      </td>
                      <td colspan="2">
                        <div class="whitebox">
                          Indicação das tipologias de entidade abrangidas pela
                          Tabela (encontram-se automaticamente selecionadas
                          aquelas que fazem parte da entidade em causa)
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
                          Designação da nova Tabela de Seleção (por defeito é o
                          nome da entidade para a qual se está a criar a Tabela)
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="infobox" style="text-align:center">
                          <b>Passo 3, 4 e 5</b>
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
                          Processos de negócio comuns (passíveis de existirem em
                          qualquer entidade)
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <div class="whitebox">
                          Processos de negócio específicos (da entidade e
                          tipologia em que se enquadra)
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <div class="whitebox">
                          Processos de negócio específicos restantes (processos
                          específicos mas não da entidade nem das tipologias em
                          causa)
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="infobox" style="text-align:center;">
                          <b>Passo 6</b>
                        </div>
                      </td>
                      <td colspan="2">
                        <div class="whitebox">
                          Revisão dos de negócio não selecionados nos passos
                          anteriores
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="infobox" style="text-align:center;">
                          <b>Passo 7</b>
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
                  </table>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <hr style="border-top: 0px" />

          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header class="expansion-panel-heading">
                Tabela de Seleção Pluriorganizacional
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-card>
                  <table>
                    <tr>
                      <td>
                        <div class="infobox" style="text-align:center">
                          <b>Passo 1</b>
                        </div>
                      </td>
                      <td colspan="2">
                        <div class="whitebox">
                          Identificação das entidades abrangidas pela Tabela de
                          Seleção
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
                          Designação da nova Tabela de Seleção
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="infobox" style="text-align:center">
                          <b>Passo 3, 4 e 5</b>
                        </div>
                      </td>
                      <td
                        rowspan="3"
                        width="30%"
                        style="height:1px; padding-top:5px; padding-bottom:5px"
                      >
                        <div class="whitebox" style="height:100%;">
                          Identificação da natureza de intervenção das
                          entidades, como dono ou participante, em cada processo
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
                          Processos de negócio específicos (da entidade e
                          tipologia em que se enquadrem)
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <div class="whitebox">
                          Processos de negócio específicos restantes (processos
                          específicos mas não das entidades selecionadas)
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="infobox" style="text-align:center;">
                          <b>Passo 6</b>
                        </div>
                      </td>
                      <td colspan="2">
                        <div class="whitebox">
                          Revisão dos processos de negócio não selecionados nos
                          passos anteriores
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="infobox" style="text-align:center">
                          <b>Passo 7</b>
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
                  </table>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <hr style="border-top: 0px" />
          <div style="text-align:center">
            <v-btn medium color="primary" @click="voltar()">Voltar</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
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

<style scoped>
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

.card-heading {
  font-size: x-large;
}
</style>
