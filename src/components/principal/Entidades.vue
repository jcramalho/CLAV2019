<template>
    <v-flex xs12 sm5>
        <v-card>
          <v-toolbar :color="panelHeaderColor" dark>
            <v-toolbar-title>Entidades</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-expansion-panel>
              <v-expansion-panel-content
                v-for="(item, i) in operacoes"
                :key="i"
              >
                <template v-slot:header>
                  <div>{{ item.entidade }}</div>
                </template>
                <v-card>
                  <v-card-text>
                    <p>{{ item.texto }}</p>
                    <div>
                      <v-btn
                        color="deep-purple darken-3"
                        dark
                        @click="go(item.cons.url)"
                        :key="item.cons.url"
                      >
                        {{ item.cons.label }}
                      </v-btn>
                      <v-btn
                        color="deep-purple darken-3"
                        dark
                        @click="go(item.criar.url)"
                        :key="item.criar.url"
                        v-if="$store.state.user.name != '' && item.criar"
                      >
                        {{ item.criar.label }}
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
              <v-list two-line>
            <template>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title
                    >Identificação de Representantes</v-list-tile-title
                  >
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>Área de Trabalho</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
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
                    cons: {
                        label: "Consultar",
                        url: "/pedidos"
                    }
                }
            ]
        }
    }
}
</script>
