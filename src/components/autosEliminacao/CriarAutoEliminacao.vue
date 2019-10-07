<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <v-app-bar color="green darken-4" dark>
          <v-toolbar-title class="card-heading">Novo Auto de Eliminação</v-toolbar-title>
        </v-app-bar>
        
        <v-card-text>
            <v-row>
              <v-col cols="2">
                <div class="info-label">Entidade Responsável:</div>
              </v-col>
              <v-col>
                <v-autocomplete
                  label="Selecione a entidade responsável"
                  :items="entidades"
                  v-model="auto.entidade"
                  solo
                  dense
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
                <div class="info-label">Fonte de legitimação:</div>
              </v-col>
              <v-col>
                <v-autocomplete
                  label="Selecione a fonte de legitimação"
                  :items="portarias"
                  v-model="auto.legislacao"
                  solo
                  dense
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
                <div class="info-label">Fundo:</div>
              </v-col>
              <v-col>
                <v-autocomplete
                  label="Selecione a entidade responsável pelo fundo"
                  :items="entidades"
                  v-model="auto.fundo"
                  solo
                  dense
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-expansion-panels>
              <v-expansion-panel popout focusable>
                <v-expansion-panel-header class="expansion-panel-heading">
                  <div>Adicionar Zona de Controlo</div>
                </v-expansion-panel-header>

                <v-expansion-panel-content>
                  <v-row>
                    <v-col cols="2">
                      <div class="info-label">Codigo da Classe:</div>
                    </v-col>
                    <v-col>
                      <v-autocomplete
                        label="Selecione a classe"
                        :items="classes"
                        v-model="zonaControlo.classe"
                        :rules="value => !!value || 'Data Obrigatória'"
                        solo
                        dense
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                      <div class="info-label">Natureza de Intervenção:</div>
                    </v-col>
                    <v-col>
                      <v-select
                        label="Selecione a classe"
                        :items="natureza"
                        v-model="zonaControlo.ni"
                        :rules="value => !!value || 'Data Obrigatória'"
                        solo
                        dense
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                      <div class="info-label">Dono PN:</div>
                    </v-col>
                    <v-col>
                      <v-autocomplete
                        label="Selecione a entidade dona do processo"
                        :items="entidades"
                        v-model="zonaControlo.dono"
                        solo
                        dense
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                      <div class="info-label">Data de Início:</div>
                    </v-col>
                    <v-col>
                      <v-text-field 
                        hint="Exemplo: 1995" 
                        :rules="rulesDate"
                        v-model="zonaControlo.dataInicio"
                      >
                        Insira um ano
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                      <div class="info-label">Data de Fim:</div>
                    </v-col>
                    <v-col>
                      <v-text-field 
                        hint="Exemplo: 1995" 
                        :rules="rulesDate"
                        v-model="zonaControlo.dataFim"
                      >
                        Insira um ano
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                      <div class="info-label">Medição de UI em Papel:</div>
                    </v-col>
                    <v-col>
                      <v-text-field 
                        hint="Exemplo: 11.50" 
                        :rules="rulesUI"
                        v-model="zonaControlo.uiPapel"
                      >
                        Insira um ano
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                      <div class="info-label">Medição de UI Digital:</div>
                    </v-col>
                    <v-col>
                      <v-text-field 
                        hint="Exemplo: 16.00" 
                        :rules="rulesUI"
                        v-model="zonaControlo.uiDigital"
                      >
                        Insira um ano
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                      <div class="info-label">Medição de UI noutro Suporte:</div>
                    </v-col>
                    <v-col>
                      <v-text-field 
                        hint="Exemplo: 150.75" 
                        :rules="rulesUI"
                        v-model="zonaControlo.uiOutros"
                      >
                        Insira um ano
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row justify="end">
                    <v-btn color="red darken-4" dark text>Limpar</v-btn>
                    <v-btn color="green darken-4" dark text>Adicionar</v-btn>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
        <div style="text-align:center">
          <v-btn medium color="primary" @click="submit" :disabled="!auto.entidade && !auto.legislacao && !auto.fundo">
            Submeter Auto de Eliminação
          </v-btn>
        </div>
    <v-dialog v-model="successDialog" width="950" persistent>
      <v-card outlined>
        <v-card-title class="teal darken-4 title white--text" dark>
          Pedido de criação de auto de eliminação criado com sucesso
        </v-card-title>

        <v-card-text>
          <span
            class="subtitle-1"
            style="white-space: pre-wrap"
            v-html="success"
          >
          </span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="green darken-4" text @click="$router.push('/')">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="erroDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title class="red darken-4 title white--text" dark>
          Não foi possível criar o pedido de criação de tabela de seleção
        </v-card-title>

        <v-card-text>
          <span class="subtitle-1" style="white-space: pre-wrap" v-html="erro">
          </span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="erroDialog = false">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
const conversor = require("@/plugins/conversor").excel2Json;
const conversorTS = require("@/plugins/conversor").excel2JsonTS;
import InfoBox from "@/components/generic/infoBox.vue";
const help = require("@/config/help").help;

export default {
  props: ["entidades","portarias","classes"],
  components: {
    InfoBox
  },
  data: () => ({
    auto: {
      entidade: null,
      legislacao: null,
      fundo: null,
      zonaControlo: []
    },
    zonaControlo: {
      classe: null,
      ni: "Vazio",
      dono: null,
      dataInicio: "",
      dataFim: "",
    },
    natureza: ["Vazio","Dono","Paticipante"],
    rulesDate: [
      value => !!value || 'Data Obrigatória',
      value => {
        const pattern = /[0-9]{4}/
        return pattern.test(value) || 'Valor numérico com 4 dígitos'
      }
    ],
    rulesUI: [
      value => {
        const pattern = /[0-9]+[.][0-9]{2}/
        return pattern.test(value) || 'Input numérico com 2 casas decimais'
      }
    ],
    erro: null,
    erroDialog: false,
    success: null,
    successDialog: false,
  }),
  methods: {
    filtraAuto: function(auto) {
      this.auto.entidade = auto.entidade.split(" - ")[1]
      this.auto.legislacao = "Portaria "+auto.legislacao.split(" ")[1]
      this.auto.fundo = auto.fundo.split(" - ")[1]
    },
    adicionarZC: function() {
      var codigo = this.zonaControlo.classe.split(" - ")[0]
      var titulo = this.zonaControlo.classe.split(" - ")[1]

    },
    submit: function() {
      this.erroDialog= true;
      this.erro = JSON.stringify(this.auto)
    }
  }
};
</script>

<style>
.info-label {
  color: #2e7d32; /* green darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8f5e9; /* green lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.expansion-panel-heading {
  background-color: #1b5e20 !important;
  color: #fff;
  font-size: large;
  font-weight: bold;
}

.card-heading {
  font-size: x-large;
  font-weight: bold;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
