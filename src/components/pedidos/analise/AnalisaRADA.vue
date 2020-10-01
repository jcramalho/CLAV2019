<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-stepper vertical class="elevation-0">
          <v-stepper-step color="amber accent-3" step="1" editable>
            <font size="4">
              <b>Informação Geral</b>
            </font>
          </v-stepper-step>
          <v-stepper-content step="1">
            <AnalisaInformacaoGeral
              :entidades="entidades"
              :RADA="p.objeto.dados"
              :novoHistorico="novoHistorico"
            />
          </v-stepper-content>
          <v-stepper-step color="amber accent-3" step="2" editable>
            <font size="4">
              <b>Relatório Expositivo</b>
            </font>
          </v-stepper-step>
          <v-stepper-content step="2">
            <AnalisaRE :RADA="p.objeto.dados" :novoHistorico="novoHistorico" />
          </v-stepper-content>
          <v-stepper-step color="amber accent-3" step="3" editable>
            <font size="4">
              <b>Tabela de Seleção</b>
            </font>
          </v-stepper-step>
          <v-stepper-content step="3">
            <AnalisaTS
              :RADA="p.objeto.dados"
              :novoHistorico="novoHistorico"
              :formaContagem="formaContagem"
            />
          </v-stepper-content>
        </v-stepper>
        <!-- <h1>RADAAA</h1>
        <p>{{ p.objeto }}</p>-->
      </v-col>
    </v-row>
    <v-row>
      <v-dialog v-model="erroDialog.visivel" width="50%" persistent>
        <ErroDialog :erros="erroDialog.mensagem" uri="/pedidos" />
      </v-dialog>
    </v-row>
    <v-row>
      <v-spacer />
      <PO
        operacao="Analisar"
        @avancarPedido="encaminharPedido($event)"
        @devolverPedido="despacharPedido($event)"
        v-if="fase == 'analise'"
      />
      <PO
        operacao="Validar"
        @finalizarPedido="verificaVermelhos($event)"
        @devolverPedido="despacharPedido($event)"
        v-else-if="fase == 'validacao'"
        :existeNumDespacho="true"
      />
    </v-row>
    <!-- Dialog de confirmação de operação -->
    <v-dialog v-model="dialogConfirmacao.visivel" width="50%" persistent>
      <ConfirmacaoOperacao
        :mensagem="dialogConfirmacao.mensagem"
        @fechar="dialogConfirmacao.visivel = false"
        @confirma="finalizarPedido(dialogConfirmacao.dados)"
      />
    </v-dialog>
    <v-alert
      width="100%"
      :value="!todos_validados"
      outlined
      type="error"
      prominent
      border="left"
    >
      Impossível validar RADA. As seguintes dependências não foram validadas:
      <ul>
        <li v-for="(e, i) in por_validar" :key="i">
          <span @click="$router.push('/pedidos/' + e.codigo)">{{
            e.codigo
          }}</span>
          - {{ e.texto }}
        </li>
      </ul>
    </v-alert>
  </div>
</template>

<script>
import AnalisaInformacaoGeral from "@/components/pedidos/analise/rada/AnalisaInformacaoGeral";
import AnalisaRE from "@/components/pedidos/analise/rada/AnalisaRE";
import AnalisaTS from "@/components/pedidos/analise/rada/AnalisaTS";
import PO from "@/components/pedidos/generic/PainelOperacoes";
import ErroDialog from "@/components/generic/ErroDialog";
import { converterParaTriplosRADA } from "@/utils/conversorTriplosRADA";
import ConfirmacaoOperacao from "@/components/pedidos/generic/ConfirmacaoOperacao";
const nanoid = require("nanoid");

