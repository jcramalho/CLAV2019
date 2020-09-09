<template>
<v-container fluid class="pa-0 ma-0" style="max-width:100%">
    <v-row>
        <!-- HEADER -->
        <v-col class="py-0 my-0">
            <v-btn @click="goBack" rounded class="white--text mb-6" :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown
          }" id="default-button">
                <unicon name="arrow-back-icon" width="20" height="20" viewBox="0 0 20.71 37.261" fill="#ffffff" />
                <p class="ml-2">Voltar</p>
            </v-btn>
            <v-card flat style="border-radius: 10px !important;">
                <p class="content-title-1 pt-5" style="color: #4da0d0 !important; text-align: center;  padding-bottom: 0.7rem !important;">

                    <!-- Content -->
                    <v-card-text class="ma-0 pa-0">
                        <v-stepper v-model="etapa" vertical>
                            <!-- Step 1 -->
                            <v-stepper-step :complete="etapa > 1" step="1" editable>
                                Escolha a operação
                            </v-stepper-step>

                            <v-stepper-content step="1">
                                <div class="ma-4">
                                    <v-radio-group v-model="acao" row>
                                        <v-radio label="Editar" value="Alteração"></v-radio>
                                        <v-radio v-if="legislacao.estado === 'Ativo'" label="Revogar" value="Revogação"></v-radio>
                                    </v-radio-group>
                                </div>

                                <v-btn color="primary" @click="etapa = 2">
                                    Continuar
                                </v-btn>
                            </v-stepper-content>

                            <!-- Step 2 -->
                            <v-stepper-step :complete="etapa > 2" step="2">{{
              acao
            }}</v-stepper-step>

                            <v-stepper-content step="2">
                                <div v-if="acao === 'Alteração'">
                                    <v-row>
                                        <v-col cols="2">
                                            <div class="info-label">Sumário</div>
                                        </v-col>
                                        <v-col>
                                            <v-text-field filled clearable color="indigo" single-line v-model="legislacao.sumario" label="Sumário"></v-text-field>
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-col cols="2">
                                            <div class="info-label">Link</div>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="legislacao.link" filled clearable color="indigo" single-line label="Link"></v-text-field>
                                        </v-col>
                                    </v-row>

                                    <!-- Blocos expansivos -->
                                    <v-expansion-panels>
                                        <v-expansion-panel popout focusable>
                                            <v-expansion-panel-header class="expansion-panel-heading">
                                                <div>
                                                    Entidade responsável pela publicação
                                                </div>

                                                <template v-slot:actions>
                                                    <v-icon color="white">expand_more</v-icon>
                                                </template>
                                            </v-expansion-panel-header>
                                            <v-expansion-panel-content>
                                                <DesSelEnt :entidades="entSel" tipo="legislacao" @unselectEntidade="unselectEntidade($event)" />

                                                <hr style="border-top: 1px dashed #dee2f8;" />

                                                <SelEnt :entidadesReady="entidadesReady" :entidades="entidades" @selectEntidade="selectEntidade($event)" />
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>

                                        <!-- Segundo bloco expansivo -->
                                        <v-expansion-panel popout focusable>
                                            <v-expansion-panel-header class="expansion-panel-heading">
                                                <div>
                                                    Processos de negócio que regula ou enquadra
                                                </div>

                                                <template v-slot:actions>
                                                    <v-icon color="white">expand_more</v-icon>
                                                </template>
                                            </v-expansion-panel-header>
                                            <v-expansion-panel-content>
                                                <DesSelProc :processos="procSel" @unselectProcesso="unselectProcesso($event)" />

                                                <hr style="border-top: 1px dashed #dee2f8;" />

                                                <SelProc :processosReady="processosReady" :processos="processos" @selectProcesso="selectProcesso($event)" />
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                </div>

                                <div v-else>
                                    <v-row>
                                        <v-col cols="2">
                                            <div class="info-label">
                                                Data de revogação
                                            </div>
                                        </v-col>
                                        <v-col>
                                            <SelecionarData :d="legislacao.dataRevogacao" :label="'Data: AAAA-MM-DD'" @dataSelecionada="legislacao.dataRevogacao = $event" />
                                        </v-col>
                                    </v-row>
                                </div>
                            </v-stepper-content>
                        </v-stepper>

                        <!-- j  -->
                    </v-card-text>
                    <v-snackbar v-model="snackbar" :timeout="8000" color="error" :top="true">
                        {{ text }}
                        <v-btn text @click="fecharSnackbar">Fechar</v-btn>
                    </v-snackbar>
            </v-card>

            <!-- Painel Operações -->
            <PainelOpsLeg v-if="etapa === 2" :l="legislacao" :original="legislacaoOriginal" :acao="acao" />
        </v-col>
    </v-row>
</template>

<script>
import SelecionarData from "@/components/generic/SelecionarData";
import DesSelEnt from "@/components/generic/selecao/DesSelecionarEntidades.vue";
import SelEnt from "@/components/generic/selecao/SelecionarEntidades.vue";

import DesSelProc from "@/components/generic/selecao/DesSelecionarPNs.vue";
import SelProc from "@/components/generic/selecao/SelecionarPNs.vue";

