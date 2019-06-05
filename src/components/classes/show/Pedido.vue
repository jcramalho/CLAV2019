<template>
  <v-container grid-list-md fluid>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm10>
        <!-- HEADER -->
        <v-card v-if="classeLoaded">
          <v-toolbar color="indigo darken-2" dark>
            <v-toolbar-title
              >{{ classe.codigo }}:
              {{ classe.titulo }}</v-toolbar-title
            >
          </v-toolbar>

          <v-card-text>

            <v-expansion-panel popout>
              <!-- DESCRITIVO DA CLASSE -->
              <v-expansion-panel-content>
                <template v-slot:header>
                  <v-toolbar
                    color="indigo darken-1 body-2 font-weight-bold"
                    dark
                    dense
                  >
                    <v-toolbar-title>Descritivo da Classe</v-toolbar-title>
                  </v-toolbar>
                </template>

                <v-layout wrap ma-2>
                  <!-- DESCRIÇÂO -->
                  <v-flex xs2>
                    <div class="info-label">Descrição</div>
                  </v-flex>
                  <v-flex xs10>
                    <div class="info-content">
                      {{ classe.descricao }}
                    </div>
                  </v-flex>
                </v-layout>

                <NotasAp
                  :notas="classe.notasAp"
                  v-if="classe.notasAp.length > 0"
                />

                <ExemplosNotasAp
                  :exemplos="classe.exemplosNotasAp"
                  v-if="classe.exemplosNotasAp.length > 0"
                />

                <NotasEx
                  :notas="classe.notasEx"
                  v-if="classe.notasEx.length > 0"
                />

                <TermosIndice
                  :termos="classe.termosInd"
                  v-if="classe.termosInd.length > 0"
                />
              </v-expansion-panel-content>

              <!-- CONTEXTO DA CLASSE -->
              <v-expansion-panel-content v-if="classe.nivel == 3">
                <template v-slot:header>
                  <v-toolbar
                    color="indigo darken-1 body-2 font-weight-bold"
                    dark
                    dense
                  >
                    <v-toolbar-title>Contexto de Avaliação</v-toolbar-title>
                  </v-toolbar>
                </template>

                <v-layout wrap ma-2>
                  <!-- TIPO DE PROCESSO -->
                  <v-flex xs2>
                    <div class="info-label">Tipo de Processo</div>
                  </v-flex>
                  <v-flex xs10>
                    <div class="info-content">
                      {{ classe.tipoProc }}
                    </div>
                  </v-flex>
                </v-layout>

                <v-layout wrap ma-2>
                  <!-- TRANSVERSALIDADE -->
                  <v-flex xs2>
                    <div class="info-label">Processo Transversal</div>
                  </v-flex>
                  <v-flex xs10>
                    <div class="info-content">
                      {{ classe.procTrans == "S" ? "Sim" : "Não" }}
                    </div>
                  </v-flex>
                </v-layout>

                <Donos
                  :entidades="classe.donos"
                  v-if="classe.donos.length > 0"
                />

                <Participantes
                  :entidades="classe.participantes"
                  v-if="classe.participantes.length > 0"
                />

                <ProcessosRelacionados
                  :processos="classe.processosRelacionados"
                  v-if="classe.processosRelacionados.length > 0"
                />

                <Legislacao
                  :legs="this.classe.legislacao"
                  v-if="classe.legislacao.length > 0"
                />
              </v-expansion-panel-content>

              <v-expansion-panel-content
                v-if="(classe.nivel >= 3)">

                <template v-slot:header>
                  <v-toolbar
                    color="indigo darken-1 body-2 font-weight-bold"
                    dark
                    dense
                  >
                    <v-toolbar-title>Decisões de Avaliação</v-toolbar-title>
                  </v-toolbar>
                </template>

                <v-layout ma-2 wrap>
                  <v-flex xs12>
                    <v-toolbar
                      color="indigo font-weight-medium"
                      dark
                      height="30"
                    >
                      <v-toolbar-title
                        >Prazo de Conservação Administrativa</v-toolbar-title
                      >
                    </v-toolbar>
                  </v-flex>
                </v-layout>

                <v-layout wrap ma-2>
                  <!-- PRAZO -->
                  <v-flex xs2>
                    <div class="info-label">Prazo</div>
                  </v-flex>
                  <v-flex xs10>
                    <div class="info-content">
                      {{ classe.pca.valores + " anos" }}
                    </div>
                  </v-flex>
                </v-layout>

                <v-layout wrap ma-2 v-if="classe.pca.notas != ''">
                  <!-- NOTAS -->
                  <v-flex xs2>
                    <div class="info-label">Notas</div>
                  </v-flex>
                  <v-flex xs10>
                    <div class="info-content">
                      {{ classe.pca.notas }}
                    </div>
                  </v-flex>
                </v-layout>

                <v-layout wrap ma-2 v-if="classe.pca.formaContagem">
                  <!-- FORMA DE CONTAGEM -->
                  <v-flex xs2>
                    <div class="info-label">Forma de Contagem</div>
                  </v-flex>
                  <v-flex xs10>
                    <div class="info-content">
                      {{ classe.pca.formaContagem }}
                    </div>
                  </v-flex>
                </v-layout>

                <v-layout wrap ma-2 v-if="classe.pca.subFormaContagem">
                  <!-- SUBFORMA DE CONTAGEM -->
                  <v-flex xs2>
                    <div class="info-label">Subforma de Contagem</div>
                  </v-flex>
                  <v-flex xs10>
                    <div class="info-content">
                      {{ classe.pca.subFormaContagem }}
                    </div>
                  </v-flex>
                </v-layout>

                <v-layout wrap ma-2 v-if="classe.pca.justificacao">
                  <!-- JUSTIFICAÇÂO -->
                  <v-flex xs2>
                    <div class="info-label">Justificação</div>
                  </v-flex>
                  <v-flex xs10>
                    <div class="info-content">
                      <v-layout
                        wrap
                        ma-1
                        v-for="c in classe.pca.justificacao"
                        :key="c.tipoLabel"
                      >
                        <v-flex xs2>
                          <div class="info-label">{{ c.tipoLabel }}</div>
                        </v-flex>
                        <v-flex xs10>
                          <div class="info-content">{{ c.conteudo }}</div>
                        </v-flex>
                      </v-layout>
                    </div>
                  </v-flex>
                </v-layout>

                <!-- DESTINO FINAL ................................................... -->

                <v-layout ma-2 wrap>
                  <v-flex xs12>
                    <v-toolbar
                      color="indigo font-weight-medium"
                      dark
                      height="30"
                    >
                      <v-toolbar-title>Destino Final</v-toolbar-title>
                    </v-toolbar>
                  </v-flex>
                </v-layout>

                <v-layout wrap ma-2>
                  <!-- VALOR -->
                  <v-flex xs2>
                    <div class="info-label">Destino Final</div>
                  </v-flex>
                  <v-flex xs10>
                    <div class="info-content">
                      {{ classe.df.valor }}
                    </div>
                  </v-flex>
                </v-layout>

                <v-layout wrap ma-2 v-if="classe.df.justificacao">
                  <!-- JUSTIFICAÇÂO -->
                  <v-flex xs2>
                    <div class="info-label">Justificação</div>
                  </v-flex>
                  <v-flex xs10>
                    <div class="info-content">
                      <v-layout
                        wrap
                        ma-1
                        v-for="c in classe.df.justificacao"
                        :key="c.tipoLabel"
                      >
                        <v-flex xs2>
                          <div class="info-label">{{ c.tipoLabel }}</div>
                        </v-flex>
                        <v-flex xs10>
                          <div class="info-content">{{ c.conteudo }}</div>
                        </v-flex>
                      </v-layout>
                    </div>
                  </v-flex>
                </v-layout>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card-text>
        </v-card>

        <p v-else>A carregar...</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
