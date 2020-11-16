<template>
<v-container fluid class="pa-0 ma-0" style="max-width:100%">
    <v-row>
        <!-- HEADER -->
        <v-col class="py-0 my-0">
            <v-btn @click="goBack" rounded class="white--text mb-6" :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown,
          }" id="default-button">
                <unicon name="arrow-back-icon" width="20" height="20" viewBox="0 0 20.71 37.261" fill="#ffffff" />
                <p class="ml-2">Voltar</p>
            </v-btn>
            <v-card flat style="border-radius: 10px !important;">
                <p class="content-title-1 pt-5" style="color: #4da0d0 !important; text-align: center;  padding-bottom: 0.7rem !important;">
                    Nova Tabela de Seleção (continuação do trabalho guardado)
                </p>
                <!-- CONTENT -->
                <v-card-text class="mt-0">
                    <v-stepper v-model="stepNo" id="stepper-card" :class="{
                'mx-8': $vuetify.breakpoint.lgAndUp,
                'mx-0': $vuetify.breakpoint.mdAndDown,
              }" class=" mt-n3 pa-4">
                        <v-stepper-step :complete="stepNo > 1" step="1" :class="{
                  'mt-n12': stepNo > 1,
                }">
                            <font size="3" :class="{
                    'mt-12': stepNo > 1,
                  }" class="font-weight-medium"><b>
                                    Identificação da entidade ou tipologia da tabela de
                                    seleção:</b></font>
                            <span v-if="stepNo > 1 && tipoTS != 'tipologia'" class="mt-1">
                                <v-chip class="my-2 mx-4" id="default-chip" text-color="white">
                                    <unicon name="entidade-icon" width="20" height="20" viewBox="0 0 20.711 21.105" fill="#ffffff" class="mr-3" />
                                    {{
                      tabelaSelecao.idEntidade.split('_')[1] +
                        ': ' +
                        tabelaSelecao.designacaoEntidade
                    }}
                                </v-chip>
                            </span>
                            <span v-else-if="stepNo > 1 && tipoTS == 'tipologia'" class="mt-1">
                                <v-chip class="my-2 mx-4" id="default-chip" text-color="white">
                                    <unicon name="tipologia-ent-icon" width="20" height="20" viewBox="0 0 20.711 22.48" fill="#ffffff" class="mr-3" />
                                    {{
                      tabelaSelecao.idTipologia.split('_')[1] +
                        ': ' +
                        tabelaSelecao.designacaoTipologia
                    }}
                                </v-chip>
                            </span>
                        </v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step :complete="stepNo > 2" step="2" :class="{
                  'mt-n12': stepNo > 1,
                }">
                            <font size="3" :class="{
                    'mt-12': stepNo > 1,
                  }" class="font-weight-medium">
                                Designação da Tabela de Seleção</font>
                            <span v-if="stepNo > 1" class="mt-1">
                                <v-chip class="my-2 mx-4" id="default-chip" text-color="white">
                                    <unicon name="description-icon" width="20" height="20" viewBox="0 0 20.71 23.668" fill="#ffffff" class="mr-3" />
                                    {{ tabelaSelecao.designacao }}
                                </v-chip>
                            </span>
                        </v-stepper-step>
                        <v-stepper-content step="2" class="pt-0" :class="{
                  'mx-8': $vuetify.breakpoint.lgAndUp,
                  'mx-0': $vuetify.breakpoint.mdAndDown,
                }">
                            <v-col :class="{
                    'ma-0 pa-0': $vuetify.breakpoint.mdAndDown,
                  }">
                                <v-form ref="nomeTS" class="px-4">
                                    <span class="subtitle-2 pb-3">Insira a designação para a tabela:</span>
                                    <div class="info-content py-2 pl-6 pr-3 mt-2" style="min-height: 50px;">
                                        <unicon name="description-icon" width="25" height="25" viewBox="0 0 20.71 23.668" fill="#1976d2" class="mr-3" style="white-space: nowrap !important;" />
                                        <v-tooltip top color="info" open-delay="500">
                                            <template v-slot:activator="{ on }">
                                                <v-text-field v-on="on" class="mt-n3" :placeholder="tabelaSelecao.designacao" v-model="tabelaSelecao.designacao" style="display: inline-block; width: 90%; white-space: nowrap !important;"></v-text-field>
                                            </template>
                                            <span> Designação para a tabela de seleção</span>
                                        </v-tooltip>
                                    </div>
                                </v-form>
                            </v-col>
                            <v-btn @click="
                    loadProcEspecificos();
                    validaTSnome();
                  " rounded class="white--text mt-5 ml-4" :class="{
                    'px-6': $vuetify.breakpoint.lgAndUp,
                    'px-2': $vuetify.breakpoint.mdAndDown,
                  }" color="success darken-1" id="botao-shadow">
                                <unicon name="continuar-icon" width="20" height="20" viewBox="0 0 20.71 37.261" fill="#ffffff" />
                                <p class="ml-2">Continuar</p>
                            </v-btn>
                        </v-stepper-content>
                        <v-divider></v-divider>
                        <v-stepper-step :complete="stepNo > 3" step="3">
                            <font size="3"><b> Seleção dos Processos</b></font>
                        </v-stepper-step>
                        <v-stepper-content step="3">
                            <v-col v-if="listaProcessosReady" cols="12" :class="{
                    'px-4': $vuetify.breakpoint.lgAndUp,
                    'ma-0 pa-0': $vuetify.breakpoint.mdAndDown,
                  }">
                                <div class="info-content" style="padding-left: 0 !important; padding-right: 0 !important; min-height: 50px;">
                                    <ListaProcessos :listaProcs="listaProcessos" :listaCodigosEsp="listaCodigosEsp" :participante="participante" />
                                </div>
                            </v-col>

                            <v-col v-else>Ainda não foi possível carregar a informação dos
                                Processos...</v-col>
                            <v-row class="align-center pa-3" style="text-align:center;">
                                <!-- Voltar ao passo anterior ............................................-->
                                <v-col cols="12" md="4" lg="2">
                                    <v-btn v-if="stepNo > 2" @click="stepNo--" rounded class="white--text" :class="{
                        'px-8': $vuetify.breakpoint.lgAndUp,
                        'px-2': $vuetify.breakpoint.mdAndDown,
                      }" style="width: 100%; background-color: rgb(153, 17, 17);" id="botao-shadow">
                                        <unicon name="arrow-back-icon" width="20" height="20" viewBox="0 0 20.71 37.261" fill="#ffffff" />
                                        <p class="ml-2">Retroceder</p>
                                    </v-btn>
                                </v-col>

                                <!-- Guardar o trabalho para continuar depois ..........................-->
                                <v-col cols="12" md="4" lg="2">
                                    <v-btn v-if="stepNo > 2" @click="guardarTrabalho" rounded class="white--text" :class="{
                        'px-8': $vuetify.breakpoint.lgAndUp,
                        'px-2': $vuetify.breakpoint.mdAndDown,
                      }" style="width: 100%;" id="default-button">
                                        <unicon name="guardar-icon" width="20" height="20" viewBox="0 0 20.71 20.71" fill="#ffffff" />
                                        <DialogPendenteGuardado v-if="pendenteGuardado" :pendente="pendente" @continuar="pendenteGuardado = false" />
                                        <p class="ml-2">Guardar Trabalho</p>
                                    </v-btn>
                                </v-col>

                                <!-- Sair da criação da TS sem abortar o processo .........................-->
                                <v-col cols="12" md="4" lg="2">
                                    <v-btn v-if="stepNo > 2" @click="sairOperacao = true" rounded class="white--text" :class="{
                        'px-8': $vuetify.breakpoint.lgAndUp,
                        'px-2': $vuetify.breakpoint.mdAndDown,
                      }" style="width: 100%;" id="default-button">
                                        <unicon name="relogio-icon" width="20" height="20" viewBox="0 0 20.71 20.71" fill="#ffffff" />
                                        <DialogSair v-if="sairOperacao" @continuar="sairOperacao = false" @sair="sair" />
                                        <p class="ml-2">Continuar Depois</p>
                                    </v-btn>
                                </v-col>

                                <!-- Validar a TS ........................................................-->
                                <v-col cols="12" md="4" lg="2">
                                    <v-btn v-if="stepNo > 2" @click="validarTS" rounded class="white--text" :class="{
                        'px-8': $vuetify.breakpoint.lgAndUp,
                        'px-2': $vuetify.breakpoint.mdAndDown,
                      }" style="width: 100%;" id="default-button">
                                        <unicon name="validar-icon" width="20" height="20" viewBox="0 0 20.709 20.696" fill="#ffffff" />
                                        <DialogValidacaoOK v-if="validacaoTerminada && numeroErros == 0" @continuar="fechoValidacao" />
                                        <DialogValidacaoErros v-if="validacaoTerminada && numeroErros > 0" :erros="mensagensErro" @continuar="fechoValidacao" />
                                        <p class="ml-2">Validar</p>
                                    </v-btn>
                                </v-col>

                                <!-- Submeter e criar o pedido ............................................-->
                                <v-col cols="12" md="4" lg="2">
                                    <v-btn v-if="stepNo > 2" @click="submeterTS" color="success darken-1" rounded class="white--text" :class="{
                        'px-8': $vuetify.breakpoint.lgAndUp,
                        'px-2': $vuetify.breakpoint.mdAndDown,
                      }" style="width: 100%;" id="botao-shadow">
                                        <unicon name="adicionar-icon" width="20" height="20" viewBox="0 0 20.71 20.71" fill="#ffffff" />
                                        <p class="ml-2">Submeter</p>
                                    </v-btn>
                                </v-col>

                                <!-- Abortar a criação da TS ..........................................-->
                                <v-col cols="12" md="4" lg="2">
                                    <v-btn @click="eliminarTabela = true" color="red darken-4" rounded class="white--text" :class="{
                        'px-8': $vuetify.breakpoint.lgAndUp,
                        'px-2': $vuetify.breakpoint.mdAndDown,
                      }" style="width: 100%;" id="botao-shadow">
                                        <unicon name="eliminar-icon" width="20" height="20" viewBox="0 0 20.71 20.71" fill="#ffffff" />
                                        <DialogCancelar v-if="eliminarTabela" @continuar="eliminarTabela = false" @sair="abortar" />
                                        <p class="ml-2">Eliminar</p>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-stepper-content>
                    </v-stepper>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import ListaProcessos from '@/components/tabSel/criacaoTSOrg/ListaProcessos.vue';
