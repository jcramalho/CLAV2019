<template>
  <v-card class="ma-4">
    <v-card-title class="indigo darken-4 white--text">
      Permissões de Acesso
    </v-card-title>

    <v-card-text>
      <v-expansion-panels class="pa-4" focusable v-model="panel">
        <v-expansion-panel>
          <v-expansion-panel-header class="font-weight-bold">
            Na Interface
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-data-table
              :items="acessoInterface"
              item-key="nivel"
              :headers="headers"
              hide-default-footer
              single-expand
              show-expand
              class="ma-4 elevation-1"
              :expanded.sync="expandedInt"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <v-data-table
                    :items="item.ops"
                    item-key="path"
                    :headers="headersOpsInterface"
                    class="mt-4 mb-4 elevation-3"
                    :search="search"
                  >
                    <template v-slot:top>
                      <v-toolbar flat class="primary" dark>
                        <v-toolbar-title>Operações</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-text-field
                          v-model="search"
                          append-icon="mdi-magnify"
                          label="Procurar"
                          single-line
                          hide-details
                        ></v-text-field>
                      </v-toolbar>
                    </template>
                  </v-data-table>
                </td>
              </template>
            </v-data-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="font-weight-bold">
            Na API de dados
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-data-table
              :items="acessoAPI"
              item-key="nivel"
              :headers="headers"
              hide-default-footer
              single-expand
              show-expand
              class="ma-4 elevation-1"
              :expanded.sync="expandedAPI"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <v-data-table
                    :items="item.ops"
                    item-key="path"
                    :headers="headersOpsAPI"
                    class="mt-4 mb-4 elevation-3"
                    :search="search"
                  >
                    <template v-slot:top>
                      <v-toolbar flat class="primary" dark>
                        <v-toolbar-title>Operações</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-text-field
                          v-model="search"
                          append-icon="search"
                          label="Procurar"
                          single-line
                          hide-details
                        ></v-text-field>
                      </v-toolbar>
                    </template>
                  </v-data-table>
                </td>
              </template>

              <template v-slot:no-data>
                <v-alert
                  type="error"
                  width="50%"
                  class="m-auto mb-2 mt-2"
                  outlined
                >
                  Não foi possível obter as permissões de acesso da API de dados
                </v-alert>
              </template>
            </v-data-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      acessoAPI: [],
      acessoInterface: [],
      search: "",
      panel: "",
      expandedInt: [],
      expandedAPI: [],
      headers: [
        {
          text: "Nível do Utilizador",
          align: "center",
          value: "nivel"
        },
        {
          text: "Descrição",
          align: "center",
          value: "desc"
        },
        {
          text: "",
          value: "data-table-expand"
        }
      ],
      headersOpsInterface: [
        {
          text: "Caminho",
          align: "left",
          value: "path"
        },
        {
          text: "Descrição",
          align: "left",
          value: "desc"
        }
      ],
      headersOpsAPI: [
        {
          text: "Verbo",
          align: "left",
          value: "verbo"
        },
        {
          text: "Caminho",
          align: "left",
          value: "path"
        },
        {
          text: "Descrição",
          align: "left",
          value: "desc"
        }
      ]
    };
  },
  mounted: async function() {
    //gerar permissoes de acesso para a interface
    let routes = this.$router.options.routes;
    let res = [];

    for (var i = 0; i < routes.length; i++) {
      for (var j = 0; j < routes[i].meta.levels.length; j++) {
        var index = res.findIndex(
          elem => routes[i].meta.levels[j] == elem.nivel
        );

        if (index != -1) {
          res[index].ops.push({
            path: routes[i].path,
            desc: routes[i].name
          });
        } else {
          res.push({
            nivel: routes[i].meta.levels[j],
            desc: this.translateNivel(routes[i].meta.levels[j]),
            ops: [{
              path: routes[i].path,
              desc: routes[i].name
            }]
          });
        }
      }
    }

    this.acessoInterface = res;

    //obter permissoes de acesso da API
    try {
      let response = await this.$request(
        "get",
        "/ficheirosEstaticos?caminho=permissoes_acesso%2Facesso.json"
      );
      this.acessoAPI = response.data;
    } catch (err) {
      this.acessoAPI = [];
    }
  },
  methods: {
    translateNivel(nivel) {
      let ret = "";

      switch (nivel) {
        case 0:
          ret = "Qualquer pessoa";
          break;
        case 1:
          ret = "Representante Entidade";
          break;
        case 2:
          ret = "Utilizador Simples";
          break;
        case 3:
          ret = "Utilizador Arquivo Distrital";
          break;
        case 3.5:
          ret = "Utilizador Avançado";
          break;
        case 4:
          ret = "Utilizador Validador";
          break;
        case 5:
          ret = "Utilizador Decisor";
          break;
        case 6:
          ret = "Administrador de Perfil Funcional";
          break;
        case 7:
          ret = "Administrador de Perfil Tecnológico";
          break;
        default:
          break;
      }

      return ret;
    }
  },
  watch: {
    expandedInt: function(val) {
      this.search = "";
    },
    expandedAPI: function(val) {
      this.search = "";
    },
    panel: function(val) {
      this.expandedInt = [];
      this.expandedAPI = [];
    }
  }
};
</script>
