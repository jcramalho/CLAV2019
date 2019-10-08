<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <v-app-bar color="green darken-4" dark>
          <v-toolbar-title class="card-heading">Novo Auto de Eliminação</v-toolbar-title>
        </v-app-bar>
        
        <v-card-text>
            <v-row>
              <v-col :md="2" >
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
              <v-col :md="2">
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
              <v-col :md="2">
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

            <v-expansion-panels multiple>
              <!-- Zonas de Controlo -->
              <v-expansion-panel v-if="this.auto.zonaControlo.length>0" popout focusable>
                <v-expansion-panel-header class="expansion-panel-heading">
                  <div>Zonas de Controlo</div>
                </v-expansion-panel-header>

                <v-expansion-panel-content>
                  <ListaZonasControlo 
                    v-bind:auto="auto"
                  />
                </v-expansion-panel-content>
              </v-expansion-panel>

              <!-- Adicionar Zona Controlo -->
              <AdicionarZonaControlo 
                class="ma-1"
                v-bind:classes="classes"
                v-bind:entidades="entidades"
                v-bind:auto="auto"
              />
            </v-expansion-panels>
          </v-card-text>
        </v-card>
        <div style="text-align:center">
          <v-btn medium color="primary" @click="submit" :disabled="!auto.entidade && !auto.legislacao && !auto.fundo" class="ma-2">
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
import AdicionarZonaControlo from "@/components/autosEliminacao/criacao/AdicionarZonaControlo.vue"
import ListaZonasControlo from "@/components/autosEliminacao/criacao/ListaZonasControlo.vue"
const help = require("@/config/help").help;

export default {
  props: ["entidades","portarias","classes"],
  components: {
    InfoBox,
    AdicionarZonaControlo,
    ListaZonasControlo
  },
  data: () => ({
    auto: {
      entidade: null,
      legislacao: null,
      fundo: null,
      zonaControlo: []
    },
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
