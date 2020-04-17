<template>
  <div>
    <v-row>
      <v-col cols="2">
        <div class="info-label">Entidade Responsável:</div>
      </v-col>
      <v-col class="mt-3" v-if="p.objeto.dados.ae.entidade">{{ p.objeto.dados.ae.entidade }}</v-col>
      <v-col class="mt-3" v-else>{{ p.entidade }}</v-col>
    </v-row>
    <v-row>
      <v-col cols="2">
        <div class="info-label">Fonte de Legitimação:</div>
      </v-col>
      <v-col class="mt-3">{{ p.objeto.dados.ae.legislacao }}</v-col>
    </v-row>
    <v-row>
      <v-col cols="2">
        <div class="info-label">Fundo:</div>
      </v-col>
      <v-col class="mt-3">
        <li v-for="(f,i) in p.objeto.dados.ae.fundo" :key="i">{{f}}</li>
      </v-col>
    </v-row>

    <v-expansion-panels popout>
      <v-expansion-panel class="ma-1">
        <v-expansion-panel-header class="pa-2 indigo darken-4 title white--text">Classes</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list>
            <v-list-group
              v-for="item in p.objeto.dados.ae.zonaControlo"
              :key="item.codigo"
              color="grey darken-1"
              no-action
            >
              <template v-slot:activator>
                <v-list-item-content class="info-label">
                  <v-list-item-title
                    v-if="item.codigo && item.referencia"
                    v-text="
                          'Zona de Controlo - ' +
                            item.codigo +
                            ' ' +
                            item.referencia
                        "
                  ></v-list-item-title>
                  <v-list-item-title
                    v-else-if="item.codigo"
                    v-text="'Zona de Controlo - ' + item.codigo"
                  ></v-list-item-title>
                  <v-list-item-title v-else v-text="'Zona de Controlo - ' + item.referencia"></v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item-content>
                <v-list-item-title>
                  <v-row v-if="item.codigo">
                    <v-col cols="3">
                      <div class="info-label">Código da class:</div>
                    </v-col>
                    <v-col>
                      <a
                        v-if="!item.referencia"
                        :href="'/classes/consultar/c' + item.codigo"
                      >{{ item.codigo }}</a>
                      <div v-else>{{ item.codigo }}</div>
                    </v-col>
                  </v-row>
                  <v-row v-if="item.referencia">
                    <v-col cols="3">
                      <div class="info-label">Referência:</div>
                    </v-col>
                    <v-col>{{ item.referencia }}</v-col>
                  </v-row>
                  <v-row v-if="item.titulo">
                    <v-col cols="3">
                      <div class="info-label">Título:</div>
                    </v-col>
                    <v-col>{{ item.titulo }}</v-col>
                  </v-row>
                  <v-row v-if="item.prazoConservacao">
                    <v-col cols="3">
                      <div class="info-label">Prazo de Conservação Administrativa:</div>
                    </v-col>
                    <v-col>{{ item.prazoConservacao }} Anos</v-col>
                  </v-row>
                  <v-row v-if="item.destino">
                    <v-col cols="3">
                      <div class="info-label">Destino Final:</div>
                    </v-col>
                    <v-col v-if="item.destino === 'E'">Eliminação</v-col>
                    <v-col v-else-if="item.destino === 'C'">Conservação</v-col>
                    <v-col v-else >{{ item.destino }}</v-col>
                  </v-row>
                  <v-row v-if="item.ni">
                    <v-col cols="3">
                      <div class="info-label">Natureza de intervenção:</div>
                    </v-col>
                    <v-col>{{ item.ni }}</v-col>
                  </v-row>
                  <v-row v-if="item.dono">
                    <v-col cols="3">
                      <div class="info-label">Dono do PN:</div>
                    </v-col>
                    <v-col cols="2">
                      <li v-for="(d,i) in item.dono" :key="i">{{ d }}</li>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3">
                      <div class="info-label">Data de Início:</div>
                    </v-col>
                    <v-col>{{ item.dataInicio }}</v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3">
                      <div class="info-label">Data de Fim:</div>
                    </v-col>
                    <v-col>{{ item.dataFim }}</v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3">
                      <div class="info-label">N.º de agregações:</div>
                    </v-col>
                    <v-col>{{ item.agregacoes.length }}</v-col>
                  </v-row>
                  <v-row v-if="item.uiPapel">
                    <v-col cols="3">
                      <div class="info-label">Medição das UI em papel (m.l.):</div>
                    </v-col>
                    <v-col>{{ item.uiPapel }}</v-col>
                  </v-row>
                  <v-row v-if="item.uiDigital">
                    <v-col cols="3">
                      <div class="info-label">Medição das UI em digital (Gb):</div>
                    </v-col>
                    <v-col>{{ item.uiDigital }}</v-col>
                  </v-row>
                  <v-row v-if="item.uiOutros">
                    <v-col cols="3">
                      <div class="info-label">Medição das UI noutros suportes:</div>
                    </v-col>
                    <v-col>{{ item.uiOutros }}</v-col>
                  </v-row>
                  <div class="ma-1">
                    <v-row justify="space-between" class="info-label">
                      <v-col>Lista de Agregações</v-col>
                      <v-col>
                        <v-text-field
                          v-model="search"
                          append-icon="search"
                          label="Procura"
                          single-line
                          hide-details
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-data-table
                      :headers="cabecalho"
                      :items="item.agregacoes"
                      :items-per-page="5"
                      class="elevation-1 ml-2 mt-3"
                      :footer-props="footer_props"
                      :search="search"
                    />
                  </div>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-group>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";
