<template>
  <v-card class="ma-4 pa-2">
    <v-toolbar :color="panelHeaderColor" dark>
      <v-toolbar-title>Notificações</v-toolbar-title>
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
                <p v-if="item.html"><span v-html="item.texto"></span></p>
                <p v-else>{{ item.texto }}</p>
                <div>
                  <v-btn
                    v-for="op in item.ops"
                    color="indigo accent-4"
                    dark
                    class="ma-2"
                    @click="go(op.url)"
                    :key="op.url"
                    >{{ op.label }}</v-btn
                  >
                  <v-btn
                    v-if="
                      [1, 3, 3.5, 4, 5, 6, 7].includes(level) &&
                        item.entidade === 'Entidades'
                    "
                    color="indigo accent-4"
                    dark
                    class="ma-2"
                    @click="extinguirDialog = true"
                  >
                    Extinguir</v-btn
                  >
                </div>
              </v-card-text>
            </v-card>

            <!-- Selecionar Entidade a Extinguir -->
            <v-dialog v-model="extinguirDialog" width="50%">
              <v-card>
                <v-card-title>Selecione a Entidade a extinguir</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col v-if="entidadesReady">
                      <v-autocomplete
                        solo
                        clearable
                        color="indigo darken-4"
                        label="Selecione uma entidade"
                        :items="entidades"
                        v-model="entidadeExtinguir"
                      />
                    </v-col>
                    <v-col v-else style="text-align:center;">
                      <p>A carregar entidades...</p>
                      <v-progress-circular
                        indeterminate
                        size="100"
                        width="10"
                        color="indigo accent-4"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="red darken-4"
                    dark
                    @click="extinguirDialog = false"
                    >Fechar</v-btn
                  >
                  <v-btn
                    color="indigo accent-4"
                    dark
                    class="ma-2"
                    @click="go(`/entidades/extinguir/ent_${entidadeExtinguir}`)"
                    >Extinguir</v-btn
                  >
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

export default {
  props: ["level"],
  methods: {
    go: function(url) {
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    },

    filtraOps: function(operacoes) {
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
            ops: operacoes[i].ops.filter(o => o.level.includes(this.level))
          });
        }
      }
      return filtered;
    },

    preparaEntidades(entidades) {
      this.entidades = entidades.map(entidade => entidade.sigla);
      this.entidadesReady = true;
    }
  },

  async created() {
    let response = await this.$request("get", "/api/entidades?processos=sem");

    this.preparaEntidades(response.data);
  },

  computed: {
    fops: function() {
      return this.filtraOps(this.operacoes);
    }
  },

  data() {
    return {
      extinguirDialog: false,
      entidades: [],
      entidadeExtinguir: null,
      entidadesReady: false,
      panelHeaderColor: "indigo darken-4",
      operacoes: [
        {
          entidade: "Lista Consolidada",
          html: true,
          tooltip:
            "para a classificação e avaliação da informação pública - Catálogo de processos de negócio da AP",
          texto: help.ListaConsolidada,
          ops: [
            {
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
          ops: [
            {
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
              label: "Importar Ficheiro",
              url: "/ts/importar/csv",
              level: [1, 3, 3.5, 4, 5, 6, 7]
            }
          ]
        },
        {
          entidade: "Relatórios de Avaliação de Documentação Acumulada",
          texto: "Texto para os Rada.",
          html: true,
          ops: [
            {
              label: "Criar",
              url: "/rada/criar",
              level: [1, 2, 3, 3.5, 4, 5, 6, 7]
            }
          ]
        },
        {
          entidade: "Autos de Eliminação",
          html: true,
          texto: help.AutosEliminacao,
          ops: [
            {
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
          ops: [
            {
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
          ops: [
            {
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
          ops: [
            {
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
          ops: [
            {
              label: "Consultar",
              url: "/termosIndice",
              level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7]
            } /*,
            {
              label: "Adicionar",
              url: "/termosIndice/criar",
              level: [1, 3, 3.5, 4, 5, 6, 7]
            }*/
          ]
        },
        {
          entidade: "Exportação de Dados",
          texto:
            "Exportar dados das classes, entidades, tipologias, legislação e ontologia.",
          ops: [
            {
              label: "Área de exportação",
              url: "/exportar",
              level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7]
            }
          ]
        },
        {
          entidade: "API de dados",
          texto: help.API,
          ops: [
            {
              label: "Aceder",
              url: "http://clav-api.dglab.gov.pt/docs",
              level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7]
            }
          ]
        }
      ]
    };
  }
};
</script>
