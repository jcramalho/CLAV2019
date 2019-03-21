<template>
    <v-container>
      <v-layout row wrap justify-center>
        <v-flex xs12>    
          <!-- HEADER -->
          <v-card v-if="classeLoaded">
            <v-toolbar color="indigo darken-1" dark>
              <v-toolbar-title>{{ this.classe.codigo }}: {{ this.classe.titulo }}</v-toolbar-title>
            </v-toolbar>

            <v-card-text>

                <v-expansion-panel popout>
                <!-- DESCRITIVO DA CLASSE -->
                <v-expansion-panel-content>
                    <template v-slot:header>
                        <v-toolbar color="indigo accent-4 body-2 font-weight-bold" dark>
                            <v-toolbar-title>Descritivo da Classe</v-toolbar-title>
                        </v-toolbar>
                    </template>
                    <v-card class="indigo lighten-5">
                        <v-card-title>
                            <div>
                                <div class="subheading font-weight-medium">Descrição</div>
                                <span>{{this.classe.descricao}}</span>
                            </div>
                        </v-card-title>
                        <v-card-title v-if="this.classe.filhos.length > 0">
                            <ClassesFilho :subclasses="this.classe.filhos"/>
                        </v-card-title>
                        <v-card-title v-if="this.classe.notasAp.length > 0">
                            <NotasAp :notas="this.classe.notasAp"/>
                        </v-card-title>
                        <v-card-title v-if="this.classe.exemplosNotasAp.length > 0">
                            <ExemplosNotasAp :exemplos="this.classe.exemplosNotasAp"/>
                        </v-card-title>
                        <v-card-title v-if="this.classe.notasEx.length > 0">
                            <NotasEx :notas="this.classe.notasEx"/>
                        </v-card-title>
                        <v-card-title v-if="this.classe.termosInd.length > 0">
                            <TermosIndice :termos="this.classe.termosInd"/>
                        </v-card-title>
                    </v-card>
                </v-expansion-panel-content>

                <!-- CONTEXTO DA CLASSE -->
                <v-expansion-panel-content>
                    <template v-slot:header>
                        <v-toolbar color="deep-purple accent-4 body-2 font-weight-bold" dark>
                            <v-toolbar-title>Contexto de Avaliação</v-toolbar-title>
                        </v-toolbar>
                    </template>
                    <v-card class="deep-purple lighten-5">
                        <v-card-title>
                        <v-flex xs12 sm6>
                            <v-text-field
                                label="Tipo de Processo"
                                readonly
                                :value="this.classe.tipoProc"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6>
                            <v-text-field
                                label="Processo Transversal"
                                readonly
                                :value="(this.classe.procTrans=='S')?'Sim':'Não'"
                            ></v-text-field>
                        </v-flex>
                    </v-card-title>
                    <v-card-title v-if="this.classe.donos.length > 0">
                        <Donos :entidades="this.classe.donos"/>
                    </v-card-title>
                    <v-card-title v-if="this.classe.participantes.length > 0">
                        <Participantes :entidades="this.classe.participantes"/>
                    </v-card-title>
                    <v-card-title v-if="this.classe.processosRelacionados.length > 0">
                        <ProcessosRelacionados :processos="this.classe.processosRelacionados"/>
                    </v-card-title>
                    <v-card-title v-if="this.classe.legislacao.length > 0">
                        <Legislacao :legs="this.classe.legislacao"/>
                    </v-card-title>
                    </v-card>
                </v-expansion-panel-content>

                <v-expansion-panel-content>
                    <template v-slot:header>
                        <v-toolbar color="light-blue accent-4 body-2 font-weight-bold" dark>
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
          
          <p v-else>Loading...</p>
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>
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
        ProcessosRelacionados, Legislacao
    },

    methods: {
        go: function(idClasse){
            this.$router.push('/classes/c'+idClasse);
        }
    },
    
    mounted: function (){
        axios
            .get('http://localhost:7778/api/classes/' + this.idc)
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

</style>
