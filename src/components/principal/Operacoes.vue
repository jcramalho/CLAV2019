<template>
  <v-flex xs12 sm5>
    <v-card>
      <v-toolbar :color="panelHeaderColor" dark>
        <v-toolbar-title>Operações</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-expansion-panel>
          <v-expansion-panel-content v-for="(item, i) in fops" :key="i">
            <template v-slot:header>
              <div>{{ item.entidade }}</div>
            </template>
            <v-card>
              <v-card-text>
                <p>{{ item.texto }}</p>
                <div>
                  <v-btn
                    v-for="op in item.ops"
                    color="deep-purple darken-3"
                    dark
                    @click="go(op.url)"
                    :key="op.url"
                  >
                    {{ op.label }}
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
const help = require("@/config/help").help;

export default {
  methods: {
    go: function(url) {
      this.$router.push(url);
    },

    filtraOps: function(operacoes) {
      var filtered = [];
      for (var i = 0; i < operacoes.length; i++) {
        filtered.push({
          entidade: operacoes[i].entidade,
          texto: operacoes[i].texto,
          ops: operacoes[i].ops.filter(o => o.level == "public")
        });
      }
      return filtered;
    }
  },

  computed: {
    fops: function() {
      if (this.$store.state.name != "") {
        return this.operacoes;
      } else {
        return this.filtraOps(this.operacoes);
      }
    }
  },

  data() {
    return {
      panelHeaderColor: "indigo accent-4",
      operacoes: [
        {
          entidade: "Lista Consolidada",
          texto: help.ListaConsolidada,
          ops: [
            {
              label: "Consultar",
              url: "/classes",
              level: "public"
            },
            {
              label: "Criar classe",
              url: "/classes/criar",
              level: "auth"
            }
          ]
        },
        {
          entidade: "Tabelas de Seleção",
          texto: help.TabelasSelecao,
          ops: [
            {
              label: "Consultar",
              url: "/ts"
            },
            {
              label: "Criar",
              url: "/ts/criar"
            }
          ]
        },
        {
          entidade: "Entidades",
          texto: help.Entidades,
          ops: [
            {
              label: "Consultar",
              url: "/entidades"
            },
            {
              label: "Adicionar",
              url: "/entidades/criar"
            }
          ]
        },
        {
          entidade: "Tipologias de Entidades",
          texto: help.TipologiasIntro,
          ops: [
            {
              label: "Consultar",
              url: "/tipologias"
            },
            {
              label: "Adicionar",
              url: "/tipologias/criar"
            }
          ]
        },
        {
          entidade: "Legislação",
          texto: help.LegislacaoIntro,
          ops: [
            {
              label: "Consultar",
              url: "/legislacao"
            },
            {
              label: "Adicionar",
              url: "/legislacao/criar"
            }
          ]
        },
        {
          entidade: "Termos de Indice",
          texto: help.TermosIndice,
          ops: [
            {
              label: "Consultar",
              url: "/termosIndice"
            }
          ]
        },
        {
          entidade: "Vocabulários Controlados",
          texto: help.VocabulariosControlados,
          ops: [
            {
              label: "Consultar",
              url: "/vocabularios",
              level: "public"
            }
          ]
        },
        {
          entidade: "Autos Eliminação",
          texto: help.AutosEliminacao,
          ops: [
            {
              label: "Consultar",
              url: "/autosEliminacao",
              level: "public"
            },
            {
              label: "Adicionar",
              url: "/autosEliminacao/criar"
            }
          ]
        }
      ]
    };
  }
};
</script>
