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
                            <v-layout row wrap color="teal lighten-5">
                                <v-flex xs2>
                                    <v-subheader>Donos do processo:</v-subheader>
                                </v-flex>
                                <v-flex xs9 v-if="classe.donos.length > 0">
                                    <DonosOps :entidades="classe.donos" @unselectEntidade="unselectEntidade($event)"/>
                                </v-flex>
                                <v-flex xs9 v-else>
                                    <v-alert :value="true" type="warning">
                                        Não tem donos selecionados...
                                    </v-alert>
                                </v-flex>
                            </v-layout>

                            <hr style="border-top: 1px dashed green;"/>

                            <v-layout row wrap>
                                <v-flex xs2>
                                    <v-subheader>Selecione o(s) dono(s) do processo:</v-subheader>
                                </v-flex>
                                <v-flex xs9 v-if="semaforos.entidadesReady">
                                    <v-card>
                                        <v-card-title>
                                            <v-text-field v-model="searchEntidades"
                                                append-icon="search"
                                                label="Procura filtra entidades"
                                                single-line
                                                hide-details
                                            ></v-text-field>
                                        </v-card-title>
                                        <v-data-table
                                            :headers="entidadesHeaders"
                                            :items="entidadesD"
                                            :search="searchEntidades"
                                            item-key="id"
                                            class="elevation-1"
                                    >
                                            <template v-slot:items="props">
                                                <tr @click="selectEntidade(props.item)">
                                                    <td>{{ props.item.sigla }}</td>
                                                    <td> {{ props.item.designacao }} </td>
                                                    <td> {{ props.item.tipo }} </td>
                                                </tr>
                                            </template>

                                            <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                                                A procura por "{{ search }}" não deu resultados.
                                            </v-alert>
                                        </v-data-table>
                                    </v-card>
                                    
                                </v-flex>
                                <v-flex xs9 v-else>
                                    <v-subheader>A carregar entidades...</v-subheader>
                                </v-flex>
                            </v-layout>

                            <hr style="border: 3px solid green; border-radius: 2px;"/>

                            <!-- PARTICIPANTES -->
                            <v-layout row wrap color="teal lighten-5">
                                <v-flex xs2>
                                    <v-subheader>Participantes no processo e respetivas intervenções:</v-subheader>
                                </v-flex>
                                <v-flex xs9 v-if="classe.participantes.length > 0">
                                    <ParticipantesOps :entidades="classe.participantes" @unselectParticipante="unselectParticipante($event)"/>
                                </v-flex>
                                <v-flex xs9 v-else>
                                    <v-alert :value="true" type="warning">
                                        Não tem participantes selecionados...
                                    </v-alert>
                                </v-flex>
                            </v-layout>

                            <hr style="border-top: 1px dashed green;"/>

                            <v-layout row wrap>
                                <v-flex xs2>
                                    <v-subheader>Selecione o(s) participante(s) no processo:</v-subheader>
                                </v-flex>
                                <v-flex xs9 v-if="semaforos.entidadesReady">
                                    <v-card>
                                        <v-card-title>
                                            <v-text-field v-model="searchEntidades"
                                                append-icon="search"
                                                label="Procura filtra entidades"
                                                single-line
                                                hide-details
                                            ></v-text-field>
                                        </v-card-title>
                                        <v-data-table
                                            :headers="participantesHeaders"
                                            :items="entidadesP"
                                            :search="searchEntidades"
                                            item-key="id"
                                            class="elevation-1"
                                            :pagination.sync="paginationParticipantes"
                                        >
                                            <template v-slot:items="props">
                                                <tr>
                                                    <td>
                                                        <v-select
                                                            item-text="label"
                                                            item-value="value"
                                                            v-model="props.item.intervencao"
                                                            :items="tiposIntervencao"
                                                            label="Selecione o tipo de intervenção:"
                                                            solo small-chips
                                                            dense
                                                            @change="selectParticipante(props.item.id)"
                                                        />
                                                    </td>
                                                    <td @click="selectParticipante(props.item.id)">{{ props.item.sigla }}</td>
                                                    <td @click="selectParticipante(props.item.id)"> {{ props.item.designacao }} </td>
                                                    <td @click="selectParticipante(props.item.id)"> {{ props.item.tipo }} </td>
                                                </tr>
                                            </template>

                                            <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                                                A procura por "{{ search }}" não deu resultados.
                                            </v-alert>
                                        </v-data-table>
                                    </v-card>
                                    
                                </v-flex>
                                <v-flex xs9 v-else>
                                    <v-subheader>A carregar entidades e tipologias...</v-subheader>
                                </v-flex>
                            </v-layout>

                            <hr style="border: 3px solid green; border-radius: 2px;"/>

                            <!-- PROCESSOS RELACIONADOS -->
                            <v-layout row wrap color="teal lighten-5">
                                <v-flex xs2>
                                    <v-subheader>Processos Relacionados:</v-subheader>
                                </v-flex>
                                <v-flex xs9 v-if="classe.processosRelacionados.length > 0">
                                    <ParticipantesOps :entidades="classe.participantes" @unselectParticipante="unselectParticipante($event)"/>
                                </v-flex>
                                <v-flex xs9 v-else>
                                    <v-alert :value="true" type="warning">
                                        Não tem processos relacionados...
                                    </v-alert>
                                </v-flex>
                            </v-layout>

                            <hr style="border-top: 1px dashed green;"/>

                            <v-layout row wrap>
                                <v-flex xs2>
                                    <v-subheader>Selecione o(s) processo(s) relacionado(s):</v-subheader>
                                </v-flex>
                                <v-flex xs9 v-if="semaforos.classesReady">
                                    <v-card>
                                        <v-card-title>
                                            <v-text-field v-model="searchProcessos"
                                                append-icon="search"
                                                label="Procura filtra processos"
                                                single-line
                                                hide-details
                                            ></v-text-field>
                                        </v-card-title>
                                        <v-data-table
                                            :headers="participantesHeaders"
                                            :items="listaProcessos"
                                            :search="searchProcessos"
                                            item-key="id"
                                            class="elevation-1"
                                            :pagination.sync="paginationProcessos"
                                        >
                                            <template v-slot:items="props">
                                                <tr>
                                                    <td>
                                                        <v-select
                                                            item-text="label"
                                                            item-value="value"
                                                            v-model="props.item.intervencao"
                                                            :items="tiposIntervencao"
                                                            label="Selecione o tipo de intervenção:"
                                                            solo small-chips
                                                            dense
                                                            @change="selectParticipante(props.item.id)"
                                                        />
                                                    </td>
                                                    <td @click="selectParticipante(props.item.id)">{{ props.item.codigo }}</td>
                                                    <td @click="selectParticipante(props.item.id)"> {{ props.item.titulo }} </td>
                                                </tr>
                                            </template>

                                            <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                                                A procura por "{{ search }}" não deu resultados.
                                            </v-alert>
                                        </v-data-table>
                                    </v-card>
                                    
                                </v-flex>
                                <v-flex xs9 v-else>
                                    <v-subheader>A carregar entidades e tipologias...</v-subheader>
                                </v-flex>
                            </v-layout>

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
  import ParticipantesOps from '@/components/classes/ParticipantesOps.vue'
  
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
        entidadesD: [],
        entidadesP: [],
        listaProcessos: [],

        processoTipos: [
            {label: "Processo Comum", value: "PC"},
            {label: "Processo Específico", value: "PE"}
        ],

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
        },

        searchEntidades: "",
        searchProcessos: "",

        entidadesHeaders: [
            { text: 'Sigla', align: 'left', value: 'sigla'},
            { text: 'Designação', value: 'designacao' },
            { text: 'Tipo', value: 'tipo' }
        ],

        paginationParticipantes: { sortBy: 'sigla'},
        paginationProcessos: { sortBy: 'codigo'},
        
        participantesHeaders: [
            { text: 'Intervenção', align: 'left', value: 'intervencao'},
            { text: 'Sigla', align: 'left', value: 'sigla', sortable: true},
            { text: 'Designação', value: 'designacao' },
            { text: 'Tipo', value: 'tipo' }
        ],

        tiposIntervencao: [
            {label: 'Por selecionar', value: 'Indefinido'},
            {label: 'Apreciar', value: 'Apreciar'},
            {label: 'Assessorar', value: 'Assessorar'},
            {label: 'Comunicar', value: 'Comunicar'},
            {label: 'Decidir', value: 'Decidir'},
            {label: 'Executar', value: 'Executar'},
            {label: 'Iniciar', value: 'Iniciar'}
        ],
        selectedIntervencao: "Indefinido"
    }),

    components: { 
        ClassesArvoreLateral, DonosOps, ParticipantesOps
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
            if (this.classe.nivel >= 3 && !this.semaforos.entidadesReady) {
                this.loadEntidades();
            }
            if (this.classe.nivel >= 3 && !this.semaforos.classesReady) {
                this.loadProcessos();
            }
            if(this.classe.nivel >= 3){
                //this.loadPCA();
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

        selectParticipante: function(id){
            // Remove dos selecionáveis
            var index = this.entidadesP.findIndex(e => e.id === id);
            this.classe.participantes.push(this.entidadesP[index]);
            this.entidadesP.splice(index,1);
        },

        unselectParticipante: function(entidade){
            entidade.intervencao = "Indefinido";
            // Recoloca a entidade nos selecionáveis
            this.entidadesP.push(entidade);
            var index = this.classe.participantes.findIndex(e => e.id === entidade.id);
            this.classe.participantes.splice(index,1);
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
                            relacao: "Indefinido"
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
    }
  }
</script>

<style>

</style>
