<template>
    <v-container grid-list-md fluid>
      <v-layout row wrap justify-center>
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
                            <div class="info-label">Nível:</div>
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
                            <div class="info-label">Classe Pai:</div>
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
                            <div class="info-label">Código:</div>
                        </v-flex>
                        <v-flex xs10>
                            <v-text-field
                                v-model="classe.codigo"
                                label="Código"
                                solo clearable
                            ></v-text-field>
                            <span style="color: red"> {{ mensValCodigo }} </span>
                        </v-flex>
                    </v-layout>
                    <!-- TÍTULO -->
                    <v-layout wrap v-if="(classe.nivel==1)||classe.pai.codigo">
                        <v-flex xs2>
                            <div class="info-label">Título:</div>
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
                        <BlocoDescritivo :c="classe"/>

                        <!-- CONTEXTO DE AVALIAÇÂO DA CLASSE -->
                        <BlocoContexto 
                            :c="classe"
                            :semaforos="semaforos"
                            :donos="entidadesD"
                            :participantes="entidadesP"
                            :procRel="listaProcessos"
                            :legs="listaLegislacao"
                        />

                        <!-- DECISÕES DE AVALIAÇÂO -->
                        <v-expansion-panel-content v-if="classe.nivel == 3">
                            <template v-slot:header>
                                <v-toolbar color="teal darken-4 body-2 font-weight-bold" dark>
                                    <v-toolbar-title>Decisões de Avaliação</v-toolbar-title>
                                </v-toolbar>
                            </template>
                            <!-- HÁ SUBDIVISÃO? -->
                            <Subdivisao3Nivel
                                :c="classe"
                            />

                            <hr style="border: 3px solid green; border-radius: 2px;"/>

                            <!-- DECISÃO SEM SUBDIVISÃO -->
                            <DecisaoSemSubPCA
                                :c="classe"
                                :semaforos="semaforos"
                                :pcaFormasContagem="pcaFormasContagem"
                                :pcaSubFormasContagem="pcaSubFormasContagem"
                            />

                            <hr style="border-top: 3px dashed green; border-radius: 2px;"/>

                            <DecisaoSemSubDF
                                :c="classe"
                                :semaforos="semaforos"
                            />

                        </v-expansion-panel-content>

                        <!-- DECISÃO COM SUBDIVISÃO -->
                        <Subclasses4Nivel
                            :c="classe"
                            :semaforos="semaforos"
                            :pcaFormasContagem="pcaFormasContagem"
                            :pcaSubFormasContagem="pcaSubFormasContagem"
                        />
          
                    </v-expansion-panel>
                </v-container>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs12>
            <div>
                <v-btn dark round color="teal darken-4">Guardar trabalho</v-btn>
                <v-btn dark round color="teal darken-4" @click="criarClasse">Criar classe</v-btn>
                <v-btn dark round color="red darken-4">Cancelar</v-btn>
            </div>
        </v-flex>

        <v-snackbar
            v-model="pedidoCriado"
            :color="'success'"
            :timeout="60000"
                        >
            Pedido para criação da classe criado com sucesso.
            <v-btn dark flat @click="pedidoCriado = false" >
                Fechar
            </v-btn>
        </v-snackbar>

        <v-snackbar
            v-model="loginErrorSnackbar"
            :timeout=8000
            color="error"
            :top="true">
            {{ loginErrorMessage }}
            <v-btn flat @click="loginErrorSnackbar = false">Fechar</v-btn>
        </v-snackbar>
      </v-layout>
      
    </v-container>
</template>