import PainelOpsLeg from "@/components/legislacao/PainelOperacoesLegislacao";

export default {
    props: ["l"],

    components: {
        DesSelEnt,
        SelEnt,
        DesSelProc,
        SelProc,
        PainelOpsLeg,
        SelecionarData
    },

    data() {
        return {
            etapa: 1,
            legislacao: {
                numero: "",
                sumario: "",
                tipo: "",
                data: "",
                link: "",
                dataRevogacao: "",
                entidadesSel: [],
                processosSel: []
            },
            legislacaoOriginal: {},
            acao: "Alteração",

            tiposDiploma: [],

            // Para o seletor de entidades
            entidades: [],
            entSel: [],
            entidadesReady: false,

            tipoReady: true,

            // Para o seletor de processos
            processos: [],
            procSel: [],
            processosReady: false,

            // para mostrar mensagens de erro
            snackbar: false,
            text: ""
        };
    },

    methods: {
        goBack() {
            this.$router.push("/legislacao");
        },
        // Vai a API buscar todos os tipos de diplomas legislativos
        loadTipoDiploma: async function () {
            try {
                let response = await this.$request(
                    "get",
                    "/vocabularios/vc_tipoDiplomaLegislativo"
                );
                for (let i = 0; i < response.data.length; i++) {
                    this.tiposDiploma[i] = response.data[i].termo;
                }
                this.tiposDiploma.sort();
                this.tipoReady = false;
            } catch (error) {
                return error;
            }
        },

        unselectEntidade: function (entidade) {
            // Recoloca a entidade nos selecionáveis
            this.entidades.push(entidade);
            let index = this.entSel.findIndex(e => e.id === entidade.id);
            this.entSel.splice(index, 1);
            this.legislacao.entidadesSel = this.entSel;
        },

        selectEntidade: function (entidade) {
            this.entSel.push(entidade);
            this.legislacao.entidadesSel = this.entSel;
            // Remove dos selecionáveis
            let index = this.entidades.findIndex(e => e.id === entidade.id);
            this.entidades.splice(index, 1);
        },

        // Vai à API buscar todas as entidades
        loadEntidades: async function () {
            try {
                let response = await this.$request("get", "/entidades");
                this.entidades = response.data.map(item => {
                    return {
                        sigla: item.sigla,
                        designacao: item.designacao,
                        id: item.id
                    };
                });
                this.entidadesReady = true;
            } catch (error) {
                return error;
            }
        },

        unselectProcesso: function (processo) {
            // Recoloca o processo nos selecionáveis
            this.processos.push(processo);
            let index = this.procSel.findIndex(e => e.id === processo.id);
            this.procSel.splice(index, 1);
            this.legislacao.processosSel = this.procSel;
        },

        selectProcesso: function (processo) {
            this.procSel.push(processo);
            this.legislacao.processosSel = this.procSel;
            // Remove dos selecionáveis
            let index = this.processos.findIndex(e => e.id === processo.id);
            this.processos.splice(index, 1);
        },

        // Vai à API buscar todas as classes de nivel 3
        loadClasses: async function () {
            try {
                let response = await this.$request("get", "/classes?nivel=3");
                this.processos = response.data.map(function (item) {
                    return {
                        codigo: item.codigo,
                        titulo: item.titulo,
                        id: item.id.split("#")[1]
                    };
                });
                this.processosReady = true;
            } catch (error) {
                return error;
            }
        },

        // fechar o snackbar em caso de erro
        fecharSnackbar() {
            this.snackbar = false;
        }
    },

    async created() {
        this.legislacao = JSON.parse(JSON.stringify(this.l));
        this.legislacaoOriginal = JSON.parse(JSON.stringify(this.l));

        await this.loadTipoDiploma();
        await this.loadEntidades();
        await this.loadClasses();

        try {
            if (this.legislacao.entidadesSel.length != 0) {
                this.legislacao.entidadesSel.forEach(ent => {
                    this.entSel.push(ent);

                    // Remove dos selecionáveis
                    let index = this.entidades.findIndex(e => {
                        return e.id === ent.id;
                    });
                    this.entidades.splice(index, 1);
                });
            }
        } catch (e) {
            this.text = "Erro ao carregar os dados, por favor tente novamente";
            this.snackbar = true;
        }

        try {
            if (this.legislacao.processosSel.length != 0) {
                this.legislacao.processosSel.forEach(proc => {
                    this.procSel.push(proc);

                    // Remove dos selecionáveis
                    let index = this.processos.findIndex(p => p.id === proc.id);
                    this.processos.splice(index, 1);
                });
            }
        } catch (e) {
            this.text = "Erro ao carregar os dados, por favor tente novamente";
            this.snackbar = true;
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

.separador {
    color: white;
    padding: 5px;
    margin: 5px;
    font-weight: 400;
    width: 100%;
    min-height: 50px;
    background: linear-gradient(to right, #19237e 0%, #0056b6 100%) !important;
    font-size: 14pt;
    font-weight: bold;
    border-radius: 10px 10px 0 0;
}

#expanded-content {
    margin-left: 0.3rem;
    margin-top: -1.1rem;
    border: 1px solid #dee2f8;
    border-radius: 0 0 10px 10px;
    box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.12);
}
</style>
