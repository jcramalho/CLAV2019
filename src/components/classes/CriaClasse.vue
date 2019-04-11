<template>
    <v-container grid-list-md fluid>
      <v-layout row wrap justify-center>
        <!-- MENU LATERAL 
        <v-flex xs12 sm2>
            <ClassesArvoreLateral/>
        </v-flex>-->
        <v-flex xs12>    
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
                    <!-- CLASSE PAI -->
                    <v-layout wrap v-if="classe.nivel>1">
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
                    <!-- CÓDIGO DA NOVA CLASSE -->
                    <v-layout wrap v-if="(classe.nivel==1)||classe.pai.codigo">
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
                    <!-- TÍTULO -->
                    <v-layout wrap v-if="(classe.nivel==1)||classe.pai.codigo">
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

                            <hr/>

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

                            <hr/>

                            <v-layout wrap row>
                                <!-- Exemplos de notas de Aplicação -->
                                <v-flex xs2>
                                    <v-subheader>Exemplo(s) de Nota(s) de Aplicação:</v-subheader>
                                    <v-btn color="green darken-2" dark round @click="insereNovaNota(classe.exemplosNotasAp, 'exna')">
                                        Novo exemplo
                                        <v-icon dark right>add_circle_outline</v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-flex>
                                    <v-layout fluid row v-for="(ex, index) in classe.exemplosNotasAp" :key="index">
                                        <v-flex xs9>
                                            <v-textarea
                                                v-model="ex.exemplo"
                                                auto-grow
                                                solo
                                                label="Exemplo de Nota de Aplicação"
                                                rows="1"
                                            ></v-textarea>
                                        </v-flex>
                                        <v-flex>
                                            <v-btn color="red darken-2" dark round @click="classe.exemplosNotasAp.splice(index,1)">
                                                Remover
                                                <v-icon dark right>clear</v-icon>
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>

                            <hr/>

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

                            <hr/>

                            <v-layout wrap row>
                                <!-- TERMOS DE ÍNDICE -->
                                <v-flex xs2>
                                    <v-subheader>Termos de Índice:</v-subheader>
                                    <v-btn color="green darken-2" dark round @click="insereNovoTI(classe.termosInd)">
                                        Novo termo
                                        <v-icon dark right>add_circle_outline</v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-flex>
                                    <v-layout fluid row v-for="(ti, index) in classe.termosInd" :key="index">
                                        <v-flex xs9>
                                            <v-textarea
                                                v-model="ti.termo"
                                                auto-grow
                                                solo
                                                label="Termo de Índice"
                                                rows="1"
                                            ></v-textarea>
                                        </v-flex>
                                        <v-flex>
                                            <v-btn color="red darken-2" dark round @click="classe.termosInd.splice(index,1)">
                                                Remover
                                                <v-icon dark right>clear</v-icon>
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>

                        </v-expansion-panel-content>

                        <!-- CONTEXTO DE AVALIAÇÂO DA CLASSE -->
                        <v-expansion-panel-content v-if="classe.nivel == 3">
                            <template v-slot:header>
                                <v-toolbar color="teal darken-4 body-2 font-weight-bold" dark>
                                    <v-toolbar-title>Contexto de Avaliação</v-toolbar-title>
                                </v-toolbar>
                            </template>
                            <!-- TIPO DE PROCESSO -->
                            <v-layout row wrap>
                                <v-flex xs2>
                                    <v-subheader>Tipo de Processo:</v-subheader>
                                </v-flex>
                                <v-flex xs9>
                                    <v-select
                                        item-text="label"
                                        item-value="value"
                                        v-model="classe.tipoProc"
                                        :items="processoTipos"
                                        label="Selecione o tipo de processo:"
                                        solo
                                        dense
                                    />
                                </v-flex>
                            </v-layout>

                            <!-- PROCESSO TRANVERSAL -->
                            <v-layout row wrap>
                                <v-flex xs2>
                                    <v-subheader>Processo Transversal:</v-subheader>
                                </v-flex>
                                <v-flex xs9>
                                    <v-select
                                        item-text="label"
                                        item-value="value"
                                        v-model="classe.procTrans"
                                        :items="simNao"
                                        label="Indique se o processo é transversal:"
                                        solo
                                        dense
                                    />
                                </v-flex>
                            </v-layout>

                            <hr style="border: 3px solid green; border-radius: 2px;"/>

                            <!-- DONOS -->
                            <DonosOps 
                                :entidades="classe.donos" 
                                @unselectEntidade="unselectEntidade($event)"
                            />

                            <hr style="border-top: 1px dashed green;"/>

                            <DonosSelect
                                :entidadesReady="semaforos.entidadesReady"
                                :entidades="entidadesD"
                                @selectEntidade="selectEntidade($event)"
                            />

                            <hr style="border: 3px solid green; border-radius: 2px;"/>

                            <!-- PARTICIPANTES -->
                            <ParticipantesOps 
                                :entidades="classe.participantes" 
                                @unselectParticipante="unselectParticipante($event)"
                            />
                            
                            <hr style="border-top: 1px dashed green;"/>

                            <ParticipantesSelect
                                :entidadesReady="semaforos.entidadesReady"
                                :entidades="entidadesP"
                                @selectParticipante="selectParticipante($event)"
                            />

                            <hr style="border: 3px solid green; border-radius: 2px;"/>

                            <!-- PROCESSOS RELACIONADOS -->
                            <ProcessosRelacionadosOps 
                                :processos="classe.processosRelacionados" 
                                @unselectProcRel="unselectProcesso($event)"
                            />

                            <hr style="border-top: 1px dashed green;"/>

                            <ProcessosRelacionadosSelect
                                :procReady="semaforos.classesReady"
                                :processos="listaProcessos"
                                @selectProcesso="selectProcesso($event)"
                            />

                            <hr style="border: 3px solid green; border-radius: 2px;"/>

                            <!-- LEGISLAÇÂO -->
                            <LegislacaoOps
                                :legs="classe.legislacao"
                                @unselectDiploma="unselectDiploma($event)"
                            />

                            <hr style="border-top: 1px dashed green;"/>

                            <LegislacaoSelect
                                :legs="listaLegislacao"
                                :legislacaoReady="semaforos.legislacaoReady"
                                @selectDiploma="selectDiploma($event)"
                            />

                        </v-expansion-panel-content>

                        <!-- DECISÕES DE AVALIAÇÂO -->
                        <v-expansion-panel-content v-if="classe.nivel == 3">
                            <template v-slot:header>
                                <v-toolbar color="teal darken-4 body-2 font-weight-bold" dark>
                                    <v-toolbar-title>Decisões de Avaliação</v-toolbar-title>
                                </v-toolbar>
                            </template>
                            <!-- HÁ SUBDIVISÃO? -->
                            <Subdivisao3Nivel
                                :subdivisao="classe.temSubclasses4Nivel" @subdivisao="classe.temSubclasses4Nivel=$event"
                                :motivoPCA="classe.temSubclasses4NivelPCA" @motivoPCA="classe.temSubclasses4NivelPCA=$event"
                                :motivoDF="classe.temSubclasses4NivelDF" @motivoDF="classe.temSubclasses4NivelDF=$event" 
                                :subclasse01Sintetiza02="classe.subdivisao4Nivel01Sintetiza02" @subclasse01Sintetiza02="classe.subdivisao4Nivel01Sintetiza02=$event"
                                :codigoClasse="classe.codigo"
                            />

                            <hr style="border: 3px solid green; border-radius: 2px;"/>

                            <!-- DECISÃO SEM SUBDIVISÃO -->
                                <!-- PCA -->
                            <v-container fluid>
                            <v-layout row wrap color="teal lighten-5" v-if="!classe.temSubclasses4Nivel">
                                <v-flex xs2>
                                    <span class="title">Prazo de Conservação Administrativa</span>
                                </v-flex>
                                <v-flex xs9>
                                    <v-layout row wrap>
                                        <v-flex xs2>
                                            <v-subheader>Prazo:</v-subheader>
                                        </v-flex>
                                        <v-flex xs10>
                                            <v-text-field
                                                v-model="classe.pca.valor"
                                                label="Prazo em anos"
                                                solo
                                                clearable
                                            ></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap v-if="semaforos.pcaFormasContagemReady">
                                        <v-flex xs2>
                                            <v-subheader>Forma de Contagem:</v-subheader>
                                        </v-flex>
                                        <v-flex xs10>
                                            <v-select
                                                item-text="label"
                                                item-value="value"
                                                v-model="classe.pca.formaContagem"
                                                :items="pcaFormasContagem"
                                                label="Selecione uma forma de contagem para o prazo"
                                                solo
                                                dense
                                            />
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap v-if="semaforos.pcaSubFormasContagemReady && classe.pca.formaContagem=='vc_pcaFormaContagem_disposicaoLegal'">
                                        <v-flex xs2>
                                            <v-subheader>Subforma de contagem:</v-subheader>
                                        </v-flex>
                                        <v-flex xs10>
                                            <v-select
                                                item-text="label"
                                                item-value="value"
                                                v-model="classe.pca.subFormaContagem"
                                                :items="pcaSubFormasContagem"
                                                label="Selecione uma subforma de contagem para o prazo"
                                                solo
                                                dense
                                            />
                                        </v-flex>
                                    </v-layout>

                                    <hr style="border-top: 2px dashed green;"/>

                                </v-flex>

                                <!-- JUSTIFICAÇÂO DO PCA -->
                                <v-container fluid>
                                <v-layout row wrap>
                                    <v-flex xs2>
                                        <span class="subheading">Justificação do PCA</span>
                                    </v-flex>
                                    <v-flex xs9>
                                        <v-layout row justify-start>
                                            <v-flex>
                                                <v-btn color="indigo darken-3" dark 
                                                    @click="adicionarCriterioGestionario(classe.pca.justificacao, 'CriterioJustificacaoGestionario', 'Critério Gestionário', textoCriterioGestionario, [], [])"
                                                    v-if="!semaforos.critGestionarioAdicionado"
                                                > Adicionar Critério Gestionário
                                                </v-btn>
                                            </v-flex>
                                            <v-flex>
                                                <v-btn color="indigo darken-3" dark 
                                                    @click="adicionarCriterioLegalPCA(classe.pca.justificacao, 'CriterioJustificacaoLegal', 'Critério Legal', '', [], classe.legislacao)"
                                                    v-if="!semaforos.critLegalAdicionadoPCA"
                                                > Adicionar Critério Legal
                                                </v-btn>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout row wrap v-for="(crit, cindex) in classe.pca.justificacao" :key="cindex">
                                            <v-flex xs6>
                                                <v-subheader>{{ crit.label }}</v-subheader>
                                            </v-flex>
                                            <v-flex xs6>
                                                <v-btn small color="red darken-2" dark round @click="removerCriterioTodo(classe.pca.justificacao, cindex, 'PCA')">
                                                    <v-icon dark>remove_circle</v-icon>
                                                </v-btn>
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-textarea
                                                    solo
                                                    label="Notas do critério"
                                                    v-model="crit.notas"
                                                    rows="2"
                                                ></v-textarea>
                                            </v-flex>
                                            <hr style="border-top: 2px dotted green; width: 100%;"/>
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                                </v-container>
                                
                            </v-layout>
                            </v-container>

                            <hr style="border: 3px solid green; border-radius: 2px;"/>

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
  const lhost = require('@/config/global').host
  const axios = require('axios')
  const nanoid = require('nanoid')
  import ClassesArvoreLateral from '@/components/classes/ClassesArvoreLateral.vue'
  import DonosOps from '@/components/classes/DonosOps.vue'
  import DonosSelect from '@/components/classes/DonosSelect.vue'
  import ParticipantesOps from '@/components/classes/ParticipantesOps.vue'
  import ParticipantesSelect from '@/components/classes/ParticipantesSelect.vue'
  import ProcessosRelacionadosOps from '@/components/classes/ProcessosRelacionadosOps.vue'
  import ProcessosRelacionadosSelect from '@/components/classes/ProcessosRelacionadosSelect.vue'
  import LegislacaoOps from '@/components/classes/LegislacaoOps.vue'
  import LegislacaoSelect from '@/components/classes/LegislacaoSelect.vue'
  import Subdivisao3Nivel from '@/components/classes/Subdivisao3Nivel.vue'
  
  export default {
    components: { 
        ClassesArvoreLateral, DonosOps, DonosSelect, ParticipantesOps, ParticipantesSelect, 
        ProcessosRelacionadosOps, ProcessosRelacionadosSelect, LegislacaoOps, LegislacaoSelect,
        Subdivisao3Nivel
    },

    
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
        entidadesD: [],
        entidadesP: [],
        listaProcessos: [],
        listaLegislacao:[],

        processoTipos: [
            {label: "Processo Comum", value: "PC"},
            {label: "Processo Específico", value: "PE"}
        ],

        pcaFormasContagem: [],
        pcaSubFormasContagem: [],

        simNao: [
            {label: "Não", value: "N"},
            {label: "Sim", value: "S"}
        ],

        semaforos: {
            paisReady: false,
            classesReady: false,
            entidadesReady: false,
            legislacaoReady: false,
            pcaFormasContagemReady: false,
            pcaSubFormasContagemReady: false,
            critLegalAdicionadoPCA: false,
            critLegalAdicionadoDF: false,
            critGestionarioAdicionado: false,
        },

        textoCriterioGestionario: "Prazo para imputação de responsabilidade pela gestão estratégica, decorrente de" +
                                    " escrutínio público (eleições) ou da não recondução no mandato. Considerou-se para" +
                                    " a definição do prazo o tempo do mandato de maior duração: 5 anos."
    }),

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
            if (this.classe.nivel >= 3 && !this.semaforos.entidadesReady) {
                this.loadEntidades();
            }
            if (this.classe.nivel >= 3 && !this.semaforos.classesReady) {
                this.loadProcessos();
            }
            if (this.classe.nivel >= 3 && !this.semaforos.legislacaoReady) {
                this.loadLegislacao();
            }
            if(this.classe.nivel >= 3){
                this.loadPCA();
            }
        },
        'classe.codigo': function () {
            //this.mensValCodigo = "";

            if (!this.codeFormats[this.classe.nivel].test(this.classe.codigo)) {
                //this.mensValCodigo = "Formato inválido";
            }
            else if(!this.classe.codigo.includes(this.classe.pai.codigo)){
                //this.mensValCodigo = "Não pode alterar o código do pai selecionado em cima...";
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
                var response = await axios.get(lhost + "/api/classes?nivel=" + (this.classe.nivel - 1));
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
        },

        insereNovoTI: function(termos){
            var n = {id: 'ti_' + nanoid(), termo: '', existe: false};
            termos.push(n);
        },

        // Carrega as entidades da BD....................

        loadEntidades: async function () {
            try{
                var response = await axios.get(lhost + "/api/entidades")
                this.entidadesD = response.data
                    .map(function (item) {
                        return {
                            selected: false,
                            id: item.id,
                            sigla: item.sigla,
                            designacao: item.designacao,
                            tipo: "Entidade",
                            intervencao: "Indefinido"
                        }
                    });
                response = await axios.get(lhost + "/api/tipologias")
                this.entidadesD = await this.entidadesD.concat(
                    response.data
                        .map(function (item) {
                            return {
                                selected: false,
                                id: item.id,
                                sigla: item.sigla,
                                designacao: item.designacao,
                                tipo: "Tipologia",
                                intervencao: "Indefinido"
                            }
                        }));
                await this.entidadesD.sort(function (a, b) {
                    return a.sigla.localeCompare(b.sigla);
                });
                        
                this.entidadesP = JSON.parse(JSON.stringify(this.entidadesD));
                this.semaforos.entidadesReady = true;
            }
            catch(erro){
                console.log(erro);
            }
        },

        selectEntidade: function(entidade){
            this.classe.donos.push(entidade);
            // Remove dos selecionáveis
            var index = this.entidadesD.findIndex(e => e.id === entidade.id);
            this.entidadesD.splice(index,1);
        },

        unselectEntidade: function(entidade){
            // Recoloca a entidade nos selecionáveis
            this.entidadesD.push(entidade);
            var index = this.classe.donos.findIndex(e => e.id === entidade.id);
            this.classe.donos.splice(index,1);
        },

        selectParticipante: function( entidade ){
            this.classe.participantes.push(entidade);
        },

        unselectParticipante: function(entidade){
            entidade.intervencao = "Indefinido";
            // Recoloca a entidade nos selecionáveis
            this.entidadesP.push(entidade);
            var index = this.classe.participantes.findIndex(e => e.id === entidade.id);
            this.classe.participantes.splice(index,1);
        },

        selectProcesso: function(proc){
            this.classe.processosRelacionados.push(proc);
            for(var i=0; i < this.classe.subclasses.length; i++){
                this.classe.subclasses[i].processosRelacionados.push(proc);
            }
            this.classe.df.valor = this.calcDF(this.classe.processosRelacionados);
            if(!this.classe.temSubclasses4Nivel){
                // Tratamento do invariante: se é Suplemento Para então cria-se um critério de Utilidade Administrativa
                if(proc.relacao == "eSuplementoPara"){
                    this.adicionarCriterio(this.classe.pca.justificacao, "CriterioJustificacaoUtilidadeAdministrativa", "Critério de Utilidade Administrativa", "", [proc], []);
                }
                // Tratamento do invariante: se é Suplemento De então cria-se um critério Legal com toda a legislação selecionada associada
                else if(proc.relacao == "eSuplementoDe"){
                    this.adicionarCriterio(this.classe.pca.justificacao, "CriterioJustificacaoLegal", "Critério Legal", "", [proc], this.classe.legislacao);
                    this.critLegalAdicionadoPCA = true;
                }
                // Tratamento do invariante: se é Síntese De então cria-se um critério de Densidade Informacional
                else if(proc.relacao == "eSinteseDe"){
                    this.adicionarCriterio(this.classe.df.justificacao, "CriterioJustificacaoDensidadeInfo", "Critério de Densidade Informacional", "", [proc], []);
                }
                // Tratamento do invariante: se é Síntetizado Por então cria-se um critério de Densidade Informacional
                else if(proc.relacao == "eSintetizadoPor"){
                    this.adicionarCriterio(this.classe.df.justificacao, "CriterioJustificacaoDensidadeInfo", "Critério de Densidade Informacional", "", [proc], []);
                }
                // Tratamento do invariante: se é Complementar De então cria-se um critério de Complementaridade Informacional
                else if(proc.relacao == "eComplementarDe"){
                    this.adicionarCriterio(this.classe.df.justificacao, "CriterioJustificacaoComplementaridadeInfo", "Critério de Complementaridade Informacional", "", [proc], []);
                }
            }
            else{
                // Tratamento do invariante: se é Suplemento Para 
                // então cria-se um critério de Utilidade Administrativa para todas as subclasses
                if(proc.relacao == "eSuplementoPara"){
                    for(var i=0; i < this.classe.subclasses.length; i++){
                        this.adicionarCriterio(this.classe.subclasses[i].pca.justificacao, "CriterioJustificacaoUtilidadeAdministrativa", "Critério de Utilidade Administrativa", "", [proc], []);
                    }
                }
                // Tratamento do invariante: se é Suplemento De então 
                // cria-se um critério Legal com toda a legislação selecionada associada para todas as subclasses
                else if(proc.relacao == "eSuplementoDe"){
                    for(var i=0; i < this.classe.subclasses.length; i++){
                        this.adicionarCriterio(this.classe.subclasses[i].pca.justificacao, "CriterioJustificacaoLegal", "Critério Legal", "", [proc], this.classe.legislacao);
                        this.critLegalAdicionadoPCA = true;
                    }    
                }
                // Tratamento do invariante: se é Síntese De então 
                // cria-se um critério de Densidade Informacional para todas as subclasses
                else if(proc.relacao == "eSinteseDe"){
                    for(var i=0; i < this.classe.subclasses.length; i++){
                        this.adicionarCriterio(this.classe.subclasses[i].df.justificacao, "CriterioJustificacaoDensidadeInfo", "Critério de Densidade Informacional", "", [proc], []);
                    } 
                }
                // Tratamento do invariante: se é Síntetizado Por então 
                // cria-se um critério de Densidade Informacional
                else if(proc.relacao == "eSintetizadoPor"){
                    for(var i=0; i < this.classe.subclasses.length; i++){
                        this.adicionarCriterio(this.classe.subclasses[i].df.justificacao, "CriterioJustificacaoDensidadeInfo", "Critério de Densidade Informacional", "", [proc], []);
                    }
                }
                // Tratamento do invariante: se é Complementar De então cria-se um critério de Complementaridade Informacional
                else if(proc.relacao == "eComplementarDe"){
                    for(var i=0; i < this.classe.subclasses.length; i++){
                        this.adicionarCriterio(this.classe.subclasses[i].df.justificacao, "CriterioJustificacaoComplementaridadeInfo", "Critério de Complementaridade Informacional", "", [proc], []);
                    }
                }
                // No fim, recalcula-se o DF para todas as subclasses se a sbdivisão não for DF distinto
                if(!this.classe.temSubclasses4NivelDF){
                    for(var i=0; i < this.classe.subclasses.length; i++){
                        this.classe.subclasses[i].df.valor = this.calcDF(this.classe.subclasses[i].processosRelacionados);
                    }
                } 
            }
            alert(JSON.stringify(this.classe));
        },

        unselectProcesso: function(proc){
            proc.idRel = "Indefinido";
            this.listaProcessos.push(proc);
            var index = this.classe.processosRelacionados.findIndex(p => p.id === proc.id);
            this.classe.processosRelacionados.splice(index,1);
        },

        // Carrega os Processos da BD....................

        loadProcessos: async function () {
            try{
                var response = await axios.get(lhost + "/api/classes?nivel=3");
                this.listaProcessos = response.data
                    .map(function (item) {
                        return {
                            selected: false,
                            id: item.id.split('#')[1],
                            codigo: item.codigo,
                            titulo: item.titulo,
                            idRel: "Indefinido"
                        }
                    })
                    .sort(function (a, b) {
                        return a.codigo.localeCompare(b.codigo);
                    });
                
                this.semaforos.classesReady = true;
            }
            catch(error) {
                    console.error(error);
            };
        },

        // Carrega a legislação da BD....................

        loadLegislacao: async function () {
            try{
                var response = await axios.get(lhost + "/api/legislacao?estado=A");
                this.listaLegislacao = response.data
                    .map(function (item) {
                        return {
                            tipo: item.tipo, 
                            numero: item.numero, 
                            sumario: item.sumario, 
                            data: item.data,
                            selected: false,
                            id: item.id
                        }
                    })
                    .sort(function (a, b) {
                        return -1 * a.data.localeCompare(b.data);
                    });
                this.semaforos.legislacaoReady = true;
            }
            catch(error) {
                console.error(error);
            };
        },

        selectDiploma: function(leg){
            this.classe.legislacao.push(leg);
            // Remove dos selecionáveis
            var index = this.listaLegislacao.findIndex(l => l.id === leg.id);
            this.listaLegislacao.splice(index,1);
        },

        unselectDiploma: function(diploma){
            // Recoloca o diploma nos selecionáveis
            this.listaLegislacao.push(diploma);
            var index = this.classe.legislacao.findIndex(e => e.id === diploma.id);
            this.classe.legislacao.splice(index,1);
        },

        // Carrega a informação contextual relativa ao PCA: formas de contagem, etc....................

        loadPCA: function(){
            this.loadPCAFormasContagem();
            this.loadPCASubFormasContagem();
        },

        // Carrega as possíveis formas de contagem do PCA....................

        loadPCAFormasContagem: async function(){
            try{
                var response = await axios.get(lhost + "/api/vocabularios/vc_pcaFormaContagem");
                this.pcaFormasContagem = this.pcaFormasContagem.concat(
                    response.data.map(function (item) {
                        return {
                            label: item.termo,
                            value: item.idtermo.split('#')[1],
                        }
                    }).sort(function (a, b) {
                        return a.label.localeCompare(b.label);
                    }));
                this.semaforos.pcaFormasContagemReady = true;
            }
            catch(error) {
                console.error(error);
            };
        },

        // Carrega as possíveis subformas de contagem do PCA....................

        loadPCASubFormasContagem: async function(){
            try{
                var response = await axios.get(lhost + "/api/vocabularios/vc_pcaSubformaContagem");
                this.pcaSubFormasContagem = this.pcaSubFormasContagem.concat(
                    response.data.map(function (item) {
                        var formaID = item.termo.substring(item.termo.length - 6)
                        return {
                            label: formaID + ": " + item.desc.substring(0, 70) + "...",
                            value: item.idtermo.split('#')[1],
                        }
                    }).sort(function (a, b) {
                        return a.label.localeCompare(b.label);
                    }));
                this.semaforos.pcaSubFormasContagemReady = true;
            }
            catch(error) {
                console.error(error);
            };
        },

        // Calcula o destino final para o contexto do momento
        calcDF: function(listaProc){
            var res = "NE";

            if(!this.classe.temSubclasses4NivelDF){
                var complementar = listaProc.findIndex(p => p.relacao == 'eComplementarDe');
                if(complementar != -1){
                    res = "C";
                }
                else{
                    var sinteseDe = listaProc.findIndex(p => p.relacao == 'eSinteseDe');
                    if(sinteseDe != -1){
                        res = "C";
                    }
                    else{
                        var sintetizado = listaProc.findIndex(p => p.relacao == 'eSintetizadoPor');
                        if(sintetizado != -1){
                            es = "E";
                        }
                        else{
                            res = "NE";
                        }
                    }
                }
            }
            return res;
        },

        // Adiciona um critério à lista de critérios do PCA ou do DF....................

        adicionarCriterio: function (justificacao, tipo, label, notas, procRel, legislacao) {
            let myProcRel = JSON.parse(JSON.stringify(procRel));
            let myLeg = JSON.parse(JSON.stringify(legislacao));
            
            var indice = justificacao.findIndex(crit => crit.tipo === tipo);
            if(indice == -1){
                justificacao.push({
                    tipo: tipo,
                    label, label,
                    notas: notas,
                    procRel: myProcRel,
                    legislacao: myLeg
                });
            }
            else{
                justificacao[indice].procRel = justificacao[indice].procRel.concat(myProcRel);
                justificacao[indice].legislacao = justificacao[indice].legislacao.concat(myLeg);
            }
            
        },

        adicionarCriterioLegalDF: function (justificacao, tipo, label, notas, procRel, legislacao) {
            this.adicionarCriterio(justificacao, tipo, label, notas, procRel, legislacao);
            this.semaforos.critLegalAdicionadoDF = true;
        },    

        adicionarCriterioLegalPCA: function (justificacao, tipo, label, notas, procRel, legislacao) {
            this.adicionarCriterio(justificacao, tipo, label, notas, procRel, legislacao);
            this.semaforos.critLegalAdicionadoPCA = true;
        },

        adicionarCriterioGestionario: function (justificacao, tipo, label, notas, procRel, legislacao) {
            this.adicionarCriterio(justificacao, tipo, label, notas, procRel, legislacao);
            this.semaforos.critGestionarioAdicionado = true;
        },

        // Remove um critério completo duma vez
        removerCriterioTodo: function(justificacao, i, PCAouDF){
            this.atualizaFlagsCriterios(justificacao[i].tipo, PCAouDF);
            justificacao.splice(i, 1);
        },

        // Atualiza as flags que controlam os botões de adicionar e remover critérios
        atualizaFlagsCriterios(tipo, PCAouDF){
            if(tipo == "CriterioJustificacaoLegal"){
                if(PCAouDF == 'PCA')
                    this.semaforos.critLegalAdicionadoPCA = false;
                else
                    this.semaforos.critLegalAdicionadoDF = false;
            }
            else if(tipo == "CriterioJustificacaoGestionario"){
                this.semaforos.critGestionarioAdicionado = false;
            }
        },
    }
  }
</script>

<style>

</style>