export default {
  props: ["p"],

  components: {
    PO
  },

  data() {
    return {
      dialogTipologias: false,
      infoPedido: [
        {
          campo: "Fundo",
          conteudo: this.p.objeto.dados.ae.fundo,
          cor: null
        },
        {
          campo: "Legislação",
          conteudo: this.p.objeto.dados.ae.legislacao,
          cor: null
        },
        {
          campo: "Zona de Controlo",
          conteudo: this.p.objeto.dados.ae.zonaControlo
        }
      ],
      headersTipologias: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" },
        {
          text: "Operação",
          value: "operacao",
          class: "subtitle-1",
          sortable: false,
          width: "10%",
          align: "center"
        }
      ]
    };
  },

  methods: {
    async despacharPedido(dados) {
      try {
        const estado = "Devolvido";

        let dadosUtilizador = await this.$request(
          "get",
          "/users/" + this.$store.state.token + "/token"
        );

        dadosUtilizador = dadosUtilizador.data;
        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho
        };

        let pedido = JSON.parse(JSON.stringify(this.p));

        pedido.estado = estado;
        pedido.token = this.$store.state.token;

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao
        });

        this.$router.go(-1);
      } catch (e) {
        console.log("e :", e);
      }
    },

    async encaminharPedido(dados) {
      try {
        const estado = "Apreciado";

        let dadosUtilizador = await this.$request(
          "get",
          "/users/" + this.$store.state.token + "/token"
        );

        dadosUtilizador = dadosUtilizador.data;

        let pedido = JSON.parse(JSON.stringify(this.p));

        pedido.estado = estado;
        pedido.token = this.$store.state.token;

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho
        };

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao
        });

        this.$router.go(-1);
      } catch (e) {
        console.log("e :", e);
      }
    },

    verifica(obj) {
      const i = this.infoPedido.findIndex(o => o.campo == obj.campo);
      this.infoPedido[i].cor = "green lighten-3";
    },

    anula(obj) {
      const i = this.infoPedido.findIndex(o => o.campo == obj.campo);
      this.infoPedido[i].cor = "red lighten-3";
    },

    close() {
      this.dialogtipologias = false;
    }
  }
};
</script>

<style scoped>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #283593;
  border-radius: 3px;
}
</style>