import DialogPendenteGuardado from '@/components/tabSel/criacaoTSPluri/DialogPendenteGuardado.vue';
import DialogCancelar from '@/components/tabSel/criacaoTSPluri/DialogCancelar.vue';
import DialogValidacaoOK from '@/components/tabSel/criacaoTSPluri/DialogValidacaoOK.vue';
import DialogValidacaoErros from '@/components/tabSel/criacaoTSPluri/DialogValidacaoErros.vue';
import DialogSair from '@/components/tabSel/criacaoTSPluri/DialogSair.vue';

export default {
    props: ['obj'],

    components: {
        ListaProcessos,
        DialogPendenteGuardado,
        DialogCancelar,
        DialogValidacaoOK,
        DialogValidacaoErros,
        DialogSair
    },
    data() {
        return {
            // Objeto da TS
            tabelaSelecao: {
                idEntidade: '',
                designacaoEntidade: '',
                idTipologia: '',
                designacaoTipologia: '',
                designacaoTS: '',
                tipologias: [],
                listaProcessos: {},
            },

            // Fecho Transitivo dos processos
            fechoTransitivo: {},

            // Numero do passo da criação de TS
            // Na continuação não se permite alterar a entidade/tipologia alvo
            stepNo: 2,

            entidadeDGLAB: false,
            entidades: [],
            entidadesReady: false,
            ent: '',
            // Estrutura onde se guarda a entidade do utilizador
            entidadeUtilizador: {},
            // Flag de controlo: indica que a TS é para a entidade do utilizador
            tipoTS: '',
            // Flag de controlo: indica se a TS é para uma tipologia
            tipologiaTS: false,
            // Lista de todas as tipologias existentes
            tipologias: [],
            // True quando a lista de tipologias estiver carregada
            tipologiasReady: false,
            // Tipologia ou tipologias selecionadas
            tipSel: [],
            // Lista com todos os processos
            listaProcessos: {},
            // True quando a lista de todos os processos comuns existentes estiver completa
            listaProcessosReady: false,
            // Lista com os códigos dos processos específicos da entidade selecionada
            listaCodigosEsp: [],
            // Array que determina a seleção de paticipante de cada processo
            participante: [],

            // Tratamento de erros da validação
            mensagensErro: [],
            numeroErros: 0,
            validacaoTerminada: false,
            notasApSet: [],
            exemplosNotasApSet: [],
            termosIndSet: [],

            // Se houver gravações intermédias, há um pendente
            pendente: {},

            // Para o snackbar de pedido criado e trabalho guardado
            pendenteGuardado: false,
            // Dialog de confirmação de eliminação de TS
            eliminarTabela: false,
            // Dialog de confirmação de abandonar a operação
            sairOperacao: false,
        };
    },
    methods: {
        goBack() {
            this.$router.push('/ts/criar');
        },
        debug: function (obj) {
            alert(JSON.stringify(obj));
        },
        validaTSnome: function () {
            if (this.$refs.nomeTS.validate()) {
                this.stepNo = 3;
            }
        },
        // Vai à API buscar todas as entidades
        loadEntidades: async function () {
            try {
                var response = await this.$request('get', '/entidades');
                this.entidades = response.data.map(function (item) {
                    return {
                        sigla: item.sigla,
                        designacao: item.designacao,
                        id: item.id,
                        label: item.sigla + ' - ' + item.designacao,
                    };
                });
                this.entidadesReady = true;
            } catch (err) {
                console.log("Erro ao recuperar a lista de entidades: " + err);
            }
        },

        guardaEntidade: async function () {
            this.tabelaSelecao.designacao =
                "Tabela de Seleção de " + this.ent.designacao;
            this.tabelaSelecao.designacaoEntidade = this.ent.designacao;
            this.tabelaSelecao.idEntidade = 'ent_' + this.ent.sigla;
            try {
                await this.loadTipologias();
            } catch (e) {
                console.log('Erro ao carregar as tipologias: ' + e);
            }
            this.stepNo = this.stepNo + 1;
        },

        guardaTipologia: function () {
            // id e designação
            this.tabelaSelecao.designacao =
                "Tabela de seleção de " + this.tipSel.designacao;
            this.tabelaSelecao.designacaoTipologia = this.tipSel.designacao;
            this.tabelaSelecao.idTipologia = this.tipSel.id;
            this.stepNo = this.stepNo + 1;
        },

        guardaEntidadeUtilizador: function () {
            // id e designação
            this.tabelaSelecao.designacao =
                "Tabela de seleção de " + this.entidadeUtilizador.designacao;
            this.tabelaSelecao.designacaoEntidade = this.entidadeUtilizador.designacao;
            this.tabelaSelecao.idEntidade = this.entidadeUtilizador.id;
            this.stepNo = this.stepNo + 1;
        },

        // Vai à API buscar todas as tipologias a que pertence a entidade do utilizador
        loadTipologiasUtilizador: async function () {
            try {
                // Tipologias onde a entidade se encontra
                var tipologias = await this.$request(
                    'get',
                    '/entidades/' + this.tabelaSelecao.idEntidade + '/tipologias'
                );
                this.tipSel = tipologias.data.map(function (item) {
                    return {
                        sigla: item.sigla,
                        designacao: item.designacao,
                        id: item.id,
                        label: item.sigla + ' - ' + item.designacao,
                    };
                });
            } catch (e) {
                console.log(
                    "Erro ao carregar as tipologias da entidade do utilizador: " + e
                );
            }
        },

        // Vai à API buscar todas as tipologias
        loadTipologias: async function () {
            try {
                var response = await this.$request('get', '/tipologias/');
                this.tipologias = response.data.map(function (item) {
                    return {
                        sigla: item.sigla,
                        designacao: item.designacao,
                        id: item.id,
                        label: item.sigla + ' - ' + item.designacao,
                    };
                });
                this.tipologiasReady = true;
            } catch (e) {
                console.log('Erro ao carregar as tipologias: ' + e);
            }
        },

        // Carrega apenas as tipologias da entidade selecionada
        loadTipologiasDaEntidade: async function () {
            try {
                // Tipologias onde a entidade se encontra
                var tipologias = await this.$request(
                    'get',
                    '/entidades/' + this.tabelaSelecao.idEntidade + '/tipologias'
                );
                this.tipSel = tipologias.data.map(function (item) {
                    return {
                        sigla: item.sigla,
                        designacao: item.designacao,
                        id: item.id,
                        label: item.sigla + ' - ' + item.designacao,
                    };
                });
                // Retira da lista de todas as tipologias as que já pertencem à entidade selecionada
                for (var i = 0; i < this.tipSel.length; i++) {
                    var index = this.tipologias.findIndex(
                        (e) => e.id === this.tipSel[i].id
                    );
                    this.tipologias.splice(index, 1);
                }
            } catch (error) {
                return error;
            }
        },

        // Carregamento dos processos
        loadProcessos: async function () {
            try {
                if (!this.listaProcessosReady) {
                    this.listaProcessos.numProcessosSelecionados = 0;
                    this.listaProcessos.numProcessosPreSelecionados = 0;
                    this.listaProcessos.processosPreSelecionados = 0;
                    this.listaProcessos.procs = [];
                    var response = await this.$request(
                        "get",
                        "/classes?nivel=3&info=completa"
                    );
                    for (let i = 0; i < response.data.length; i++) {
                        this.listaProcessos.procs.push(response.data[i]);
                        this.listaProcessos.procs[i].chave = i;
                        this.listaProcessos.procs[i].edited = false;
                        this.listaProcessos.procs[i].descriptionEMergedited = false;
                        this.listaProcessos.procs[i].preSelected = 0;
                        // Para poder ser filtrado na tabela
                        this.listaProcessos.procs[i].preSelectedLabel = '';
                        this.listaProcessos.procs[i].dono = false;
                        this.listaProcessos.procs[i].participante = "NP";
                    }
                    // this.listaProcessos.procs.sort((a, b) => (a.proc > b.proc ? 1 : -1));
                    this.listaProcessosReady = true;
                }
            } catch (err) {
                console.log('Erro ao carregar os processos: ' + err);
            }
        },

        loadProcessosEspecificos: async function (entidade) {
            try {
                var url = "/classes?nivel=3&tipo=especifico&ents=" + entidade.id;
                var response = await this.$request("get", url);

                for (let j = 0; j < response.data.length; j++) {
                    this.listaCodigosEsp.push(response.data[j].codigo);
                }
                // Marcamos os processos que não são específicos desta entidade como restantes
                var index;
                for (let j = 0; j < this.listaProcessos.procs.length; j++) {
                    if (this.listaProcessos.procs[j].tipoProc != "Processo Comum") {
                        index = this.listaCodigosEsp.indexOf(
                            this.listaProcessos.procs[j].codigo
                        );
                        if (index == -1)
                            this.listaProcessos.procs[j].tipoProc = "Processo Restante";
                    }
                }
            } catch (e) {
                console.log(
                    "Erro ao calcular os processos específicos das entidades: " + e
                );
            }
        },

        // Carrega os processos específicos da entidade e das tipologias em causa
        loadProcEspecificos: async function () {
            try {
                if (!this.listaProcEspReady) {
                    var url =
                        "/classes?nivel=3&tipo=especifico&ents=" +
                        this.tabelaSelecao.idEntidade;
                    if (this.tipSel.length || this.tipSel.length) {
                        url += '&tips=';
                    }
                    if (this.tipSel.length) {
                        for (var i = 0; i < this.tipSel.length - 1; i++) {
                            url += this.tipSel[i].id + ',';
                        }
                        url += this.tipSel[i].id;
                    }
                    var response = await this.$request('get', url);
                    for (var x = 0; x < response.data.length; x++) {
                        if (response.data[x].transversal === 'S') {
                            this.listaProcEsp.push({
                                classe: response.data[x].codigo,
                                designacao: response.data[x].titulo,
                                dono: false,
                                participante: false,
                            });
                        } else {
                            this.listaProcEsp.push({
                                classe: response.data[x].codigo,
                                designacao: response.data[x].titulo,
                                dono: true,
                            });
                        }
                    }
                    this.listaProcEsp.sort((a, b) => (a.classe > b.classe ? 1 : -1));
                    return this.listaProcEsp;
                }
            } catch (error) {
                return error;
            }
        },

        // Lança o pedido de submissão de uma TS
        submeterTS: async function () {
            //Valida se os processos a selecionar estão todos selecionados
            if (
                this.listaProcessos.numProcessosPreSelecionados -
                this.listaProcessos.processosPreSelecionados !=
                0
            ) {
                this.mensagensErro.push({
                    sobre: "Escolha de processos",

                    mensagem: `Ainda tem ${this.listaProcessos
            .numProcessosPreSelecionados -
            this.listaProcessos
              .processosPreSelecionados} processos por selecionar`
                });
                this.numeroErros++;
                this.validacaoTerminada = true;
            } else {
                // É preciso testar se há um Pendente criado para o apagar
                if (this.pendente._id) {
                    try {
                        var response = await this.$request(
                            "delete",
                            "/pendentes/" + this.pendente._id
                        );
                    } catch (e) {
                        console.log("Erro ao remover o pendente na submissão da TS: " + e);
                    }
                }
                try {
                    var userBD = this.$verifyTokenUser();
                    // Guardam-se apenas os processos que foram alterados
                    // Ao carregar será preciso fazer Merge com a LC
                    // É preciso forçar uma cópia para não perder a lista corrente
                    this.tabelaSelecao.listaProcessos = JSON.parse(
                        JSON.stringify(this.listaProcessos)
                    );
                    this.tabelaSelecao.listaProcessos.procs = this.tabelaSelecao.listaProcessos.procs.filter(
                        p => p.dono || p.participante != "NP"
                    );

                    var tsObj = {
                        idEntidade: this.tabelaSelecao.idEntidade,
                        designacaoEntidade: this.tabelaSelecao.designacaoEntidade,
                        designacao: this.tabelaSelecao.designacao,
                        idTipologia: this.tabelaSelecao.idTipologia,
                        designacaoTipologia: this.tabelaSelecao.designacaoTipologia,
                        listaProcessos: this.tabelaSelecao.listaProcessos
                    };

                    var pedidoParams = {
                        tipoPedido: "Criação",
                        tipoObjeto: "TS Organizacional",
                        novoObjeto: {
                            ts: tsObj
                        },
                        user: {
                            email: userBD.email
                        },
                        entidade: userBD.entidade,
                        token: this.$store.state.token,
                        historico: []
                    };

                    var codigoPedido = await this.$request(
                        "post",
                        "/pedidos",
                        pedidoParams
                    );
                    this.$router.push(`/pedidos/submissao/${codigoPedido.data}`);
                } catch (error) {
                    console.log("Erro ao criar o pedido: " + error);
                }
            }
        },
        // Guarda o trabalho de criação de uma TS
        guardarTrabalho: async function () {
            try {
                var userBD = this.$verifyTokenUser();
                // Guardam-se apenas os processos que foram alterados
                // Ao carregar será preciso fazer Merge com a LC
                // É preciso forçar uma cópia para não perder a lista corrente
                this.tabelaSelecao.listaProcessos = JSON.parse(
                    JSON.stringify(this.listaProcessos)
                );
                this.tabelaSelecao.listaProcessos.procs = this.tabelaSelecao.listaProcessos.procs.filter(
                    p => p.dono || p.participante != "NP"
                );

                var pendenteParams = {
                    numInterv: 1,
                    acao: 'Criação',
                    tipo: 'TS Organizacional',
                    objeto: this.tabelaSelecao,
                    criadoPor: userBD.email,
                    user: {
                        email: userBD.email
                    },
                    token: this.$store.state.token,
                };

                // É preciso testar se há um Pendente criado para não criar um novo
                if (this.pendente._id) {
                    pendenteParams._id = this.pendente._id;
                    pendenteParams.numInterv = this.pendente.numInterv++;
                    var response = await this.$request(
                        "put",
                        "/pendentes",
                        pendenteParams
                    );
                } else {
                    pendenteParams.numInterv = 1;
                    var response = await this.$request(
                        "post",
                        "/pendentes",
                        pendenteParams
                    );
                }

                this.pendente = response.data;
                this.pendenteGuardado = true;
            } catch (e) {
                console.log('Erro ao guardar trabalho: ' + e);
            }
        },
        // Elimina todo o trabalho feito até esse momento
        eliminarTS: async function () {
            this.$router.push('/');
        },

        // Valida a TS construída até ao momento
        validarTS: function () {
            if (
                this.listaProcessos.numProcessosPreSelecionados -
                this.listaProcessos.processosPreSelecionados !=
                0
            ) {
                this.mensagensErro.push({
                    sobre: "Escolha de processos",
                    mensagem: `Ainda tem ${this.listaProcessos
            .numProcessosPreSelecionados -
            this.listaProcessos
              .processosPreSelecionados} processos por selecionar`
                });
                this.numeroErros++;
            }
            this.validacaoTerminada = true;
        },

        // Quando a validação termina chama-se esta rotina para fazer reset ao estado da Validação
        fechoValidacao: async function () {
            this.numeroErros = 0;
            this.mensagensErro = [];
            //this.notasApSet = [];
            //this.exemplosNotasApSet = [];
            //this.termosIndSet = [];
            this.validacaoTerminada = false;
        },

        // Abandonar a operação deixando o estado como estiver: se houver pendente não é apagado...
        sair: async function () {
            this.$router.push("/");
        },

        // Abortar a operação apagando o pendente se existir
        abortar: async function () {
            if (this.pendente && this.pendente._id) {
                try {
                    var response = await this.$request(
                        "delete",
                        "/pendentes/" + this.pendente._id
                    );
                } catch (e) {
                    console.log("Erro ao eliminar o pendente: " + e);
                }
            }
            this.$router.push('/');
        },

        // Carrega os fechos transitivos necessários para os que já estão selecionados
        loadFechoTransitivo: async function () {
            try {
                var response = await this.$request("get", "/travessiaV2");
                this.fechoTransitivo = response.data;
            } catch (e) {
                console.log("Erro ao carregar o fecho transitivo: " + e);
            }
        },

        // Faz a pré-seleção do fecho transitivo dos processos já selecionados
        acrescentaFecho: function (processo) {
            var fecho = this.fechoTransitivo[processo.codigo];
            for (let i = 0; i < fecho.length; i++) {
                var index = this.listaProcessos.procs.findIndex(
                    p => p.codigo == fecho[i]
                );
                //Só acrescenta processos a selecionar que não tenham sido selecionados antes de guardar o trabalho
                if (
                    index != -1 &&
                    !this.listaProcessos.procs[index].dono &&
                    this.listaProcessos.procs[index].participante == "NP"
                ) {
                    this.listaProcessos.procs[index].preSelected++;

                    if (this.listaProcessos.procs[index].preSelected == 1) {
                        this.listaProcessos.numProcessosPreSelecionados++;
                        this.listaProcessos.procs[index].preSelectedLabel =
                            "Pré-Selecionado";
                    }
                }
            }
        },

        // Merge do estado antigo dos processos com os que foram carregados da BD
        mergeProcs: async function () {
            // Merge com os processos que já estavam selecionados
            var index;
            for (let i = 0; i < this.tabelaSelecao.listaProcessos.procs.length; i++) {
                index = this.listaProcessos.procs.findIndex(
                    p => p.codigo == this.tabelaSelecao.listaProcessos.procs[i].codigo
                );
                if (index != -1) {
                    this.listaProcessos.procs[
                        index
                    ] = this.tabelaSelecao.listaProcessos.procs[i];
                    this.acrescentaFecho(this.listaProcessos.procs[index]);
                }
            }
            this.listaProcessos.numProcessosSelecionados = this.tabelaSelecao.listaProcessos.numProcessosSelecionados;
            this.listaProcessos.numProcessosPreSelecionados = this.tabelaSelecao.listaProcessos.numProcessosPreSelecionados;
            this.listaProcessos.processosPreSelecionados = this.tabelaSelecao.listaProcessos.processosPreSelecionados;
            this.listaProcessosReady = true;
        }
    },
    created: async function () {
        this.pendente = this.obj;
        this.participante = this.obj.objeto.participante;
        delete this.obj.objeto.participante;
        this.tabelaSelecao = this.obj.objeto;

        try {
            await this.loadProcessos();
            await this.loadFechoTransitivo();
            await this.mergeProcs();
        } catch (e) {
            console.log("Erro no carregamento dinicial: " + e);
        }
    }
};
</script>

<style scoped>
#stepper-card {
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22);
}

.info-label {
    color: #1a237e !important;
    padding: 8px;
    width: 100%;
    background-color: #dee2f8;
    font-weight: bold;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
    border-radius: 6px;
    text-align: center;
}

.info-content {
    padding: 5px;
    width: 100%;
    background-color: #f1f6f8 !important;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
    border-radius: 10px;
}
</style>