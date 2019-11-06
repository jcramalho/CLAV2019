<template>
  <v-card class="ma-4 pa-2">
    <v-toolbar :color="panelHeaderColor" dark>
      <v-toolbar-title>Gestão da Plataforma</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel v-for="(item, i) in fops" :key="i">
          <v-expansion-panel-header>{{
            item.entidade
          }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card>
              <v-card-text>
                <p>{{ item.texto }}</p>
                <div>
                  <v-btn
                    v-for="op in item.ops"
                    color="indigo accent-4"
                    dark
                    class="ma-2"
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
          entidade: "Pedidos",
          texto:
            "Pedidos de alteração ou de criação de novas instâncias que deram entrada na plataforma.",
          ops: [
            {
              label: "Consultar",
              url: "/pedidos",
              level: [1, 3, 3.5, 4, 5, 6, 7]
            } /*,
            {
              label: "Criar pedido",
              url: "/pedidos/criar",
              level: [1, 3, 3.5, 4, 5, 6, 7]
            }*/
          ]
        },
        {
          entidade: "Pendentes",
          texto:
            "Trabalhos em curso guardados para mais tarde terem continuidade: criação e alteração de instâncias.",
          ops: [
            {
              label: "Consultar",
              url: "/pendentes",
              level: [1, 3, 3.5, 4, 5, 6, 7]
            }
          ]
        },
        {
          entidade: "Invariantes",
          texto: help.Invariantes,
          ops: [
            {
              label: "Listar Invariantes",
              url: "/invariantes",
              level: [6, 7]
            }
          ]
        },
        {
          entidade: "Utilizadores",
          texto: "",
          ops: [
            {
              label: "Consultar utilizadores",
              url: "/users/listagem",
              level: [5, 6, 7]
            },
            {
              label: "Registo de utilizadores para uma entidade",
              url: "/users/registoParaEntidade",
              level: [5, 6, 7]
            },
            {
              label: "Registo de acesso",
              url: "/users/registoAcesso",
              level: [6, 7]
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
              level: [1, 2, 3, 3.5, 4, 5, 6, 7]
            }
          ]
        },
        {
          entidade: "Métricas da plataforma",
          texto: "",
          ops: [
            {
              label: "Consultar métrica",
              url: "/gestao/metrica",
              level: [6, 7]
            }
          ]
        },
        {
          entidade: "Administração",
          texto: "",
          ops: [
            {
              label: "Área de Administração",
              url: "/gestao/administracao",
              level: [7]
            }
          ]
        }
      ]
    };
  }
};
</script>
