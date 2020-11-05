<template>
<div>
    <div v-if="infoReady">
        <v-row>
            <v-col>
                <v-radio-group v-model="filtroLabel" row class="mb-2">
                    <v-radio class="mx-auto" label="Todos" @click="
                filtro = '';
                filtroLabel = 'Todos';
              " value="Todos"></v-radio>
                    <v-radio class="mx-auto" label="Comuns" @click="
                filtro = 'Processo Comum';
                filtroLabel = 'Processo Comum';
              " value="Processo Comum"></v-radio>
                    <v-radio class="mx-auto" label="Específicos" @click="
                filtro = 'Processo Específico';
                filtroLabel = 'Processo Específico';
              " value="Processo Específico"></v-radio>
                    <v-radio class="mx-auto" label="Restantes" @click="
                filtro = 'Processo Restante';
                filtroLabel = 'Processo Restante';
              " value="Processo Restante"></v-radio>
                    <v-radio class="mx-auto" label="Pré-Selecionados" @click="
                filtro = 'Pré-Selecionado';
                filtroLabel = 'Pré-Selecionado';
              " value="Pré-Selecionado"></v-radio>
                </v-radio-group>
                <v-divider class="mt-n1 mx-5" style="border: 1px solid rgb(153, 195, 236);"></v-divider>
            </v-col>
        </v-row>

        <v-data-table class="content-table" :items="listaProcessos.procs" :headers="headers" item-key="chave" :footer-props="procsFooterProps" :search="filtro">
            <template v-slot:item="props">
                <tr :style="{
              backgroundColor:
                props.item.dono || props.item.participante != 'NP'
                  ? 'rgba(60, 151, 227, 0.3)'
                  : props.item.preSelected > 0
                  ? 'rgb(255, 215, 64, 0.3)'
                  : 'transparent',
            }">
                    <td>{{ props.item.codigo }}</td>
                    <td>{{ props.item.titulo }}</td>
                    <td>
                        <v-tooltip v-if="props.item.dono" top color="info" open-delay="500">
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" class="ml-5" small icon @click="desselecionaDono(props.item)">
                                    <v-icon dark>{{ donoSelecionado }}</v-icon>
                                </v-btn>
                            </template>
                            <span> Desmarcar como dono</span>
                        </v-tooltip>
                        <v-tooltip v-else top color="info" open-delay="500">
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" class="ml-5" small icon @click="selecionaDono(props.item)">
                                    <v-icon dark>{{ donoDesselecionado }}</v-icon>
                                </v-btn>
                            </template>
                            <span> Marcar como dono</span>
                        </v-tooltip>
                        <!--v-checkbox color="indigo darken-4" v-model="props.item.dono"></v-checkbox-->
                    </td>
                    <td style="padding-right:0 !important;">
                        <v-radio-group v-model="props.item.participante" class="mt-3" row>
                            <v-radio label="Não part." value="NP" class="mb-2"></v-radio>
                            <v-radio color="indigo darken-4" label="Não part." value="NP"></v-radio>
                            <v-radio color="indigo darken-4" v-for="p in participacao" :key="p.idtermo" :label="p.termo.substring(0, 3)" :value="p.termo" @click="selecionaParticipacao(props.item, p.termo)" class="caption mb-2"></v-radio>
                        </v-radio-group>
                    </td>
                    <td style="text-align: center !important;">
                        <v-tooltip top color="info" open-delay="500">
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" small text rounded class="ml-5" @click="editaBlocoDescritivo(props.item)">
                                    <unicon v-if="props.item.descriptionEdited" name="editado-icon" width="25" height="25" viewBox="0 0 20.71 20.727" fill="#2E7D32" />
                                    <unicon v-else name="alterar-icon" width="25" height="25" viewBox="0 0 20.71 20.727" fill="#0D47A1" />
                                </v-btn>
                            </template>
                            <span v-if="props.item.descriptionEdited">
                                Editar processo novamente</span>
                            <span v-else> Editar processo </span>
                        </v-tooltip>
                    </td>
                </tr>
            </template>
            <template v-slot:[`footer.page-text`]="props">
                Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
                {{ props.itemsLength }}
            </template>
            <template v-slot:no-results>
                <v-alert :value="true" color="error" icon="warning" class="font-weight-medium my-3" id="alerta-erro">Não foram encontrados resultados.</v-alert>
            </template>
        </v-data-table>
        <v-divider class="mt-5 mb-3 mx-5" style="border: 1px solid rgb(153, 195, 236);"></v-divider>

        <v-row class="body-2 font-weight-bold primary--text">
            <v-col class="text-center">
                Nº de processos selecionados:
                {{ numProcessosSelecionados }}
            </v-col>
            <v-col class="text-center">
                Nº de processos a selecionar:
                {{ numProcessosPreSelecionados - processosPreSelecionados }}
            </v-col>
        </v-row>

        <EditDescritivo v-if="editaBlocoDescritivoFlag" :p="procSel" @editado="blocoDescritivoEditado($event)" />
    </div>
    <div v-else class="font-weight-bold text-center">
        <p>A preparar a informação dos processos...</p>
    </div>
