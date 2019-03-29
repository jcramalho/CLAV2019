<template>
    <v-container grid-list-md fluid>
      <v-layout row wrap justify-center>
        <!-- MENU LATERAL -->
        <v-flex xs12 sm2>
            <ClassesArvoreLateral/>
        </v-flex>
        <v-flex xs12 sm10>    
          <!-- HEADER -->
          <v-card>
            <v-toolbar color="teal darken-4" dark>
              <v-toolbar-title>Nova Classe</v-toolbar-title>
            </v-toolbar>

            <v-card-text>
                <v-container fluid>
                    <v-layout wrap>
                        <v-flex xs2>
                            <v-subheader>Nível:</v-subheader>
                        </v-flex>
                        <v-flex xs6>
                            <v-select
                                item-text="label"
                                item-value="value"
                                v-model="classe.nivel"
                                :items="classeNiveis"
                                label="Selecione o nível da classe:"
                                solo
                                dense
                            />
                        </v-flex>
                    </v-layout>
                    <v-layout wrap v-if="classe.nivel>1">
                        <!-- CLASSE PAI -->
                        <v-flex xs2>
                            <v-subheader>Classe Pai:</v-subheader>
                        </v-flex>
                        <v-flex xs10>
                            <v-select
                                item-text="label"
                                item-value="value"
                                v-model="classe.pai.codigo"
                                :items="classesPai"
                                label="Selecione uma classe de nível superior"
                                solo
                                dense
                            />
                        </v-flex>
                    </v-layout>
                    <v-layout wrap v-if="(classe.nivel==1)||classe.pai.codigo">
                        <!-- CÓDIGO DA NOVA CLASSE -->
                        <v-flex xs2>
                            <v-subheader>Código:</v-subheader>
                        </v-flex>
                        <v-flex xs10>
                            <v-text-field
                                v-model="classe.codigo"
                                label="Código"
                                solo
                                clearable
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout wrap v-if="(classe.nivel==1)||classe.pai.codigo">
                        <!-- TÍTULO -->
                        <v-flex xs2>
                            <v-subheader>Título:</v-subheader>
                        </v-flex>
                        <v-flex xs10>
                            <v-text-field
                                v-model="classe.titulo"
                                label="Título"
                                solo
                                clearable
                            ></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-expansion-panel popout>
                        <!-- DESCRITIVO DA CLASSE -->
                        <v-expansion-panel-content>
                            <template v-slot:header>
                                <v-toolbar color="teal darken-4 body-2 font-weight-bold" dark>
                                    <v-toolbar-title>Descritivo da Classe</v-toolbar-title>
                                </v-toolbar>
                            </template>
                            <v-layout wrap>
                                <!-- DESCRIÇÂO -->
                                <v-flex xs2>
                                    <v-subheader>Descrição:</v-subheader>
                                </v-flex>
                                <v-flex xs9>
                                    <v-text-field
                                        v-model="classe.descricao"
                                        label="Descrição"
                                        solo
                                        clearable
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout wrap row>
                                <!-- Notas de Aplicação -->
                                <v-flex xs2>
                                    <v-subheader>Notas de Aplicação:</v-subheader>
                                    <v-btn color="green darken-2" dark round @click="insereNovaNota(classe.notasAp, 'na')">
                                        Nota Aplic.
                                        <v-icon dark right>add_circle_outline</v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-flex>
                                    <v-layout fluid row v-for="(nota, index) in classe.notasAp" :key="index">
                                        <v-flex xs9>
                                            <v-textarea
                                                v-model="nota.nota"
                                                auto-grow
                                                solo
                                                label="Nota de Aplicação:"
                                                rows="1"
                                            ></v-textarea>
                                        </v-flex>
                                        <v-flex>
                                            <v-btn color="red darken-2" dark round @click="classe.notasAp.splice(index,1)">
                                                Remover
                                                <v-icon dark right>clear</v-icon>
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                            <v-layout wrap row>
                                <!-- Notas de Exclusão -->
                                <v-flex xs2>
                                    <v-subheader>Notas de Exclusão:</v-subheader>
                                    <v-btn color="green darken-2" dark round @click="insereNovaNota(classe.notasEx, 'ne')">
                                        Nota Exclusão
                                        <v-icon dark right>add_circle_outline</v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-flex>
                                    <v-layout fluid row v-for="(nota, index) in classe.notasEx" :key="index">
                                        <v-flex xs9>
                                            <v-textarea
                                                v-model="nota.nota"
                                                auto-grow
                                                solo
                                                label="Nota de Exclusão:"
                                                rows="1"
                                            ></v-textarea>
                                        </v-flex>
                                        <v-flex>
                                            <v-btn color="red darken-2" dark round @click="classe.notasEx.splice(index,1)">
                                                Remover
                                                <v-icon dark right>clear</v-icon>
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-container>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>
  const axios = require('axios')
  const nanoid = require('nanoid')
  import ClassesArvoreLateral from '@/components/classes/ClassesArvoreLateral.vue'
  
  export default {
    
    data: () => ({
        // Objeto que guarda uma classe

        classe: {
            // Metainformação e campos da área de Descrição

            nivel: 0,
            pai: {
                codigo: "",
                titulo: ""
            },
            codigo: "",
            titulo: "",
            descricao: "",
            notasAp: [],
            exemplosNotasAp: [],
            notasEx: [],
            termosInd: [],

            temSubclasses4Nivel: false,
            temSubclasses4NivelPCA: false,
            temSubclasses4NivelDF: false,
            subdivisao4Nivel01Sintetiza02: true,

            // Campos da área do Contexto de Avaliação
            // Tipo de processo

            tipoProc: "PC",
            procTrans: "N",

            // Donos do processo: lista de entidades

            donos: [],

            // Participantes no processo: lista de entidades

            participantes: [],

            // Processos Relacionados

            processosRelacionados: [],

            // Legislação Associada

            legislacao: [],

            // Bloco de decisão de avaliação: PCA e DF

            pca: {
                valor: null,
                formaContagem: "",
                subFormaContagem: "",
                justificacao: []        // j = [criterio]
            },                          // criterio = {tipo, notas, [proc], [leg]}

            df: {
                valor: "NE",
                notas: null,
                justificacao: []
            },

            // Bloco de subclasses de nível 4, caso haja desdobramento

            subclasses: []
        },

        // Estruturas auxiliares

        codeFormats: {
                1: /^[0-9]{3}$/,
                2: /^[0-9]{3}\.[0-9]{2}$/,
                3: /^[0-9]{3}\.[0-9]{2}\.[0-9]{3}$/,
                4: /^[0-9]{3}\.[0-9]{2}\.[0-9]{3}\.[0-9]{3}$/,
        },

        classeNiveis: [
            {label: 'Nível 1', value: '1'},
            {label: 'Nível 2', value: '2'},
            {label: 'Nível 3', value: '3'}
        ],

        classesPai: [],

        semaforos: {
            paisReady: false,
            classesReady: false,
            entidadesReady: false,
            legislacaoReady: false,
            pcaFormasContagemReady: false,
            pcaSubFormasContagemReady: false,
        },
    }),

    components: { 
        ClassesArvoreLateral
    },

    watch: {
        'classe.pai.codigo': function () {
            // O código da classe depende da classe pai
            this.classe.codigo = null;
            if(this.classe.pai.codigo)
                this.classe.codigo = this.classe.pai.codigo + ".";
        },
        'classe.nivel': function () {
            // A classe pai depende do nível 
            this.classe.pai.codigo = null;
            
            if (this.classe.nivel > 1) {
                if(this.classesPai.length == 0) this.loadPais();
            }
            if (this.classe.nivel >= 3 && !this.classesReady) {
                this.loadProcessos();
            }
            if(this.classe.nivel >= 3){
                this.loadPCA();
            }
        },
        'classe.codigo': function () {
            this.mensValCodigo = "";

            if (!this.codeFormats[this.classe.nivel].test(this.classe.codigo)) {
                this.mensValCodigo = "Formato inválido";
            }
            else if(!this.classe.codigo.includes(this.classe.pai.codigo)){
                this.mensValCodigo = "Não pode alterar o código do pai selecionado em cima...";
            }
            else {
                this.verificaExistenciaCodigo(this.classe.codigo);
            }
        }
    },

    methods: {
        // Carrega os potenciais pais da BD, quando alguém muda o nível para >1....................

        loadPais: async function () {
            try{
                var response = await axios.get("http://localhost:7778/api/classes?nivel=" + (this.classe.nivel - 1));
                this.classesPai = response.data.map(function (item) {
                    return {
                        label: item.codigo + " - " + item.titulo,
                        value: item.id.split('#')[1],
                    }
                    }).sort(function (a, b) {
                        return a.label.localeCompare(b.label);
                    });
            }
            catch(erro){
                console.log(erro);
            }
        },
        insereNovaNota: function(notas, tipo){
            var n = {id: tipo + '_' + nanoid(), conteudo: ''};
            notas.push(n);
        },
        removeNota: function(ind){
            this.classe.notasAp.splice(ind,1)
        }
    }
  }
</script>

<style>

</style>
