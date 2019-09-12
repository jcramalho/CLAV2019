<template>
  <v-row>
    <v-card>
      <v-toolbar :color="panelHeaderColor" dark>
        <v-toolbar-title>Gestão Administrativa</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-expansion-panels>
        <v-expansion-panel v-for="(item, i) in fops" :key="i">
          <v-expansion-panel-header>{{ item.entidade }}</v-expansion-panel-header>
          <v-expansion-panel-content>
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
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </v-row>
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
          entidade: "Gestão de utilizadores",
          texto: '',
          ops: [
            {
              label: "Consultar utilizadores",
              url: "/users/listagem",
              level: "public"
            }
          ]
        },
        {
          entidade: "Gestão de chaves API",
          texto: '',
          ops: [
            {
              label: "Consultar chaves API",
              url: "/gestao/api/listagem",
              level: "public"
            }
          ]
        },
        {
          entidade: "Métrica plataforma CLAV",
          texto: '',
          ops: [
            {
              label: "Consultar métrica",
              url: "/gestao/metrica",
              level: "public"
            }
          ]
        }
      ]
    };
  }
};
</script>