</div>
</template>

<script>
import EditDescritivo from '@/components/tabSel/criacaoTSPluri/EditDescritivo.vue';
import {
    mdiCheckBoxOutline
} from '@mdi/js';
import {
    mdiCheckboxBlankOutline
} from '@mdi/js';

export default {
    props: ["listaProcs", "listaCodigosEsp", "participante"],
    components: {
        EditDescritivo,
    },

    data: () => ({
        // Processo corrente
        procSel: {},
        // Lista de processos local, para forçar um watcher
        listaProcessos: {},
        // Fecho Transitivo dos processos
        fechoTransitivo: {},
        // Tipos de participação carregados da BD
        participacao: [],
        // Flag de controlo da preparação da informação
        infoReady: false,
        // Número de processos selecionados
        numProcessosSelecionados: 0,
        // Número de processos a selecionar
        numProcessosPreSelecionados: 0,
        // Número de Processos a selecionar selecionados
        processosPreSelecionados: 0,
        // Icons
        donoSelecionado: mdiCheckBoxOutline,
        donoDesselecionado: mdiCheckboxBlankOutline,
        // Ativador do subcomponente que tem a interface de seleção
        selecionaResponsabilidades: false,
        // Ativador do subcomponente que tem a interface de edição do Bloco Descritivo
        editaBlocoDescritivoFlag: false,
        // Filtro da tabela
        filtro: '',
        filtroLabel: 'Todos',
        // Cabeçalho da tabela para selecionar os PNs comuns
        headers: [{
                text: 'Processo',
                value: 'codigo',
                width: '11%',
                class: ['body-2', 'font-weight-bold'],
                filterable: false,
            },
            {
                text: 'Título',
                value: 'titulo',
                width: '30%',
                class: ['body-2', 'font-weight-bold'],
                filterable: false,
            },
            {
                text: 'Tipo',
                value: 'tipoProc',
                width: '0%',
                class: ['body-2', 'font-weight-bold'],
                align: ' d-none',
            },
            {
                text: 'Pré-Selecionado',
                value: 'preSelectedLabel',
                width: '0%',
                class: ['body-2', 'font-weight-bold'],
                align: ' d-none',
            },
            {
                text: 'Dono',
                value: 'dono',
                align: 'right',
                width: '9%',
                class: ['body-2', 'font-weight-bold'],
                filterable: false,
            },
            {
                text: 'Participante',
                value: 'participante',
                class: ['body-2', 'font-weight-bold'],
                filterable: false,
            },
            {
                text: 'Operações',
                width: '15%',
                align: 'right',
                class: ['body-2', 'font-weight-bold'],
                filterable: false,
            },
        ],
        procsFooterProps: {
            'items-per-page-text': 'Processos por página',
            'items-per-page-options': [10, 20, 100, -1],
            'items-per-page-all-text': 'Todos',
        },
    }),

    created: async function () {
        try {
            var response = await this.$request('get', '/travessiaV2');
            this.fechoTransitivo = response.data;
        } catch (e) {
            console.log('Erro ao carregar o fecho transitivo: ' + e);
        }

        try {
            var resPar = await this.$request(
                'get',
                '/vocabularios/vc_processoTipoParticipacao'
            );
            this.participacao = resPar.data;
        } catch (e) {
            console.log('Erro no carregamento dos tipos de participação: ' + e);
        }
        this.listaProcessos = this.listaProcs;
        this.numProcessosSelecionados = this.listaProcs.numProcessosSelecionados;
        this.numProcessosPreSelecionados = this.listaProcs.numProcessosPreSelecionados;
        this.processosPreSelecionados = this.listaProcs.processosPreSelecionados;
        this.infoReady = true;
    },

    methods: {
        selecionaParticipacao: async function (proc, participacao) {
            if (!proc.dono && proc.participante == "NP" && participacao != "NP") {
                this.listaProcs.numProcessosSelecionados++;
                this.numProcessosSelecionados++;
                await this.acrescentaFecho(proc);
                if (proc.preSelected >= 1) {
                    this.processosPreSelecionados++;
                    this.listaProcs.processosPreSelecionados++;
                }
            } else if (
                !proc.dono &&
                proc.participante != "NP" &&
                participacao == "NP"
            ) {
                if (proc.preSelected >= 1) {
                    this.processosPreSelecionados--;
                    this.listaProcs.processosPreSelecionados--;
                }
                this.listaProcs.numProcessosSelecionados--;
                this.numProcessosSelecionados--;
                await this.retiraFecho(proc);
            }
            proc.participante = participacao;
        },

        // Seleciona um processo como dono
        selecionaDono: async function (proc) {
            proc.dono = true;
            // Se ainda não tinha sido selecionado
            if (proc.participante == 'NP') {
                this.listaProcs.numProcessosSelecionados++;
                this.numProcessosSelecionados++;
                await this.acrescentaFecho(proc);
                if (proc.preSelected >= 1) {
                    this.processosPreSelecionados++;
                    this.listaProcs.processosPreSelecionados++;
                }
            }
        },

        // Desseleciona um processo como dono
        desselecionaDono: async function (proc) {
            proc.dono = false;
            // Se vai ficar desselecionado...
            if (proc.participante == 'NP') {
                this.listaProcs.numProcessosSelecionados--;
                this.numProcessosSelecionados--;
                if (proc.preSelected >= 1) {
                    this.processosPreSelecionados--;
                    this.listaProcs.processosPreSelecionados--;
                }
                await this.retiraFecho(proc);
            }
        },

        // Filtra os processos na tabela
        filtraProcessos: function (value, search, item) {
            return item.tipoProc == '';
        },

        acrescentaFecho: function (processo) {
            var fecho = this.fechoTransitivo[processo.codigo];
            for (let i = 0; i < fecho.length; i++) {
                var index = this.listaProcs.procs.findIndex(
                    (p) => p.codigo == fecho[i]
                );
                if (index != -1) {
                    this.listaProcs.procs[index].preSelected++;
                    if (this.listaProcs.procs[index].preSelected == 1) {
                        this.listaProcs.numProcessosPreSelecionados++;
                        this.numProcessosPreSelecionados++;
                        this.listaProcs.procs[index].preSelectedLabel = 'Pré-Selecionado';
                    }
                }
            }
        },
        // Reverte a seleção
        retiraFecho: async function (processo) {
            var fecho = this.fechoTransitivo[processo.codigo];
            for (let i = 0; i < fecho.length; i++) {
                var index = this.listaProcs.procs.findIndex(
                    (p) => p.codigo == fecho[i]
                );
                if (index != -1) {
                    this.listaProcs.procs[index].preSelected--;
                    if (this.listaProcs.procs[index].preSelected == 0) {
                        this.listaProcs.numProcessosPreSelecionados--;
                        this.numProcessosPreSelecionados--;
                        this.listaProcs.procs[index].preSelectedLabel = '';
                    }
                }
            }
        },

        // Edição dos Blocos Descritivos dos processos
        editaBlocoDescritivo: function (p) {
            this.procSel = p;
            this.editaBlocoDescritivoFlag = true;
        },
        // Função de retorno do processo de edição do Bloco Descritivo
        blocoDescritivoEditado: function (p) {
            this.editaBlocoDescritivoFlag = false;
        },

        // Ordena os processos de acordo com a legenda
        ordenaProcs: function (label) {
            if (label === "Todos") this.filtro = "";
            else {
                this.filtro = label;
            }
            this.filtroLabel = label;
        }
    }
};
</script>

<style scoped>
.content-table {
    background-color: #f1f6f8 !important;
    border-radius: 10px;
}

.v-data-table td {
    padding-top: 10px;
    padding-bottom: 10px;
}
</style>
