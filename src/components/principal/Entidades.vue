<template>
  <v-flex xs12 sm5>
    <v-card>
      <v-toolbar :color="panelHeaderColor" dark>
        <v-toolbar-title>Entidades</v-toolbar-title>
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
      if (this.$store.state.user.name != "") {
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
          entidade: "Pedidos",
          texto:
            "Pedidos de alteração ou de criação de novas instâncias que deram entrada na plataforma.",
          ops: [
            {
              label: "Consultar",
              url: "/pedidos",
              level: "public"
            },
            {
              label: "Criar pedido",
              url: "/pedidos/criar",
              level: "auth"
            }
          ]
        },
        {
          entidade: "Pendentes",
          texto:
            "Trabalhos em curso guardados para mais tarde terem continuidade: criação e alteração de instâncias.",
          ops: [
            {
              label: "Consultar",
              url: "/pendentes"
            }
          ]
        }
      ]
    };
  }
};
</script>
