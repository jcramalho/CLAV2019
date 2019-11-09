<template>
  <v-card class="ma-4 pa-2">
    <v-toolbar :color="panelHeaderColor" dark>
      <v-toolbar-title>Operações</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel v-for="(item, i) in fops" :key="i">
          <v-expansion-panel-header>
            {{
            item.entidade
            }}
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
                  >{{ op.label }}</v-btn>
                </div>
              </v-card-text>
            </v-card>
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
      this.$router.push(url);
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
            html: operacoes[i].html,
            texto: operacoes[i].texto,
            ops: operacoes[i].ops.filter(o => o.level.includes(this.level))
          });
        }
      }
      return filtered;
    }
  },

  computed: {
    fops: function() {
      return this.filtraOps(this.operacoes);
    }
  },

  data() {
    return {
      panelHeaderColor: "indigo darken-4",
      operacoes: [
        {
          entidade: "Lista Consolidada",
          texto: help.ListaConsolidada,
          ops: [
            {
              label: "Consultar",
              url: "/classes",
              level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7]
            },
            {
              label: "Criar classe",
              url: "/classes/criar",
              level: [1, 3, 3.5, 4, 5, 6, 7]
            }
          ]
        },
        {
          entidade: "Tabelas de Seleção",
          html: true,
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
              label: "Importar CSV",
              url: "/ts/importar/csv",
              level: [1, 3, 3.5, 4, 5, 6, 7]
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
            },
            {
              label: "Adicionar",
              url: "/termosIndice/criar",
              level: [1, 3, 3.5, 4, 5, 6, 7]
            }
          ]
        }
      ]
    };
  }
};
</script>
