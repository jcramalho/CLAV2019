<template>
  <v-container style="max-width:100%">
    <v-row>
      <!-- MENU LATERAL -->
      <v-col xs="12" sm="3">
        <ClassesArvoreLateral />
      </v-col>
      <v-col xs="12" sm="9">
        <!-- HEADER -->
        <v-card v-if="classeLoaded">
          <v-app-bar color="indigo darken-2" dark>
            <v-toolbar-title>
              {{ this.classe.codigo }}:
              {{ this.classe.titulo }}
            </v-toolbar-title>
          </v-app-bar>

          <v-card-text>
            <ClassesFilho :subclasses="classe.filhos" v-if="classe.filhos.length > 0" />

            <v-expansion-panels>
              <v-expansion-panel popout>
                <!-- DESCRITIVO DA CLASSE -->
                <v-expansion-panel-header>
                  <v-toolbar color="indigo darken-1 body-2 font-weight-bold" dark dense>
                    <v-toolbar-title>
                      Descritivo da Classe
                      <InfoBox
                        header="Descritivo da Classe"
                        :text="myhelp.Classe.BlocoContexto"
                        helpColor="white"
                        dialogColor="#E0F2F1"
                      />
                    </v-toolbar-title>
                  </v-toolbar>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row>
                    <!-- DESCRIÇÂO -->
                    <v-col xs="2" sm="2">
                      <div class="info-label">
                        Descrição
                        <InfoBox
                          header="Descrição"
                          :text="myhelp.Classe.Campos.Descricao"
                          helpColor="indigo darken-4"
                          dialogColor="#E0F2F1"
                        />
                      </div>
                    </v-col>
                    <v-col xs="10" sm="10">
                      <div class="info-content">{{ classe.descricao }}</div>
                    </v-col>
                  </v-row>

                  <NotasAp :notas="classe.notasAp" v-if="classe.notasAp.length > 0" />

                  <ExemplosNotasAp
                    :exemplos="classe.exemplosNotasAp"
                    v-if="classe.exemplosNotasAp.length > 0"
                  />

                  <NotasEx :notas="classe.notasEx" v-if="classe.notasEx.length > 0" />

                  <TermosIndice :termos="classe.termosInd" v-if="classe.termosInd.length > 0" />
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel popout v-if="classe.nivel == 3">
                <!-- CONTEXTO DA CLASSE -->
                <v-expansion-panel-header>
                  <v-toolbar color="indigo darken-1 body-2 font-weight-bold" dark dense>
                    <v-toolbar-title>
                      Contexto de Avaliação
                      <InfoBox
                        header="Contexto de Avaliação"
                        :text="myhelp.Classe.BlocoContexto"
                        helpColor="white"
                        dialogColor="#E0F2F1"
                      />
                    </v-toolbar-title>
                  </v-toolbar>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row>
                    <!-- TIPO DE PROCESSO -->
                    <v-col xs="2" sm="2">
                      <div class="info-label">
                        Tipo de Processo
                        <InfoBox
                          header="Tipo de Processo"
                          :text="myhelp.Classe.Campos.TipoProcesso"
                          helpColor="indigo darken-4"
                          dialogColor="#E0F2F1"
                        />
                      </div>
                    </v-col>
                    <v-col xs="10" sm="10">
                      <div class="info-content">{{ classe.tipoProc }}</div>
                    </v-col>
                  </v-row>

                  <v-row>
                    <!-- TRANSVERSALIDADE -->
                    <v-col xs="2" sm="2">
                      <div class="info-label">
                        Processo Transversal
                        <InfoBox
                          header="Processo Transversal"
                          :text="myhelp.Classe.Campos.ProcessoTransversal"
                          helpColor="indigo darken-4"
                          dialogColor="#E0F2F1"
                        />
                      </div>
                    </v-col>
                    <v-col xs="10" sm="10">
                      <div class="info-content">{{ classe.procTrans == "S" ? "Sim" : "Não" }}</div>
                    </v-col>
                  </v-row>

                  <Donos :entidades="classe.donos" v-if="classe.donos.length > 0" />

                  <Participantes
                    :entidades="classe.participantes"
                    v-if="classe.participantes.length > 0"
                  />

                  <ProcessosRelacionados
                    :processos="classe.processosRelacionados"
                    v-if="classe.processosRelacionados.length > 0"
                  />

                  <Legislacao :legs="this.classe.legislacao" v-if="classe.legislacao.length > 0" />
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel
                v-if="
                  (classe.nivel == 3 && classe.filhos.length == 0) ||
                    classe.nivel == 4
                "
              >
                <v-expansion-panel-header>
                  <v-toolbar color="indigo darken-1 body-2 font-weight-bold" dark dense>
                    <v-toolbar-title>
                      Decisões de Avaliação
                      <InfoBox
                        header="Decisões de Avaliação"
                        :text="myhelp.Classe.BlocoDecisoes"
                        helpColor="white"
                        dialogColor="#E0F2F1"
                      />
                    </v-toolbar-title>
                  </v-toolbar>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row>
                    <v-col xs="12" sm="12">
                      <v-toolbar color="indigo font-weight-medium" dark height="30">
                        <v-toolbar-title>Prazo de Conservação Administrativa</v-toolbar-title>
                      </v-toolbar>
                    </v-col>
                  </v-row>

                  <v-row>
                    <!-- PRAZO -->
                    <v-col xs="2" sm="2">
                      <div class="info-label">
                        Prazo
                        <InfoBox
                          header="Prazo"
                          :text="myhelp.Classe.Campos.Prazo"
                          helpColor="indigo darken-4"
                          dialogColor="#E0F2F1"
                        />
                      </div>
                    </v-col>
                    <v-col xs="10" sm="10">
                      <div
                        class="info-content"
                        v-if="classe.pca.valores > 1"
                      >{{ classe.pca.valores + " anos" }}</div>
                      <div
                        class="info-content"
                        v-else-if="classe.pca.valores == 1"
                      >{{ classe.pca.valores + " ano" }}</div>
                    </v-col>
                  </v-row>

                  <v-row v-if="classe.pca.notas != ''">
                    <!-- NOTAS -->
                    <v-col xs="2" sm="2">
                      <div class="info-label">Notas</div>
                    </v-col>
                    <v-col xs="10" sm="10">
                      <div class="info-content">{{ classe.pca.notas }}</div>
                    </v-col>
                  </v-row>

                  <v-row v-if="classe.pca.formaContagem">
                    <!-- FORMA DE CONTAGEM -->
                    <v-col xs="2" sm="2">
                      <div class="info-label">
                        Forma de Contagem
                        <InfoBox
                          header="Forma de Contagem"
                          :text="myhelp.Classe.Campos.FormaContagem"
                          helpColor="indigo darken-4"
                          dialogColor="#E0F2F1"
                        />
                      </div>
                    </v-col>
                    <v-col xs="10" sm="10">
                      <div class="info-content">{{ classe.pca.formaContagem }}</div>
                    </v-col>
                  </v-row>

                  <v-row v-if="classe.pca.subFormaContagem">
                    <!-- SUBFORMA DE CONTAGEM -->
                    <v-col xs="2" sm="2">
                      <div class="info-label">
                        Subforma de Contagem
                        <InfoBox
                          header="Subforma de Contagem"
                          :text="myhelp.Classe.Campos.SubformaContagem"
                          helpColor="indigo darken-4"
                          dialogColor="#E0F2F1"
                        />
                      </div>
                    </v-col>
                    <v-col xs="10" sm="10">
                      <div class="info-content">{{ classe.pca.subFormaContagem }}</div>
                    </v-col>
                  </v-row>

                  <v-row v-if="classe.pca.justificacao">
                    <!-- JUSTIFICAÇÂO -->
                    <v-col xs="2" sm="2">
                      <div class="info-label">
                        Justificação
                        <InfoBox
                          header="Justificação do PCA"
                          :text="myhelp.Classe.Campos.JustificacaoPCA"
                          helpColor="indigo darken-4"
                          dialogColor="#E0F2F1"
                        />
                      </div>
                    </v-col>
                    <v-col xs="10" sm="10">
                      <div class="info-content">
                        <div v-for="c in classe.pca.justificacao" :key="c.tipoId">
                          <!-- Critério Gestionário ...............................-->
                          <v-row v-if="c.tipoId == 'CriterioJustificacaoGestionario'">
                            <v-col xs="2" sm="2">
                              <div class="info-label">Critério Gestionário</div>
                            </v-col>
                            <v-col xs="10" sm="10">
                              <div
                                class="info-content"
                              >{{ mylabels.textoCriterioJustificacaoGestionario }}</div>
                            </v-col>
                          </v-row>

                          <!-- Critério Utilidade Administrativa .................-->
                          <v-row v-if="c.tipoId == 'CriterioJustificacaoUtilidadeAdministrativa'">
                            <v-col xs="2" sm="2">
                              <div class="info-label">Critério de Utilidade Administrativa</div>
                            </v-col>
                            <v-col xs="10" sm="10">
                              <div class="info-content">
                                {{ c.conteudo }}
                                <br>
                                <br>
                                <ul>
                                  <li v-for="p in c.processos" :key="p.procId">
                                    <a :href="'/classes/consultar/' + p.procId">{{ p.procId.split('c')[1]}} - {{p.nome}}</a>
                                  </li>
                                </ul>
                              </div>
                            </v-col>
                          </v-row>

                          <!-- Critério Legal ...................................-->
                          <v-row v-if="c.tipoId == 'CriterioJustificacaoLegal'">
                            <v-col xs="2" sm="2">
                              <div class="info-label">Critério Legal</div>
                            </v-col>
                            <v-col xs="10" sm="10">
                              <div class="info-content">
                                {{ c.conteudo }}
                                <br>
                                <br>
                                <ul>
                                  <li
                                    v-for="l in c.legislacao"
                                    :key="l.legId"
                                  >
                                  <a :href="'/legislacao/' + l.legId ">{{l.tipo}} {{l.numero}}</a>
                                  </li>
                                </ul>
                              </div>
                            </v-col>
                          </v-row>
                        </div>
                      </div>
                    </v-col>
                  </v-row>

                  <!-- DESTINO FINAL ................................................... -->

                  <v-row>
                    <v-col xs="12" sm="12">
                      <v-toolbar color="indigo font-weight-medium" dark height="30">
                        <v-toolbar-title>Destino Final</v-toolbar-title>
                      </v-toolbar>
                    </v-col>
                  </v-row>

                  <v-row>
                    <!-- VALOR -->
                    <v-col xs="2" sm="2">
                      <div class="info-label">
                        Destino Final
                        <InfoBox
                          header="Destino Final"
                          :text="myhelp.Classe.Campos.DF"
                          helpColor="indigo darken-4"
                          dialogColor="#E0F2F1"
                        />
                      </div>
                    </v-col>
                    <v-col xs="10" sm="10">
                      <div class="info-content">
                        <span v-if="classe.df.valor == 'E'">Eliminação</span>
                        <span v-else-if="classe.df.valor == 'C'">Conservação</span>
                        <span v-else>Não Especificado</span>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row v-if="classe.df.nota">
                    <!-- NOTA ao DF -->
                    <v-col xs="2" sm="2">
                      <div class="info-label">Nota</div>
                    </v-col>
                    <v-col xs="10" sm="10">
                      <div class="info-content">{{ classe.df.nota }}</div>
                    </v-col>
                  </v-row>

                  <v-row v-if="classe.df.justificacao">
                    <!-- JUSTIFICAÇÂO -->
                    <v-col xs="2" sm="2">
                      <div class="info-label">
                        Justificação
                        <InfoBox
                          header="Justificação do DF"
                          :text="myhelp.Classe.Campos.JustificacaoDF"
                          helpColor="indigo darken-4"
                          dialogColor="#E0F2F1"
                        />
                      </div>
                    </v-col>
                    <v-col xs="10" sm="10">
                      <div class="info-content">
                        <div v-for="c in classe.df.justificacao" :key="c.tipoId">
                          <!-- Critério Legal ...................................-->
                          <v-row v-if="c.tipoId == 'CriterioJustificacaoLegal'">
                            <v-col xs="2" sm="2">
                              <div class="info-label">Critério Legal</div>
                            </v-col>
                            <v-col xs="10" sm="10">
                              <div class="info-content">
                                {{ c.conteudo }}
                                <br>
                                <br>
                                <ul>
                                  <li
                                    v-for="l in c.legislacao"
                                    :key="l.legId"
                                  >
                                  <a :href="'/legislacao/' + l.legId ">{{l.tipo}} {{l.numero}}</a>
                                  </li>
                                </ul>
                              </div>
                            </v-col>
                          </v-row>

                          <!-- Critério de Densidade Informacional ..............-->
                          <v-row v-if="c.tipoId == 'CriterioJustificacaoDensidadeInfo'">
                            <v-col xs="2" sm="2">
                              <div class="info-label">Critério de Densidade Informacional</div>
                            </v-col>
                            <v-col xs="10" sm="10">
                              <div class="info-content">
                                {{ mylabels.textoCriterioDensidadeInfo }}
                                <br>
                                <br>
                                <ul>
                                  <li v-for="p in c.processos" :key="p.procId">
                                    <a :href="'/classes/consultar/' + p.procId">{{ p.procId.split('c')[1]}} - {{p.nome}}</a>
                                  </li>
                                </ul>
                              </div>
                          
                            </v-col>
                          </v-row>

                          <!-- Critério de Complementaridade Informacional ..............-->
                          <v-row v-if="c.tipoId == 'CriterioJustificacaoComplementaridadeInfo'">
                            <v-col xs="2" sm="2">
                              <div class="info-label">Critério de Complementaridade Informacional</div>
                            </v-col>
                            <v-col xs="10" sm="10">
                              <div class="info-content">
                                {{ mylabels.textoCriterioComplementaridade }}
                                <br>
                                <br>
                                <ul>
                                  <li v-for="p in c.processos" :key="p.procId">
                                    <a :href="'/classes/consultar/' + p.procId">{{ p.procId.split('c')[1]}} - {{p.nome}}</a>
                                  </li>
                                </ul>
                              </div>
                            </v-col>
                          </v-row>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>

        <p v-else>A carregar...</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const lhost = require("@/config/global").host;