export default {
  props: {
    fase: {
      type: String,
      required: true,
    },
    p: {},
  },
  components: {
    PO,
    ErroDialog,
    AnalisaInformacaoGeral,
    AnalisaRE,
    AnalisaTS,
    ConfirmacaoOperacao,
  },
  data() {
    return {
      erroDialog: {
        visivel: false,
        mensagem: null,
      },
      dialogConfirmacao: {
        visivel: false,
        mensagem: "",
        dados: null,
      },
      novoHistorico: null,
      entidades: [],
      formaContagem: {},
      todos_validados: true,
      por_validar: [],
    };
  },
  async created() {
    this.novoHistorico = JSON.parse(
      JSON.stringify(this.p.historico[this.p.historico.length - 1])
    );

    for (let j = 0; j < this.novoHistorico.tsRada.UIs.dados.length; j++) {
      Object.keys(this.novoHistorico.tsRada.UIs.dados[j].dados).map((k) => {
        this.novoHistorico.tsRada.UIs.dados[j].dados[k].nota = null;
      });
    }

    for (let i = 0; i < this.novoHistorico.tsRada.classes.dados.length; i++) {
      Object.keys(this.novoHistorico.tsRada.classes.dados[i].dados).map((k) => {
        if (k != "formaContagem") {
          this.novoHistorico.tsRada.classes.dados[i].dados[k].nota = null;
        } else {
          this.novoHistorico.tsRada.classes.dados[
            i
          ].dados.formaContagem.forma.nota = null;
          this.novoHistorico.tsRada.classes.dados[
            i
          ].dados.formaContagem.subforma.nota = null;
        }
      });
    }

    Object.keys(this.novoHistorico.RE).forEach((chaveRE) => {
      this.novoHistorico["RE"][chaveRE].nota = null;
    });

    Object.keys(this.novoHistorico).forEach((chave) => {
      if (chave != "tsRada" && chave != "RE") {
        this.novoHistorico[chave].nota = null;
      }
    });

    // pedido para entidades
    let response = await this.$request("get", "/entidades");
    this.entidades = response.data.map((item) => {
      return item.sigla + " - " + item.designacao;
    });

    let responseFC = await this.$request(
      "get",
      "/vocabularios/vc_pcaFormaContagem"
    );

    this.formaContagem["formasContagem"] = responseFC.data.map((item) => {
      return {
        label: item.termo,
        value: item.idtermo.split("#")[1],
      };
    });

    // let responseSFC = await this.$request(
    //   "get",
    //   "/vocabularios/vc_pcaSubformaContagem"
    // );

    // this.formaContagem["subFormasContagem"] = responseSFC.data.map((item) => {
    //   return {
    //     label: item.termo.split(": ")[1] + ": " + item.desc,
    //     value: item.idtermo.split("#")[1],
    //   };
    // });
  },
  methods: {
    alterarOriginal() {
      let n_vermelhos = 0;

      // alterar informacao geral
      Object.keys(this.novoHistorico).map((e) => {
        if (e != "RE" && e != "tsRada") {
          this.p.objeto.dados[e] = this.novoHistorico[e].dados;
          n_vermelhos =
            this.novoHistorico[e].cor === "vermelho"
              ? n_vermelhos + 1
              : n_vermelhos;
        }
      });

      // alterar relatorio expositivo
      Object.keys(this.novoHistorico.RE).map((e) => {
        this.p.objeto.dados.RE[e] = this.novoHistorico.RE[e].dados;
        n_vermelhos =
          this.novoHistorico.RE[e].cor === "vermelho"
            ? n_vermelhos + 1
            : n_vermelhos;
      });

      // alterar tabela selecao
      Object.keys(this.novoHistorico.tsRada).map((e) => {
        if (e == "classes") {
          for (
            let i = 0;
            i < this.novoHistorico.tsRada.classes.dados.length;
            i++
          ) {
            let classe_original = this.p.objeto.dados.tsRada.classes.find(
              (e) =>
                e.codigo ==
                this.novoHistorico.tsRada.classes.dados[i].dados.codigo.dados
            );

            Object.keys(this.novoHistorico.tsRada.classes.dados[i].dados).map(
              (k) => {
                if (k != "formaContagem") {
                  classe_original[k] = this.novoHistorico.tsRada.classes.dados[
                    i
                  ].dados[k].dados;
                  n_vermelhos =
                    this.novoHistorico.tsRada.classes.dados[i].dados[k].cor ===
                    "vermelho"
                      ? n_vermelhos + 1
                      : n_vermelhos;
                } else {
                  classe_original[k][
                    "forma"
                  ] = this.novoHistorico.tsRada.classes.dados[
                    i
                  ].dados.formaContagem.forma.dados;
                  classe_original[k][
                    "subforma"
                  ] = this.novoHistorico.tsRada.classes.dados[
                    i
                  ].dados.formaContagem.subforma.dados;
                  n_vermelhos =
                    this.novoHistorico.tsRada.classes.dados[i].dados
                      .formaContagem.forma.cor === "vermelho"
                      ? n_vermelhos + 1
                      : n_vermelhos;
                  n_vermelhos =
                    this.novoHistorico.tsRada.classes.dados[i].dados
                      .formaContagem.subforma.cor === "vermelho"
                      ? n_vermelhos + 1
                      : n_vermelhos;
                }
              }
            );
          }
        } else if (e == "UIs") {
          for (let i = 0; i < this.novoHistorico.tsRada.UIs.dados.length; i++) {
            let ui_original = this.p.objeto.dados.tsRada.UIs.find(
              (e) =>
                e.codigo ==
                this.novoHistorico.tsRada.UIs.dados[i].dados.codigo.dados
            );

            Object.keys(this.novoHistorico.tsRada.UIs.dados[i].dados).map(
              (k) => {
                ui_original[k] = this.novoHistorico.tsRada.UIs.dados[i].dados[
                  k
                ].dados;
                n_vermelhos =
                  this.novoHistorico.tsRada.UIs.dados[i].dados[k].cor ===
                  "vermelho"
                    ? n_vermelhos + 1
                    : n_vermelhos;
              }
            );
          }
        } else {
          this.p.objeto.dados.tsRada[e] = this.novoHistorico.tsRada[e].dados;
          n_vermelhos =
            this.novoHistorico.tsRada[e].dados.cor === "vermelho"
              ? n_vermelhos + 1
              : n_vermelhos;
        }
      });
      return n_vermelhos;
    },
    async encaminharPedido(dados) {
      try {
        let dadosUtilizador = this.$verifyTokenUser();

        await this.alterarOriginal();

        let pedido = JSON.parse(JSON.stringify(this.p));

        const estado =
          pedido.estado === "Distribuído" ? "Apreciado" : "Reapreciado";

        pedido.estado = estado;

        pedido.historico.push(this.novoHistorico);

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
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem =
          "Erro ao distribuir o pedido, por favor tente novamente";
      }
    },
    async despacharPedido(dados) {
      try {
        let dadosUtilizador = this.$verifyTokenUser();

        await this.alterarOriginal();

        const novaDistribuicao = {
          estado: "Devolvido",
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho,
        };

        let pedido = JSON.parse(JSON.stringify(this.p));

        pedido.estado = "Devolvido";

        pedido.historico.push(this.novoHistorico);

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.$router.go(-1);
      } catch (e) {
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem =
          "Erro ao devolver o pedido, por favor tente novamente";
      }
    },
    async verificaVermelhos(dados) {
      let existem_vermelhos = await this.alterarOriginal();

      // Se existirem abre dialog de confirmação
      if (existem_vermelhos > 0)
        this.dialogConfirmacao = {
          visivel: true,
          mensagem:
            "Existem " +
            existem_vermelhos +
            " campos assinalados a vermelho, deseja mesmo continuar com a submissão do pedido?",
          dados: dados,
        };
      // Caso contrário segue para a finalização do pedido
      else await this.finalizarPedido(dados);
    },
    async finalizarPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.p));

        let dependencias = pedido.distribuicao[0].despacho.match(
          /(?<=\[)(.*)(?=\])/g
        );

        this.todos_validados = true;
        this.por_validar = [];

        if (dependencias != null) {
          for (let i = 0; i < dependencias.length; i++) {
            let response = await this.$request(
              "get",
              "/pedidos/" + dependencias[i]
            );

            if (response.data.estado != "Validado") {
              this.todos_validados = false;
              this.por_validar.push({
                codigo: response.data.codigo,
                texto:
                  response.data.objeto.acao + " " + response.data.objeto.tipo,
              });
            }
          }
        }

        if (this.todos_validados) {
          //Fazer pedido para obter as subformas do PCA pois pode ter subformas que existem na plataforma e outras não;
          //Isso faz com que tenhamos uma object property ou data property, tendo que se verificar na construção dos triplos;

          let responseSFC = await this.$request(
            "get",
            "/vocabularios/vc_pcaSubformaContagem"
          );

          let subformasContagem = responseSFC.data.map((item) => {
            return {
              label: item.termo.split(": ")[1] + ": " + item.desc,
              value: item.idtermo.split("#")[1],
            };
          });

          let dataAprovacao = new Date();

          const despachoAprovacao = {
            id: "leg_" + nanoid(),
            numero: dados.nDespacho,
            sumario: pedido.objeto.dados.titulo,
            tipo: "Despacho",
            data:
              dataAprovacao.getFullYear() +
              "-" +
              ("0" + (dataAprovacao.getMonth() + 1)).slice(-2) +
              "-" +
              ("0" + dataAprovacao.getDate()).slice(-3),
            link: "/rada/" + pedido.objeto.dados.id,
            diplomaFonte: "RADA",
            dataRevogacao: "",
            estado: "Ativo",
            entidadesSel: [
              {
                sigla: "DGLAB",
                designacao:
                  "Direção-Geral do Livro, dos Arquivos e das Bibliotecas",
                id: "ent_DGLAB",
              },
            ],
            processosSel: [],
          };

          let triplos = await converterParaTriplosRADA(
            pedido.objeto.dados,
            subformasContagem,
            despachoAprovacao.data,
            despachoAprovacao.id
          );

          await this.$request("post", "/rada", { triplos });

          await this.$request("post", "/legislacao", despachoAprovacao);

          let dadosUtilizador = this.$verifyTokenUser();

          const novaDistribuicao = {
            estado: "Validado",
            responsavel: dadosUtilizador.email,
            data: new Date(),
            despacho: dados.mensagemDespacho,
          };

          pedido.estado = "Validado";

          await this.$request("put", "/pedidos", {
            pedido: pedido,
            distribuicao: novaDistribuicao,
          });

          this.$router.push(`/pedidos/finalizacao/${this.p.codigo}`);
        }
      } catch (e) {
        console.log(e);
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem = "Erro ao finalizar a validação!";
      }
    },
  },
};
</script>

<style>
.info-conteudo {
  padding: 5px;
  width: 100%;
  border: 1px solid #283593;
  border-radius: 3px;
}

.info-descricao {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-descricao-verde {
  opacity: 1;
  height: auto;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 1s;
  background-color: #c8e6c9; /* lighten-4 */
}

.info-descricao-vermelho {
  opacity: 1;
  height: auto;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 1s;
  background-color: #ffcdd2; /* lighten-4 */
}

.info-descricao-amarelo {
  opacity: 1;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 1s;
  background-color: #ffe0b2; /* lighten-4 */
}
</style>