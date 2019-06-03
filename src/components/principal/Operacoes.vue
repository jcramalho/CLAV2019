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
          entidade: "Lista Consolidada",
          texto:
            "Estrutura de classes da “Lista Consolidada para a classificação e avaliação da informação pública” que atualmente se encontra disponível. Inclui os níveis referentes aos processos de negócio da Administração Pública.",
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
          texto:
            "Lista das Tabelas de seleção conformes à Lista Consolidada que se encontram aprovadas.",
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
          texto:
            "Lista das entidades que estão envolvidas nos processos de negócio da Administração Pública e que foram identificadas até ao momento. Em atualização constante.",
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
          texto:
            "Lista de tipologias de entidades que estão envolvidas nos processos de negócio da Administração Pública e que foram identificadas até ao momento. Em atualização constante.",
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
          texto:
            "Lista da legislação que enquadra os processos de negócio da Administração Pública e que foi identificada até ao momento. Em atualização constante.",
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
          texto:
            "Lista da legislação que enquadra os processos de negócio da Administração Pública e que foi identificada até ao momento. Em atualização constante.",
          ops: [
            {
              label: "Consultar",
              url: "/termosIndice"
            }
          ]
        }
      ]
    };
  }
};
</script>