import axios from "axios";
import ClassesFilho from "@/components/classes/consulta/ClassesFilho.vue";
import NotasAp from "@/components/classes/consulta/NotasAp.vue";
import NotasEx from "@/components/classes/consulta/NotasEx.vue";
import ExemplosNotasAp from "@/components/classes/consulta/ExemplosNotasAp.vue";
import TermosIndice from "@/components/classes/consulta/TermosIndice.vue";
import Donos from "@/components/classes/consulta/Donos.vue";
import Participantes from "@/components/classes/consulta/Participantes.vue";
import ProcessosRelacionados from "@/components/classes/consulta/ProcessosRelacionados.vue";
import Legislacao from "@/components/classes/consulta/Legislacao.vue";
import ClassesArvoreLateral from "@/components/classes/ClassesArvoreLateral.vue";

import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["idc"],
  data: () => ({
    classe: {},
    classeLoaded: false,

    filhosHeaders: [
      { text: "Código", align: "left", sortable: false, value: "codigo" },
      { text: "Título", value: "titulo" }
    ],
    myhelp: require("@/config/help").help,
    mylabels: require("@/config/labels").criterios
  }),

  components: {
    InfoBox,
    ClassesFilho,
    NotasAp,
    NotasEx,
    ExemplosNotasAp,
    TermosIndice,
    Donos,
    Participantes,
    ProcessosRelacionados,
    Legislacao,
    ClassesArvoreLateral
  },

  methods: {
    go: function(idClasse) {
      this.$router.push("/classes/consultar/c" + idClasse);
    },
  },
  mounted: function() {
    axios
      .get(lhost + "/api/classes/" + this.idc)
      .then( async response => {
        this.classe = response.data;
        if(this.classe.df.justificacao){
          
          for(let i = 0; i < this.classe.df.justificacao.length; i++){
            if(this.classe.df.justificacao[i].processos){
                
                for(let j = 0; j < this.classe.df.justificacao[i].processos.length; j++){
                  
                  let help = lhost + "/api/classes/" + this.classe.df.justificacao[i].processos[j].procId + "/meta"
                  
                  await axios.get(help)
                         .then(response => {
                            this.classe.df.justificacao[i].processos[j].nome = response.data[0].titulo
                         })
                  }
            }
            
            if(this.classe.df.justificacao[i].legislacao){
              for(let j = 0; j < this.classe.df.justificacao[i].legislacao.length; j++){
                await axios.get(lhost + "/api/legislacao/" + this.classe.df.justificacao[i].legislacao[j].legId)
                         .then(response => {
                           this.classe.df.justificacao[i].legislacao[j].tipo = response.data.tipo
                           this.classe.df.justificacao[i].legislacao[j].numero = response.data.numero
                           
                         })
              }
            }
          }
        }
        if(this.classe.pca.justificacao){
          for(let h = 0; h < this.classe.pca.justificacao.length; h++){
            if(this.classe.pca.justificacao[h].processos){
              
              for(let z = 0; z < this.classe.pca.justificacao[h].processos.length; z++){
                if(this.classe.pca.justificacao[h].processos[z].procId){
                  await axios.get(lhost + "/api/classes/" + this.classe.pca.justificacao[h].processos[z].procId + "/meta")
                          .then(response => {
                            this.classe.pca.justificacao[h].processos[z].nome = response.data[0].titulo
                          })
                }   
              }
      
            }
            
            if(this.classe.pca.justificacao[h].legislacao){
              for(let z = 0; z < this.classe.pca.justificacao[h].legislacao.length; z++){
                await axios.get(lhost + "/api/legislacao/" + this.classe.pca.justificacao[h].legislacao[z].legId)
                           .then(response => {
                            
                             this.classe.pca.justificacao[h].legislacao[z].tipo = response.data.tipo
                             this.classe.pca.justificacao[h].legislacao[z].numero = response.data.numero
                           })
              }
            }
          }
        }
        this.classeLoaded = true;
      })
      .catch(error => {
        return error;
      });
  }
};
</script>

<style>
.myPanelHeader {
  color: #304ffe;
}

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
