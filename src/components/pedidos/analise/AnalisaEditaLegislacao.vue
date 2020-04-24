<template>
  <div>
    <v-row v-for="(info, i) in infoPedido" :key="i">
      <!-- Label -->
      <v-col
        cols="2"
        v-if="
          info.campo !== 'Código' &&
            info.conteudo !== '' &&
            info.conteudo !== null &&
            info.conteudo !== undefined
        "
      >
        <div class="info-label">{{ info.campo }}</div>
      </v-col>

      <!-- Conteudo -->
      <v-col
        v-if="
          info.campo !== 'Código' &&
            info.conteudo !== '' &&
            info.conteudo !== null &&
            info.conteudo !== undefined
        "
      >
        <!-- Se o conteudo for uma lista de entidades -->
        <v-data-table
          v-if="info.campo === 'Entidades'"
          :headers="headersEntidades"
          :items="info.conteudo"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:item="props">
            <tr>
              <td>{{ props.item.sigla }}</td>
              <td>{{ props.item.designacao }}</td>
              <td><v-icon color="red">delete</v-icon></td>
            </tr>
          </template>

          <template v-slot:top>
            <v-toolbar flat :color="info.cor">
              <v-dialog v-model="dialogEnditades" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn rounded class="indigo accent-4 white--text" v-on="on">
                    Adicionar Entidades
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">
                      Selecione as entidades em falta
                    </span>
                  </v-card-title>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="indigo darken-1" text @click="close"
                      >Fechar</v-btn
                    >
                    <!-- <v-btn color="blue darken-1" text @click="save">Save</v-btn> -->
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-spacer />
              <v-icon color="green" @click="verifica(info)">check</v-icon>
              <v-icon color="red" @click="anula(info)">clear</v-icon>
            </v-toolbar>
          </template>
        </v-data-table>

        <!-- Se o conteudo for uma lista de processos -->
        <v-data-table
          v-else-if="info.campo === 'Processos'"
          :headers="headersProcessos"
          :items="info.conteudo"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:item="props">
            <tr>
              <td>{{ props.item.codigo }}</td>
              <td>{{ props.item.titulo }}</td>
              <td><v-icon color="red">delete</v-icon></td>
            </tr>
          </template>

          <template v-slot:top>
            <v-toolbar flat :color="info.cor">
              <v-dialog v-model="dialogProcessos" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn rounded class="indigo accent-4 white--text" v-on="on">
                    Adicionar Processos
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline"
                      >Selecione os processos em falta
                    </span>
                  </v-card-title>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="indigo darken-1" text @click="close"
                      >Fechar</v-btn
                    >
                    <!-- <v-btn color="blue darken-1" text @click="save">Save</v-btn> -->
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-spacer />
              <v-icon color="green" @click="verifica(info)">check</v-icon>
              <v-icon color="red" @click="anula(info)">clear</v-icon>
            </v-toolbar>
          </template>
        </v-data-table>

        <!-- Se o contudo for texto -->
        <v-text-field
          v-else
          solo
          readonly
          hide-details
          :background-color="info.cor"
          :value="info.conteudo"
        >
          <template slot="append">
            <v-icon color="green" @click="verifica(info)">check</v-icon>
            <v-icon color="red" @click="anula(info)">clear</v-icon>
            <!--<v-icon @click="">create</v-icon>-->
            <v-icon>create</v-icon>
          </template>
        </v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-spacer />
      <PO
        operacao="Analisar"
        @avancarPedido="encaminharPedido($event)"
        @devolverPedido="despacharPedido($event)"
      />
    </v-row>
  </div>
</template>

<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";

export default {
  props: ["p"],

  components: {
    PO,
  },

  data() {
    return {
      dialogEnditades: false,
      dialogProcessos: false,
      infoPedido: [
        {
          campo: "Tipo de Diploma",
          conteudo: this.p.objeto.dados.tipo,
          cor: null,
        },
        {
          campo: "Fonte do Diploma",
          conteudo: this.p.objeto.dados.diplomaFonte,
          cor: null,
        },
        {
          campo: "Número do Diploma",
          conteudo: this.p.objeto.dados.numero,
          cor: null,
        },
        { campo: "Data", conteudo: this.p.objeto.dados.data, cor: null },
        { campo: "Sumário", conteudo: this.p.objeto.dados.sumario, cor: null },
        { campo: "Link", conteudo: this.p.objeto.dados.link, cor: null },
        { campo: "Código", conteudo: this.p.objeto.dados.codigo, cor: null },
        {
          campo: "Entidades",
          conteudo: this.p.objeto.dados.entidadesSel,
          cor: null,
        },
        {
          campo: "Processos",
          conteudo: this.p.objeto.dados.processosSel,
          cor: null,
        },
      ],
      headersEntidades: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" },
        {
          text: "Operação",
          value: "operacao",
          class: "subtitle-1",
          sortable: false,
          width: "10%",
          align: "center",
        },
      ],
      headersProcessos: [
        { text: "Código", value: "codigo", class: "subtitle-1" },
        { text: "Título", value: "titulo", class: "subtitle-1" },
        {
          text: "Operação",
          value: "operacao",
          class: "subtitle-1",
          sortable: false,
          width: "10%",
          align: "center",
        },
      ],
    };
  },

  methods: {
    async despacharPedido(dados) {
      try {
        const estado = "Devolvido";

        let dadosUtilizador = this.$verifyTokenUser();

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho,
        };

        let pedido = JSON.parse(JSON.stringify(this.p));

        pedido.estado = estado;
        pedido.token = this.$store.state.token;

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.$router.go(-1);
      } catch (e) {
        //console.log("e :", e);
      }
    },

    async encaminharPedido(dados) {
      try {
        const estado = "Apreciado";

        let dadosUtilizador = this.$verifyTokenUser();

        let pedido = JSON.parse(JSON.stringify(this.p));

        pedido.estado = estado;
        pedido.token = this.$store.state.token;

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          proximoResponsavel: {
            nome: dados.utilizadorSelecionado.name,
            entidade: dados.utilizadorSelecionado.entidade,
            email: dados.utilizadorSelecionado.email,
          },
          data: new Date(),
          despacho: dados.mensagemDespacho,
        };

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.$router.go(-1);
      } catch (e) {
        //console.log("e :", e);
      }
    },

    verifica(obj) {
      const i = this.infoPedido.findIndex((o) => o.campo == obj.campo);
      this.infoPedido[i].cor = "green lighten-3";
    },

    anula(obj) {
      const i = this.infoPedido.findIndex((o) => o.campo == obj.campo);
      this.infoPedido[i].cor = "red lighten-3";
    },

    close() {
      this.dialogEnditades = false;
      this.dialogProcessos = false;
    },
  },
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