const lhost = require("@/config/global").host;
import axios from "axios";
import ClassesFilho from "@/components/classes/ClassesFilho.vue";
import NotasAp from "@/components/classes/NotasAp.vue";
import NotasEx from "@/components/classes/NotasEx.vue";
import ExemplosNotasAp from "@/components/classes/ExemplosNotasAp.vue";
import TermosIndice from "@/components/classes/TermosIndice.vue";
import Donos from "@/components/classes/Donos.vue";
import Participantes from "@/components/classes/Participantes.vue";
import ProcessosRelacionados from "@/components/classes/ProcessosRelacionados.vue";
import Legislacao from "@/components/classes/Legislacao.vue";

export default {
  props: ["idp"],
  data: () => ({
    classe: {},
    classeLoaded: false,
    filhosHeaders: [
      { text: "Código", align: "left", sortable: false, value: "codigo" },
      { text: "Título", value: "titulo" }
    ]
  }),

  components: {
    ClassesFilho,
    NotasAp,
    NotasEx,
    ExemplosNotasAp,
    TermosIndice,
    Donos,
    Participantes,
    ProcessosRelacionados,
    Legislacao
  },

  methods: {
    go: function(idClasse) {
      this.$router.push("/classes/consultar/c" + idClasse);
    }
  },

  created: function() {
    axios
      .get(lhost + "/api/pedidos/" + this.idp)
      .then(response => {
        this.classe = response.data.objeto.dados;
        this.classeLoaded = true;
      })
      .catch(error => {
        return error;
      });
  }
};
</script>
.myPanelHeader { color: #304FFE; }

<style>
.info-label {
  color: #1a237e;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #dee2f8;
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
