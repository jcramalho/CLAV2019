<template>
  <v-card flat class="ma-3 pa-2">
    <p class="clav-content-title-1">Painel de controlo</p>
    <v-row>
      <v-col :cols="notificacoes.length ? '9' : '12'">
        <TogglePanelsCLAV :n="2" @alternar="panelsArr = $event" />
        <Loading v-if="loading" :message="'pedidos'" />
        <v-expansion-panels v-else v-model="panelsArr" multiple>
          <GestaoPedidos :pedidos="pedidos" />
          <ListaPendentes @pendenteSelected="consultaPendente($event)" />
        </v-expansion-panels>
      </v-col>
      <v-col v-if="notificacoes.length" cols="3" align="center" class="pt-0 pl-0">
        <v-card class="fill-height pa-0">
          <v-card-title class="clav-content-title-2 justify-center my-2">
            Notificações
          </v-card-title>
          <v-card-text>
            <v-expansion-panels>
              <v-expansion-panel v-for="(item, i) in notificacoes" :key="i">
                <v-expansion-panel-header
                  hide-actions
                  class="white--text clav-linear-background justify-left"
                >
                  <v-row>
                    <v-col cols="2" align="center">
                      <v-badge inline dot color="error"></v-badge>
                    </v-col>
                    <v-col class="ml-0 pl-0">
                      <p>{{ item.acao }} de {{ item.tipo }} {{ item.objeto }}</p>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="pa-0">
                  <v-row>
                    <v-col align="left">
                      <ul>
                        <li>
                          Movido para <strong>{{ item.novoEstado }}</strong
                          >.
                        </li>
                        <li v-if="item.realizadoPor">
                          Realizado por <strong>{{ item.realizadoPor }}</strong
                          >.
                        </li>
                        <li v-if="item.responsavel">
                          Responsável: <strong>{{ item.responsavel }}</strong>
                        </li>
                        <li>
                          Entidade responsavel:
                          <strong>{{ item.entidade.split("_")[1] }}</strong>
                        </li>
                      </ul>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-icon
                            color="red"
                            @click="removerNotificacao(item._id)"
                            v-on="on"
                          >
                            clear
                          </v-icon>
                        </template>
                        <span>Remover notificação</span>
                      </v-tooltip>
                    </v-col>
                    <v-col>
                      <v-tooltip v-if="item.pedido" bottom>
                        <template v-slot:activator="{ on }">
                          <v-icon
                            @click="$router.push(`/pedidos/novos/${item.pedido}`)"
                            color="indigo darken-2"
                            v-on="on"
                          >
                            visibility
                          </v-icon>
                        </template>
                        <span>Ver pedido...</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import Loading from "@/components/generic/Loading";
import GestaoPedidos from "@/components/users/GestaoPedidos";
import ListaPendentes from "@/components/pendentes/ListaPendentes.vue"; // @ is an alias to /src
import TogglePanelsCLAV from "@/components/generic/TogglePanelsCLAV";

export default {
  components: {
    Loading,
    GestaoPedidos,
    ListaPendentes,
    TogglePanelsCLAV,
  },

  data() {
    return {
      loading: true,
      pedidos: [],
      panelsArr: [0, 1],
      notificacoes: [],
    };
  },

  async created() {
    try {
      let { email } = this.$verifyTokenUser();

      const { data } = await this.$request("get", `/pedidos?criadoPor=${email}`);

      this.pedidos = this.atualizaPedidos(data);

      this.loading = false;
    } catch (e) {
      console.log("e", e);
    }
    this.obterNotificacoes();
  },

  methods: {
    consultaPendente: function (item) {
      this.$router.push("/pendentes/" + item.codigo);
    },
    obterNotificacoes() {
      this.$request("get", "/notificacoes")
        .then((data) => {
          this.notificacoes = data.data;
        })
        .catch((e) => console.log(e));
    },
    removerNotificacao(id) {
      this.$request("delete", "/notificacoes/" + id)
        .then(() => this.obterNotificacoes())
        .catch((e) => console.log(e));
    },
    atualizaPedidos(pedido) {
      return pedido.map((p) => {
        const dados = {};
        dados.codigo = p.codigo;
        dados.tipo = `${p.objeto.tipo} - ${p.objeto.acao}`;
        dados.data = this.converteData(p.data);
        dados.estado = p.estado;

        return dados;
      });
    },

    converteData(data) {
      let novaData = new Date(data);

      let ano = novaData.getFullYear();
      let mes = novaData.getMonth() + 1;
      let dia = novaData.getDate();

      if (dia < 10) {
        dia = "0" + dia;
      }
      if (mes < 10) {
        mes = "0" + mes;
      }

      return `${dia}-${mes}-${ano}`;
    },
  },
};
</script>