<script>
const lhost = require('@/config/global').host
const axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/json';
const nanoid = require('nanoid')

  import ClassesArvoreLateral from '@/components/classes/ClassesArvoreLateral.vue'
  
  import BlocoDescritivo from '@/components/classes/criacao/BlocoDescritivo.vue'
  import BlocoContexto from '@/components/classes/criacao/BlocoContexto.vue'
  
  import Subdivisao3Nivel from '@/components/classes/criacao/Subdivisao3Nivel.vue'
  import DecisaoSemSubPCA from '@/components/classes/criacao/DecisaoSemSubPCA.vue'
  import DecisaoSemSubDF from '@/components/classes/criacao/DecisaoSemSubDF.vue'
  import Subclasses4Nivel from '@/components/classes/criacao/Subclasses4Nivel.vue'
  
  export default {
    components: { 
        BlocoDescritivo, BlocoContexto,
        ClassesArvoreLateral, 
        Subdivisao3Nivel, DecisaoSemSubPCA, DecisaoSemSubDF, Subclasses4Nivel
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
                notas: "",
                justificacao: []
            },

            // Bloco de subclasses de nível 4, caso haja desdobramento

            subclasses: [],

            user: {
                token: ""
            }
        },

        // Estruturas auxiliares

        codeFormats: {
            1: /^[0-9]{3}$/,
            2: /^[0-9]{3}\.[0-9]{2}$/,
            3: /^[0-9]{3}\.[0-9]{2}\.[0-9]{3}$/,
            4: /^[0-9]{3}\.[0-9]{2}\.[0-9]{3}\.[0-9]{3}$/
        },

        formatoCodigo: {
            1: "ddd (d - digito)",
            2: "ddd.dd (d - digito)",
            3: "ddd.dd.ddd (d - digito)",
            4: "ddd.dd.ddd.dd (d - digito)"
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

        pcaFormasContagem: [],
        pcaSubFormasContagem: [],

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

        pedidoCriado: false,
        loginErrorSnackbar: false,

        loginErrorMessage: "Precisa de fazer login para criar a Classe!",
        mensValCodigo: "",

        textoCriterioUtilidadeAdministrativa: "Prazo decorrente da necessidade de consulta para apuramento da " +
            "responsabilidade em sede de: ",
        textoCriterioComplementaridade: "É complementar de: ",
        textoCriterioDensidadeSinPor: "Informação sintetizada em: ",
        textoCriterioDensidadeSinDe: "Informação pertinente não recuperável noutro PN. Sintetiza a informação de: ",
        textoCriterioLegal: "Prazo prescricional estabelecido em \"diplomas selecionados no contexto de avaliação\": "
        
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
                this.loadPais();
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

        'classe.codigo': async function () {
            try{
                this.mensValCodigo = "";
                if (!this.codeFormats[this.classe.nivel].test(this.classe.codigo)) {
                    this.mensValCodigo = "Formato de código inválido! Deve ser: " + this.formatoCodigo[this.classe.nivel];
                }
                else if(!this.classe.codigo.includes(this.classe.pai.codigo)){
                    this.mensValCodigo = "Não pode alterar o código do pai selecionado em cima...";
                }
                else{
                    var existe = await this.verificaExistenciaCodigo(this.classe.codigo);
                    if(existe){
                        this.mensValCodigo = "Código já existente na base de dados...";
                    }
                } 
            }
            catch(erro){
                console.log(erro)
            }
        },
        
        'classe.temSubclasses4Nivel': function(){
            // Se passou a verdade vamos criar um par de subclasses
            // Informação base:
            if(this.classe.temSubclasses4Nivel){
                var novaSubclasse1 = {
                    nivel: 4,
                    pai: this.classe.codigo,
                    codigo: this.classe.codigo + '.01',
                    titulo: this.classe.titulo + ': ',
                    descricao: null,
                    termosInd: JSON.parse(JSON.stringify(this.classe.termosInd)),

                    // Bloco de contexto de avaliação

                    processosRelacionados: JSON.parse(JSON.stringify(this.classe.processosRelacionados)),
                    legislacao: JSON.parse(JSON.stringify(this.classe.legislacao)),

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
                    }
                };
                var novaSubclasse2 = {
                    nivel: 4,
                    pai: this.classe.codigo,
                    codigo: this.classe.codigo + '.02',
                    titulo: this.classe.titulo + ': ',
                    descricao: "",
                    termosInd: JSON.parse(JSON.stringify(this.classe.termosInd)),
                    
                    // Bloco de contexto de avaliação

                    processosRelacionados: JSON.parse(JSON.stringify(this.classe.processosRelacionados)),
                    legislacao: JSON.parse(JSON.stringify(this.classe.legislacao)),
                    
                    // Bloco de decisão de avaliação: PCA e DF

                    pca: {
                        valor: null,
                        formaContagem: "",
                        subFormaContagem: "",
                        justificacao: []  
                    },                          

                    df: {
                        valor: "NE",
                        notas: null,
                        justificacao: []
                    }
                };

                this.procHeranca(this.classe.processosRelacionados, novaSubclasse1);
                this.procHeranca(this.classe.processosRelacionados, novaSubclasse2);

                this.classe.subclasses.push(novaSubclasse1);
                this.classe.subclasses.push(novaSubclasse2);
            }

            // Se passou a falso vamos eliminar as subclasses

            else{
                for(var j=0; j < this.classe.subclasses.length; j++){
                    this.classe.subclasses[j].processosRelacionados.splice(0, this.classe.subclasses[j].processosRelacionados.length);
                }
                this.classe.subclasses.splice(0, this.classe.subclasses.length);
                this.classe.temSubclasses4NivelPCA = false;
                this.classe.temSubclasses4NivelDF = false;
                // E recalculamos o DF do nível 3
                this.classe.df.valor = this.calcDF(this.classe.processosRelacionados);
            }  
        },
        'classe.temSubclasses4NivelDF': function(){
            if(this.classe.temSubclasses4NivelDF)
                this.calcSinteseDF4Nivel();
        },
        'classe.subdivisao4Nivel01Sintetiza02': function(){
            this.remSintese4Nivel(this.classe.subclasses);
            this.calcSinteseDF4Nivel();
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
                        value: item.id.split('#c')[1],
                    }
                    }).sort(function (a, b) {
                        return a.label.localeCompare(b.label);
                    });
            }
            catch(erro){
                console.log(erro);
            }
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
                            res = "E";
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

        // No ato de um desdobramento em 4ºs níveis, trata a herança das relações

        procHeranca: function (procRel, novaClasse){
            for(var i=0; i < procRel.length; i++){
                // Tratamento do invariante: se é Suplemento Para então cria-se um critério de Utilidade Administrativa
                if(procRel[i].relacao == "eSuplementoPara"){
                    this.adicionarCriterio(novaClasse.pca.justificacao, "CriterioJustificacaoUtilidadeAdministrativa", 
                        "Critério de Utilidade Administrativa", this.textoCriterioUtilidadeAdministrativa, [procRel[i]], []);
                }
                // Tratamento do invariante: se é Suplemento De então cria-se um critério Legal com toda a legislação selecionada associada
                else if(procRel[i].relacao == "eSuplementoDe"){
                    this.adicionarCriterio(novaClasse.pca.justificacao, "CriterioJustificacaoLegal", 
                        "Critério Legal", this.textoCriterioLegal, [procRel[i]], this.classe.legislacao);
                    this.critLegalAdicionadoPCA = true;
                }
                // Tratamento do invariante: se é Síntese De então cria-se um critério de Densidade Informacional
                else if(procRel[i].relacao == "eSinteseDe"){
                    this.adicionarCriterio(novaClasse.df.justificacao, "CriterioJustificacaoDensidadeInfo", 
                        "Critério de Densidade Informacional", this.textoCriterioDensidadeSinDe, [procRel[i]], []);
                }
                // Tratamento do invariante: se é Síntetizado Por então cria-se um critério de Densidade Informacional
                else if(procRel[i].relacao == "eSintetizadoPor"){
                    this.adicionarCriterio(novaClasse.df.justificacao, "CriterioJustificacaoDensidadeInfo", 
                        "Critério de Densidade Informacional", this.textoCriterioDensidadeSinPor, [procRel[i]], []);
                }
                // Tratamento do invariante: se é Complementar De então cria-se um critério de Complementaridade Informacional
                else if(procRel[i].relacao == "eComplementarDe"){
                    this.adicionarCriterio(novaClasse.df.justificacao, "CriterioJustificacaoComplementaridadeInfo", 
                        "Critério de Complementaridade Informacional", this.textoCriterioComplementaridade, [procRel[i]], []);
                }
            }
            if(!this.classe.temSubclasses4NivelDF){
                novaClasse.df.valor = this.calcDF(novaClasse.processosRelacionados);
            } 
        },

        // Quando o desdobramento é por DF distinto cria-se a relação de síntese entre as subclasses
        calcSinteseDF4Nivel: function(){
            if(this.classe.subdivisao4Nivel01Sintetiza02){
                this.classe.subclasses[0].df.valor = 'C';
                this.classe.subclasses[0].processosRelacionados.push(
                    {
                        codigo: this.classe.subclasses[1].codigo,
                        titulo: this.classe.subclasses[1].titulo,
                        relacao: 'eSinteseDe',
                        relLabel: 'é Síntese de'
                    }
                );
                this.classe.subclasses[1].df.valor = 'E';
                this.classe.subclasses[1].processosRelacionados.push(
                    {
                        codigo: this.classe.subclasses[0].codigo,
                        titulo: this.classe.subclasses[0].titulo,
                        relacao: 'eSintetizadoPor',
                        relLabel: 'é Sintetizado por'
                    }
                );
            }
            else{
                this.classe.subclasses[0].df.valor = 'E';
                this.classe.subclasses[0].processosRelacionados.push(
                    {
                        codigo: this.classe.subclasses[1].codigo,
                        titulo: this.classe.subclasses[1].titulo,
                        relacao: 'eSintetizadoPor',
                        relLabel: 'é Sintetizado por'
                    }
                );
                this.classe.subclasses[1].df.valor = 'C';
                this.classe.subclasses[1].processosRelacionados.push(
                    {
                        codigo: this.classe.subclasses[0].codigo,
                        titulo: this.classe.subclasses[0].titulo,
                        relacao: 'eSinteseDe',
                        relLabel: 'é Síntese de'
                    }
                );
            }
        },

        remSintese4Nivel: function(subclasses){
            var index = -1;
            for(var i=0; i < subclasses.length; i++){
                if(subclasses[i].processosRelacionados.length > 0){
                    index = subclasses[i].processosRelacionados.findIndex(p => (p.relacao == 'eSintetizadoPor')||(p.relacao == 'eSinteseDe'));
                    if(index != -1) 
                        subclasses[i].processosRelacionados.splice(index,1);
                }
            }
        },

        // Verifica se o código introduzido pelo utilizador já existe na BD....................

        verificaExistenciaCodigo: async function (codigo) {
            var response = await axios.get(lhost + '/api/classes/verificar/' + codigo);
            return response.data
        },

        // Lança o pedido de criação da classe no worflow

        criarClasse: async function(){
            try{
                if( this.$store.state.user.name === ''){
                    this.loginErrorSnackbar = true;
                }
                else{
                    this.classe.user.token = this.$store.state.user.token;

                    var response = await axios.post(lhost + "/api/classes", this.classe)
                    alert(JSON.stringify(response.data))
                    this.pedidoCriado = true;
                }
            }
            catch(error) {
                    return(error);
            }
        }
    }
  }
</script>

<style>
.info-label {
    color: #00695C;
    padding: 5px; 
    font-weight: 400;
    width: 100%;
    background-color: #E0F2F1;
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
