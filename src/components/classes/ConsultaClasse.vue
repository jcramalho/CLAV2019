<template>
    <v-container grid-list-md fluid>
      <v-layout row wrap justify-center>
        <!-- MENU LATERAL -->
        <v-flex xs12 sm2>
            <ClassesArvoreLateral/>
        </v-flex>
        <v-flex xs12 sm10>    
          <!-- HEADER -->
          <v-card v-if="classeLoaded">
            <v-toolbar color="indigo darken-1" dark>
              <v-toolbar-title>{{ this.classe.codigo }}: {{ this.classe.titulo }}</v-toolbar-title>
            </v-toolbar>

            <v-card-text>

                <ClassesFilho :subclasses="classe.filhos" v-if="classe.filhos.length > 0"/>

                <v-expansion-panel popout>
                <!-- DESCRITIVO DA CLASSE -->
                <v-expansion-panel-content>
                    <template v-slot:header>
                        <v-toolbar color="indigo accent-4 body-2 font-weight-bold" dark>
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

                    <NotasAp :notas="classe.notasAp" v-if="classe.notasAp.length > 0"/>

                    <ExemplosNotasAp :exemplos="classe.exemplosNotasAp" v-if="classe.exemplosNotasAp.length > 0"/>

                    <NotasEx :notas="classe.notasEx" v-if="classe.notasEx.length > 0"/>

                    <TermosIndice :termos="classe.termosInd" v-if="classe.termosInd.length > 0"/>

                </v-expansion-panel-content>

                <!-- CONTEXTO DA CLASSE -->
                <v-expansion-panel-content v-if="classe.nivel == 3">
                    <template v-slot:header>
                        <v-toolbar color="indigo accent-4 body-2 font-weight-bold" dark>
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
                                {{ (classe.procTrans=='S')?'Sim':'Não' }}
                            </div>
                        </v-flex>
                    </v-layout>

                    <Donos :entidades="classe.donos" v-if="classe.donos.length > 0"/>
                    
                    <Participantes :entidades="classe.participantes" v-if="classe.participantes.length > 0"/>

                    <ProcessosRelacionados :processos="classe.processosRelacionados" v-if="classe.processosRelacionados.length > 0"/>

                    <Legislacao :legs="this.classe.legislacao" v-if="classe.legislacao.length > 0"/>

                </v-expansion-panel-content>

                <v-expansion-panel-content v-if="((classe.nivel == 3)&&(classe.filhos.length == 0))||(classe.nivel == 4)">
                    <template v-slot:header>
                        <v-toolbar color="indigo accent-4 body-2 font-weight-bold" dark>
                            <v-toolbar-title>Decisões de Avaliação</v-toolbar-title>
                        </v-toolbar>
                    </template>
                    <v-card class="light-blue lighten-5">
                        <v-toolbar color="light-blue accent-2 font-weight-medium" dark>
                            <v-toolbar-title>Prazo de Conservação Administrativa (PCA)</v-toolbar-title>
                        </v-toolbar>
                        <v-card-title>
                            <v-flex xs12 sm6>
                                <v-text-field
                                    label="PCA"
                                    readonly
                                    :value="this.classe.pca.valores+' anos'"
                                ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 v-if="this.classe.pca.notas">
                            <v-text-field
                                label="Notas"
                                readonly
                                :value="this.classe.pca.notas"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6>
                            <v-text-field
                                label="Forma de Contagem"
                                readonly
                                :value="this.classe.pca.formaContagem"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 v-if="this.classe.pca.subFormaContagem">
                            <v-text-field
                                label="Subforma de Contagem"
                                readonly
                                :value="this.classe.pca.subFormaContagem"
                            ></v-text-field>
                        </v-flex>
                    </v-card-title>
                    </v-card>
                    <v-container xs11 justify-center>
                        <v-card>
                            <v-toolbar color="light-blue accent-1 font-weight-medium">
                                <v-toolbar-title>Justificação</v-toolbar-title>
                            </v-toolbar>
                            
                            <v-container xs11 justify-center v-for="c in this.classe.pca.justificacao" :key="c.criterio">
                                <v-card>
                                    <v-toolbar color="light-blue lighten-5">
                                        <v-toolbar-title>{{ c.tipoLabel }}</v-toolbar-title>
                                    </v-toolbar>
                                    <v-card-text>
                                        <span>{{ c.conteudo }}</span>
                                    </v-card-text>
                                </v-card>
                            </v-container>
                        </v-card>
                    </v-container>

                    <v-card class="light-blue lighten-5">
                        <v-toolbar color="light-blue accent-2 font-weight-medium" dark>
                            <v-toolbar-title>Destino Final (DF)</v-toolbar-title>
                        </v-toolbar>
                        <v-card-title>
                            <v-flex xs12 sm6>
                                <v-text-field
                                    label="Destino Final"
                                    readonly
                                    :value="this.classe.df.valor"
                                ></v-text-field>
                            </v-flex>
                        </v-card-title>
                    </v-card>
                    <v-container xs11 justify-center>
                        <v-card>
                            <v-toolbar color="light-blue accent-1 font-weight-medium">
                                <v-toolbar-title>Justificação</v-toolbar-title>
                            </v-toolbar>
                            
                            <v-container xs11 justify-center v-for="c in this.classe.df.justificacao" :key="c.criterio">
                                <v-card>
                                    <v-toolbar color="light-blue lighten-5">
                                        <v-toolbar-title>{{ c.tipoLabel }}</v-toolbar-title>
                                    </v-toolbar>
                                    <v-card-text>
                                        <span>{{ c.conteudo }}</span>
                                    </v-card-text>
                                </v-card>
                            </v-container>
                        </v-card>
                    </v-container>
                    
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
const lhost = require('@/config/global').host   
import axios from 'axios'
import ClassesFilho from '@/components/classes/ClassesFilho.vue'
import NotasAp from '@/components/classes/NotasAp.vue'
import NotasEx from '@/components/classes/NotasEx.vue'
import ExemplosNotasAp from '@/components/classes/ExemplosNotasAp.vue'
import TermosIndice from '@/components/classes/TermosIndice.vue'
import Donos from '@/components/classes/Donos.vue'
import Participantes from '@/components/classes/Participantes.vue'
import ProcessosRelacionados from '@/components/classes/ProcessosRelacionados.vue'
import Legislacao from '@/components/classes/Legislacao.vue'
import ClassesArvoreLateral from '@/components/classes/ClassesArvoreLateral.vue'

export default {
    props: ["idc"],
    data: () => ({
      classe: {},
      classeLoaded: false,
      filhosHeaders: [
          { text: 'Código', align: 'left', sortable: false, value: 'codigo' },
          { text: 'Título', value: 'titulo' }
        ]
    }),

    components: {
        ClassesFilho, NotasAp, NotasEx, ExemplosNotasAp, TermosIndice, Donos, Participantes, 
        ProcessosRelacionados, Legislacao, ClassesArvoreLateral
    },

    methods: {
        go: function(idClasse){
            this.$router.push('/classes/consultar/c'+idClasse);
        }
    },
    
    mounted: function (){
        axios
            .get(lhost + '/api/classes/' + this.idc)
            .then(response => {
                this.classe = response.data;
                this.classeLoaded = true;
            })
            .catch(error => { return(error)})
    }
  }
</script>
.myPanelHeader { color: #304FFE; }

<style>

.info-label {
    color: #1A237E;
    padding: 5px; 
    font-weight: 400;
    width: 100%;
    background-color: #dee2f8;
    font-weight: bold;
}

.info-content {
    padding: 5px; 
    width: 100%;
    border: 1px solid #1A237E ;
}

.is-collapsed li:nth-child(n+5) {
    display: none;
}
</style>
