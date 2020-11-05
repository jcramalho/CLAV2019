<template>
<v-card class="ma-4 pa-2">
    <v-toolbar :color="panelHeaderColor" dark>
        <v-toolbar-title>Operações</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
        <v-expansion-panels>
            <v-expansion-panel v-for="(item, i) in fops" :key="i">
                <v-expansion-panel-header v-if="item.tooltip">
                    <v-tooltip right>
                        <template v-slot:activator="{ on }">
                            <span v-on="on">{{ item.entidade }}</span>
                        </template>
                        <span>{{ item.tooltip }}</span>
                    </v-tooltip>
                </v-expansion-panel-header>
                <v-expansion-panel-header v-else>
                    {{ item.entidade }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-card>
                        <v-card-text>
                            <div>
                                <v-btn v-for="op in item.ops" color="indigo accent-4" dark class="ma-2" @click="go(op.url)" :key="op.url">{{ op.label }}</v-btn>
                                <v-btn v-if="
                      [1, 3, 3.5, 4, 5, 6, 7].includes(level) &&
                        item.entidade === 'Entidades'
                    " color="indigo accent-4" dark class="ma-2" @click="entidadesDialog = true">
                                    Editar
                                </v-btn>

                                <v-btn v-if="
                      [1, 3, 3.5, 4, 5, 6, 7].includes(level) &&
                        item.entidade === 'Legislação'
                    " color="indigo accent-4" dark class="ma-2" @click="legislacaoDialog = true">
                                    Editar</v-btn>

                                <v-btn v-if="
                      [1, 3, 3.5, 4, 5, 6, 7].includes(level) &&
                        item.entidade === 'Tipologias de Entidades'
                    " color="indigo accent-4" dark class="ma-2" @click="tipologiasDialog = true">
                                    Editar</v-btn>
                            </div>
                            <div class="mt-2">
                                <p v-if="item.html"><span v-html="item.texto"></span></p>
                                <p v-else>{{ item.texto }}</p>
                            </div>
                        </v-card-text>
                    </v-card>

                    <!-- Selecionar Entidade a Editar-->
                    <v-dialog v-model="entidadesDialog" width="60%">
                        <v-card>
                            <v-card-title class="expansion-panel-heading">SELECIONE A ENTIDADE</v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col v-if="entidades.ready">
                                        <v-autocomplete clearable color="indigo darken-4" label="SELECIONE A ENTIDADE" :items="entidades.entidades" v-model="dadosEditar">
                                            <template v-slot:no-data>
                                                <v-alert type="info" width="80%" class="m-auto" outlined>
                                                    Sem entidades a mostrar...
                                                </v-alert>
                                            </template>
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col v-else style="text-align: center;">
                                        <p>A carregar entidades...</p>
                                        <v-progress-circular indeterminate size="100" width="10" color="indigo accent-4" />
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer />
                                <v-btn color="red darken-4" dark @click="
                      entidadesDialog = false;
                      dadosEditar = null;
                    ">Fechar</v-btn>
                                <v-btn color="indigo accent-4" dark class="ma-2" @click="editar('Entidade')">Editar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <!-- Selecionar Legislação a Editar-->
                    <v-dialog v-model="legislacaoDialog" width="90%">
                        <v-card>
                            <v-card-title class="expansion-panel-heading">SELECIONE A LEGISLAÇÃO</v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col v-if="legislacao.ready">
                                        <v-autocomplete clearable color="indigo darken-4" label="SELECIONE A LEGISLAÇÃO" :items="legislacao.legislacaoItems" v-model="dadosEditar">
                                            <template v-slot:no-data>
                                                <v-alert type="info" width="80%" class="m-auto" outlined>
                                                    Sem legislação a mostrar...
                                                </v-alert>
                                            </template>
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col v-else style="text-align: center;">
                                        <p>A carregar legislações...</p>
                                        <v-progress-circular indeterminate size="100" width="10" color="indigo accent-4" />
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer />
                                <v-btn color="red darken-4" dark @click="
                      legislacaoDialog = false;
                      dadosEditar = null;
                    ">Fechar</v-btn>
                                <v-btn color="indigo accent-4" dark class="ma-2" @click="editar('Legislação')">Editar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <!-- Selecionar Tipologia a Editar-->
                    <v-dialog v-model="tipologiasDialog" width="50%">
                        <v-card>
                            <v-card-title class="expansion-panel-heading">SELECIONE A TIPOLOGIA DE ENTIDADE</v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col v-if="tipologias.ready">
                                        <v-autocomplete clearable color="indigo darken-4" label="SELECIONE A TIPOLOGIA DE ENTIDADE" :items="tipologias.tipologias" v-model="dadosEditar">
                                            <template v-slot:no-data>
                                                <v-alert type="info" width="80%" class="m-auto" outlined>
                                                    Sem tipologias a mostrar...
                                                </v-alert>
                                            </template>
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col v-else style="text-align: center;">
                                        <p>A carregar tipologias...</p>
                                        <v-progress-circular indeterminate size="100" width="10" color="indigo accent-4" />
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer />
                                <v-btn color="red darken-4" dark @click="
                      tipologiasDialog = false;
                      dadosEditar = null;
                    ">Fechar</v-btn>
                                <v-btn color="indigo accent-4" dark class="ma-2" @click="editar('Tipologia')">Editar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-card-text>
</v-card>
</template>

<script>
const help = require("@/config/help").help;
const lhost = require("@/config/global").host;

export default {
    props: ["level"],
    methods: {
        go: function (url) {
            if (url.startsWith("http")) {
                window.location.href = url;
            } else {
                this.$router.push(url);
            }
        },

        editar(tipo) {
            let leg = null;
            if (tipo === "Legislação") {
                leg = this.legislacao.legislacao.find(
                    legislacao => legislacao.numero === this.dadosEditar.split(" ")[0]
                );
            }

            switch (tipo) {
                case "Entidade":
                    this.go(`/entidades/editar/ent_${this.dadosEditar.split(" ")[0]}`);
                    break;

                case "Legislação":
                    this.go(`/legislacao/editar/${leg.id}`);
                    break;

                case "Tipologia":
                    this.go(`/tipologias/editar/tip_${this.dadosEditar.split(" ")[0]}`);
                    break;

                default:
                    break;
            }
        },

        filtraOps: function (operacoes) {
            var filtered = [];
            for (var i = 0; i < operacoes.length; i++) {
                var levelsSet = new Set();
                operacoes[i].ops.forEach(b => b.level.forEach(l => levelsSet.add(l)));
                var levels = Array.from(levelsSet);

                if (levels.includes(this.level)) {
                    filtered.push({
                        entidade: operacoes[i].entidade,
                        tooltip: operacoes[i].tooltip,
                        html: operacoes[i].html,
                        texto: operacoes[i].texto,
                        ops: operacoes[i].ops.filter(o => o.level.includes(this.level)),
                    });
                }
            }
            return filtered;
        },

        preparaEntidades(dados, entOuTip) {
            let dadosTratados = dados.filter(dado => dado.estado === "Ativa");
            dadosTratados = dadosTratados.map(
                dado => `${dado.sigla} - ${dado.designacao}`
            );

            if (entOuTip === "Entidades") {
                this.entidades.entidades = dadosTratados;
                this.entidades.ready = true;
            } else {
                this.tipologias.tipologias = dadosTratados;
                this.tipologias.ready = true;
            }
        },

        preparaLegislacoes(legislacoes) {
            this.legislacao.legislacao = JSON.parse(JSON.stringify(legislacoes));
            let dadosTratados = legislacoes.filter(leg => leg.estado === "Ativo");

            dadosTratados = dadosTratados.map(
                legislacao =>
                `${legislacao.numero} - ${legislacao.sumario} - ${legislacao.tipo}`
            );

            this.legislacao.legislacaoItems = dadosTratados;
            this.legislacao.ready = true;
        }
    },

    async created() {
        let responseEntidades = await this.$request(
            "get",
            "/entidades?processos=sem"
        );

        let responseLegislacoes = await this.$request("get", "/legislacao");

        let responseTipologias = await this.$request("get", "/tipologias");

        this.preparaEntidades(responseEntidades.data, "Entidades");
        this.preparaLegislacoes(responseLegislacoes.data);
        this.preparaEntidades(responseTipologias.data, "Tipologias");
    },

    computed: {
        fops: function () {
            return this.filtraOps(this.operacoes);
        }
    },

    data() {
        return {
            entidadesDialog: false,
            legislacaoDialog: false,
            tipologiasDialog: false,
            tipologias: {
                tipologias: [],
                ready: false
            },
            entidades: {
                entidades: [],
                ready: false
            },
            legislacao: {
                legislacao: [],
                legislacaoItems: [],
                ready: false
            },
            dadosEditar: null,
            panelHeaderColor: "indigo darken-4",
            operacoes: [{
                    entidade: "Lista Consolidada",
                    html: true,
                    tooltip: "para a classificação e avaliação da informação pública - Catálogo de processos de negócio da AP",
                    texto: help.ListaConsolidada,
                    ops: [{
                            label: "Consultar",
                            url: "/classes",
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7]
                        },
                        {
                            label: "Criar Classe",
                            url: "/classes/criar",
                            level: [1, 3, 3.5, 4, 5, 6, 7]
                        },
                        {
                            label: "Alterar Classe",
                            url: "/classes/editar",
                            level: [1, 3, 3.5, 4, 5, 6, 7]
                        }
                    ]
                },
                {
                    entidade: "Tabelas de Seleção",
                    html: true,
                    tooltip: "para a classificação e avaliação da informação",
                    texto: help.TabelasSelecao,
                    ops: [{
                            label: "Consultar",
                            url: "/ts",
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7]
                        },
                        {
                            label: "Criar",
                            url: "/ts/criar",
                            level: [1, 3, 3.5, 4, 5, 6, 7]
                        },
                        {
                            label: "Importar",
                            url: "/ts/importar/csv",
                            level: [1, 3, 3.5, 4, 5, 6, 7]
                        }
                    ]
                },
                /*{
                  entidade: "Portaria de Gestão de Documentos",
                  html: true,
                  texto: "Texto para as PGD",
                  ops: [
                    {
                      label: "Consultar",
                      url: "/pgd",
                      level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                    }
                  ]
                },*/
                {
                    entidade: "Relatórios de Avaliação de Documentação Acumulada",
                    texto: help.RADA,
                    html: true,
                    ops: [{
                            label: "Consultar",
                            url: "/rada",
                            level: [1, 3, 3.5, 4, 5, 6, 7],
                        },
                        {
                            label: "Criar",
                            url: "/rada/criar",
                            level: [1, 3, 3.5, 4, 5, 6, 7],
                        },
                    ],
                },
                {
                    entidade: "Autos de Eliminação",
                    html: true,
                    texto: help.AutosEliminacao,
                    ops: [{
                            label: "Consultar",
                            url: "/autosEliminacao",
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7]
                        },
                        {
                            label: "Criar",
                            url: "/autosEliminacao/criar",
                            level: [1, 3, 3.5, 4, 5, 6, 7]
                        },
                        {
                            label: "Importar",
                            url: "/autosEliminacao/importar",
                            level: [1, 3, 3.5, 4, 5, 6, 7]
                        }
                    ]
                },
                {
                    entidade: "Entidades",
                    texto: help.Entidades,
                    ops: [{
                            label: "Consultar",
                            url: "/entidades",
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7]
                        },
                        {
                            label: "Adicionar",
                            url: "/entidades/criar",
                            level: [1, 3, 3.5, 4, 5, 6, 7]
                        }
                    ]
                },
                {
                    entidade: "Tipologias de Entidades",
                    texto: help.TipologiasIntro,
                    ops: [{
                            label: "Consultar",
                            url: "/tipologias",
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7]
                        },
                        {
                            label: "Adicionar",
                            url: "/tipologias/criar",
                            level: [1, 3, 3.5, 4, 5, 6, 7]
                        }
                    ]
                },
                {
                    entidade: "Legislação",
                    texto: help.LegislacaoIntro,
                    ops: [{
                            label: "Consultar",
                            url: "/legislacao",
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7]
                        },
                        {
                            label: "Adicionar",
                            url: "/legislacao/criar",
                            level: [1, 3, 3.5, 4, 5, 6, 7]
                        }
                    ]
                },
                {
                    entidade: "Termos de Indice",
                    texto: help.TermosIndice,
                    ops: [{
                            label: "Consultar",
                            url: "/termosIndice",
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7]
                        }
                        /*,
                                   {
                                     label: "Adicionar",
                                     url: "/termosIndice/criar",
                                     level: [1, 3, 3.5, 4, 5, 6, 7]
                                   }*/
                    ]
                },
                {
                    entidade: "Exportação de Dados",
                    texto: "Exportar dados das classes, entidades, tipologias, legislação e ontologia.",
                    ops: [{
                        label: "Área de exportação",
                        url: "/exportar",
                        level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7]
                    }]
                },
                {
                    entidade: "API de dados",
                    texto: help.API,
                    ops: [{
                        label: "Aceder",
                        url: lhost + "/docs",
                        level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                    }, ],
                },
                {
                    entidade: "Permissões de Acesso",
                    texto: help.PermissoesAcesso,
                    ops: [{
                        label: "Consultar",
                        url: "/permissoesAcesso",
                        level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                    }, ],
                },
                {
                    entidade: "Colaborações",
                    texto: "As colaborações são constituídas por um grupo de pessoas que participaram no desenvolvimento da plataforma.",
                    ops: [{
                            label: "Consultar",
                            url: "/colaboracoes",
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                        },
                        {
                            label: "Adicionar",
                            url: "/colaboracoes/criar",
                            level: [3.5, 4, 5, 6, 7],
                        },
                    ],
                },
            ],
        };
    }
};
</script>

<style scoped>
.expansion-panel-heading {
    background-color: #283593 !important;
    color: #fff;
    font-size: large;
    font-weight: bold;
}
</style>
