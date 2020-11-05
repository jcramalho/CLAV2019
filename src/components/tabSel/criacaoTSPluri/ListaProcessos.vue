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

        <v-data-table class="content-table" :items="listaProcs.procs" :headers="headers" item-key="chave" :footer-props="procsFooterProps" :search="filtro">
            <template v-slot:item="props">
                <tr :style="{
              backgroundColor: props.item.edited
                ? 'rgba(60, 151, 227, 0.3)'
                : props.item.preSelected > 0
                ? 'rgb(255, 215, 64, 0.3)'
                : 'transparent',
            }">
                    <td>{{ props.item.codigo }}</td>
                    <td>{{ props.item.titulo }}</td>
                    <td style="text-align: center !important;">
                        <unicon v-if="props.item.dono" name="accept-icon" width="20" height="20" viewBox="0 0 20.71 18.204" fill="#606060" class="mr-4" />
                    </td>
                    <td style="text-align: center !important;">
                        <unicon v-if="props.item.participante" name="accept-icon" width="20" height="20" viewBox="0 0 20.71 18.204" fill="#606060" class="mr-4" />
                    </td>
                    <td style="text-align: center !important;">
                        <v-tooltip top color="info" open-delay="500">
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" small class="mr-5" text rounded @click="selecionaParticipacoes(props.item)">
                                    <unicon v-if="props.item.dono || props.item.participante" name="participado-icon" width="25" height="25" viewBox="0 0 20.71 17.678" fill="#2E7D32" />
                                    <unicon v-else name="participacao-icon" width="25" height="25" viewBox="0 0 20.71 18.216" fill="#0D47A1" />
                                </v-btn>
                            </template>
                            <span v-if="props.item.dono || props.item.participante">
                                Editar participação</span>
                            <span v-else> Selecionar participação</span>
                        </v-tooltip>

                        <v-tooltip top color="info" open-delay="500">
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" small text rounded class="mr-5" @click="editaBlocoDescritivo(props.item)">
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
                {{ listaProcs.numProcessosSelecionados }}
            </v-col>
            <v-col class="text-center">
                Nº de processos a selecionar:
                {{ listaProcs.numProcessosPreSelecionados }}
            </v-col>
        </v-row>

        <Selresponsabilidade v-if="selecionaResponsabilidades" :p="procSel" @selecionadas="selectProc($event)" @cancelada="selecaoCancelada" />

        <EditDescritivo v-if="editaBlocoDescritivoFlag" :p="procSel" @editado="blocoDescritivoEditado($event)" />
    </div>
    <div v-else class="font-weight-bold text-center">
        <p>A preparar a informação dos processos...</p>
    </div>
</div>
</template>

<script>
import Selresponsabilidade from '@/components/tabSel/criacaoTSPluri/SelResponsabilidade.vue';
import EditDescritivo from '@/components/tabSel/criacaoTSPluri/EditDescritivo.vue';

export default {
    props: ['listaProcs', 'listaCodigosEsp'],
    components: {
        Selresponsabilidade,
        EditDescritivo,
    },

    data: () => ({
        // Processo corrente
        procSel: {},
        // Fecho Transitivo dos processos
        fechoTransitivo: {},
        // Flag de controlo da preparação da informação
        infoReady: false,
        // Ativador do subcomponente que tem a interface de seleção
        selecionaResponsabilidades: false,
        // Ativador do subcomponente que tem a interface de edição do Bloco Descritivo
        editaBlocoDescritivoFlag: false,
        // Filtro da tabela
        filtro: "",
        filtroLabel: "Todos",
        //Conta o número de processos a selecionar selecionados
        processosPreSelecionados: 0,
        // Cabeçalho da tabela para selecionar os PNs comuns
        headers: [{
                text: 'Processo',
                value: 'codigo',
                width: '15%',
                class: ['body-2', 'font-weight-bold'],
                filterable: false,
            },
            {
                text: 'Título',
                value: 'titulo',
                width: '45%',
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
                width: '10%',
                align: 'center',
                class: ['body-2', 'font-weight-bold'],
                filterable: false,
            },
            {
                text: 'Partic.',
                value: 'participante',
                width: '10%',
                align: 'center',
                class: ['body-2', 'font-weight-bold'],
                filterable: false,
            },
            {
                text: 'Operações',
                align: 'center',
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
        this.infoReady = true;
        this.processosPreSelecionados =
            this.listaProcs.numProcessosPreSelecionados -
            this.listaProcs.processosPreSelecionados;
    },

    methods: {
        // Ordena os processos de acordo com a legenda
        ordenaProcs: function (label) {
            if (label === "Todos") this.filtro = "";
            else {
                this.filtro = label;
            }
            this.filtroLabel = label;
        },

        // Filtra os processos na tabela
        filtraProcessos: function (value, search, item) {
            return item.tipoProc == '';
        },

        // Seleção das participações
        selecionaParticipacoes: function (proc) {
            this.procSel = proc;
            this.selecionaResponsabilidades = true;
        },

        // Função de retorno do processo de seleção
        selecaoCancelada: function () {
            this.selecionaResponsabilidades = false;
        },

        // Função de retorno do processo de seleção
        selectProc: async function (p) {
            try {
                this.selecionaResponsabilidades = false;
                this.listaProcs.numProcessosSelecionados += p.inc;
                if (p.inc > 0) {
                    // foi selecionado
                    await this.acrescentaFecho(p);
                    if (p.preSelected >= 1) {
                        this.listaProcs.processosPreSelecionados++;
                    }
                    this.processosPreSelecionados =
                        this.listaProcs.numProcessosPreSelecionados -
                        this.listaProcs.processosPreSelecionados;
                } else if (p.inc < 0) {
                    if (p.preSelected >= 1) {
                        this.listaProcs.processosPreSelecionados--;
                    }
                    await this.retiraFecho(p);
                    this.processosPreSelecionados =
                        this.listaProcs.numProcessosPreSelecionados -
                        this.listaProcs.processosPreSelecionados;
                }
            } catch (err) {
                return err;
            }
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
    },
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
