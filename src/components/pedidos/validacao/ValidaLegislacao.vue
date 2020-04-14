<template>
  <div>
    <v-row v-for="(info, i) in infoPedido" :key="i">
      <!-- Label -->
      <v-col
        cols="2"
        v-if="info.conteudo !== '' && info.conteudo !== undefined"
      >
        <div class="info-label">{{ info.campo }}</div>
      </v-col>

      <!-- Conteudo -->
      <v-col v-if="info.conteudo !== '' && info.conteudo !== undefined">
        <!-- Se o conteudo for uma lista de entidades -->
        <v-data-table
          v-if="info.campo === 'Entidades'"
          :headers="headersEntidades"
          :items="info.conteudo"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:item.operacao="{ item }">
            <v-icon color="red" @click="">delete</v-icon>
          </template>

          <template v-slot:top>
            <v-toolbar flat :color="info.cor">
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
          <template v-slot:top>
            <v-toolbar flat :color="info.cor">
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
          </template>
        </v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-spacer />
      <PO
        operacao="Validar"
        @finalizarPedido="finalizarPedido($event)"
        @devolverPedido="despacharPedido($event)"
      />
    </v-row>

    <!-- Dialog se existir erros no pedido à API -->
    <v-dialog v-model="erroPedido" width="80%" hide-overlay>
      <ErroDialog :erros="erros" @fecharErro="fecharErro()" />
    </v-dialog>
  </div>
</template>

<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";
import ErroDialog from "@/components/pedidos/generic/ErroDialog";

export default {
  props: ["p"],

  components: {
    PO,
    ErroDialog,
  },

  data() {
    return {
      erros: [],
      erroPedido: false,
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
      ],
      headersProcessos: [
        { text: "Código", value: "codigo", class: "subtitle-1" },
        { text: "Título", value: "titulo", class: "subtitle-1" },
      ],
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
        console.log("e :", e);
      }
    },

    async finalizarPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.p));

        let numeroErros = await this.validarLegislacao(
          pedido.objeto.acao,
          pedido.objeto.dados
        );

        if (numeroErros > 0) {
          this.erroPedido = true;
        } else {
          for (const key in pedido.objeto.dados) {
            if (
              pedido.objeto.dados[key] === undefined ||
              pedido.objeto.dados[key] === null ||
              pedido.objeto.dados[key] === ""
            ) {
              delete pedido.objeto.dados[key];
            }
          }

          if (pedido.objeto.dados.diplomaFonte === "Não especificada")
            delete pedido.objeto.dados.diplomaFonte;

          await this.$request("post", "/legislacao", pedido.objeto.dados);

          const estado = "Validado";

          let dadosUtilizador = await this.$request(
            "get",
            "/users/" + this.$store.state.token + "/token"
          );
          dadosUtilizador = dadosUtilizador.data;

          const novaDistribuicao = {
            estado: estado,
            responsavel: dadosUtilizador.email,
            data: new Date(),
            despacho: dados.mensagemDespacho,
          };

          pedido.estado = estado;
          pedido.token = this.$store.state.token;

          await this.$request("put", "/pedidos", {
            pedido: pedido,
            distribuicao: novaDistribuicao,
          });

          this.$router.go(-1);
        }
      } catch (e) {
        this.erros.push({
          sobre: "Acesso à Ontologia",
          mensagem: "Ocorreu um erro ao aceder à ontologia.",
        });
        this.erroPedido = true;
        console.log("e :", e);
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

    fecharErro() {
      this.erroPedido = false;
    },

    close() {
      this.dialogEnditades = false;
      this.dialogProcessos = false;
    },

    async validarLegislacao(acao, dados) {
      let numeroErros = 0;

      let parseAno = dados.numero.split("/");
      let anoDiploma = parseInt(parseAno[1]);

      //Tipo
      if (dados.tipo === "" || dados.tipo === null) {
        this.erros.push({
          sobre: "Tipo de Diploma",
          mensagem: "O tipo de diploma não pode ser vazio.",
        });

        numeroErros++;
      }

      // Número Diploma
      if (dados.numero === "" || dados.numero === null) {
        this.erros.push({
          sobre: "Número de Diploma",
          mensagem: "O número de diploma não pode ser vazio.",
        });

        numeroErros++;
      } else {
        try {
          const existeNumero = await this.$request(
            "get",
            "/legislacao/numero?valor=" + encodeURIComponent(dados.numero)
          );

          if (existeNumero.data) {
            this.erros.push({
              sobre: "Número de Diploma",
              mensagem: "O número de diploma já existente na BD.",
            });

            numeroErros++;
          }
        } catch (err) {
          numeroErros++;
          this.erros.push({
            sobre: "Acesso à Ontologia",
            mensagem:
              "Não consegui verificar a existência do número do diploma.",
          });
        }
      }

      // Data
      if (dados.data === "" || dados.data === null) {
        this.erros.push({
          sobre: "Data",
          mensagem: "A data não pode ser vazia.",
        });

        numeroErros++;
      } else if (!/[0-9]+\-[0-9]+\-[0-9]+/.test(dados.data)) {
        this.erros.push({
          sobre: "Data",
          mensagem: "A data está no formato errado.",
        });

        numeroErros++;
      } else {
        let date = new Date();

        let ano = parseInt(dados.data.slice(1, 4));
        let mes = parseInt(dados.data.slice(5, 7));
        let dia = parseInt(dados.data.slice(8, 10));

        let dias = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (mes > 12) {
          this.erros.push({
            sobre: "Data",
            mensagem: "A data apresenta o mês errado.",
          });

          numeroErros++;
        } else if (dia > dias[mes - 1]) {
          if (mes == 2) {
            if (!(ano % 4 == 0 && mes == 2 && dia == 29)) {
              this.erros.push({
                sobre: "Data",
                mensagem: "A data apresenta o dia do mês errado.",
              });

              numeroErros++;
            }
          } else {
            this.erros.push({
              sobre: "Data",
              mensagem: "A data apresenta o dia do mês errado.",
            });

            numeroErros++;
          }
        } else if (ano > parseInt(date.getFullYear())) {
          this.erros.push({
            sobre: "Data",
            mensagem:
              "Ano inválido! Por favor selecione uma data anterior à atual",
          });

          numeroErros++;
        } else if (
          ano == parseInt(date.getFullYear()) &&
          mes > parseInt(date.getMonth() + 1)
        ) {
          this.erros.push({
            sobre: "Data",
            mensagem:
              "Mês inválido! Por favor selecione uma data anterior à atual",
          });

          numeroErros++;
        } else if (
          ano == parseInt(date.getFullYear()) &&
          mes == parseInt(date.getMonth() + 1) &&
          dia > parseInt(date.getDate())
        ) {
          this.erros.push({
            sobre: "Data",
            mensagem:
              "Dia inválido! Por favor selecione uma data anterior à atual",
          });

          numeroErros++;
        }
      }

      // Sumário
      if (dados.sumario === "" || dados.sumario === null) {
        this.erros.push({
          sobre: "Sumário",
          mensagem: "O sumário não pode ser vazio.",
        });

        numeroErros++;
      }

      return numeroErros;
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
