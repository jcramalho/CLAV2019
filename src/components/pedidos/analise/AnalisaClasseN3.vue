<template>
  <div>
    <Loading v-if="loading" :message="'pedido'" />
    <div v-else>
      <div v-for="(info, campo) in dados" :key="campo">
        <v-row v-if="allowedInfo.includes(campo)" dense class="ma-1">
          <v-col cols="2">
            <div
              :key="`${novoHistorico[campo].cor}${animacoes[campo]}`"
              class="info-descricao"
              :class="`info-descricao-${novoHistorico[campo].cor}`"
            >
              {{ transformaKeys(campo) }}
            </div>
          </v-col>

          <v-col>
            <div v-if="!(info instanceof Array)" class="info-conteudo">
              <span v-if="info === '' || info === null">
                [Campo não preenchido na submissão do pedido]
              </span>
              <span v-else-if="campo === 'tipoProc'">{{
                info === "PC" ? "Processo Comum" : "Processo Específico"
              }}</span>
              <span v-else-if="campo === 'procTrans'">{{
                info === "S" ? "Sim" : "Não"
              }}</span>
              <span v-else>{{ info }}</span>
            </div>

            <div v-else>
              <VerNotas
                :header="headerNotas[campo]"
                :footer-props="footerProps"
                :items="info"
                :addFunc="abrirNotaAplicacao"
                :removeFunc="removeNota"
                :campo="campo"
              />
            </div>
          </v-col>

          <!-- Operações -->
          <v-col cols="auto">
            <span v-if="!esconderOperacoes[campo]">
              <v-icon class="mr-1" color="green" @click="verifica(campo)">
                check
              </v-icon>
              <v-icon class="mr-1" color="red" @click="anula(campo)">
                clear
              </v-icon>
            </span>
            <v-icon
              v-if="!(info instanceof Array)"
              class="mr-1"
              color="orange"
              @click="edita(campo)"
            >
              create
            </v-icon>

            <v-icon @click="abrirNotaDialog(campo)">
              add_comment
            </v-icon>
          </v-col>
        </v-row>
      </div>
    </div>

    <v-row>
      <v-spacer />
      <PO
        :operacao="validar ? 'Validar' : 'Analisar'"
        @avancarPedido="encaminharPedido($event)"
        @finalizarPedido="verificaEstadoCampos($event)"
        @devolverPedido="despacharPedido($event)"
      />
    </v-row>

    <!-- Dialog da nota -->
    <v-dialog v-model="notaDialog.visivel" width="70%" persistent>
      <AdicionarNota
        :campo="notaDialog.campo"
        :notaAtual="notaDialog.nota"
        @fechar="notaDialog.visivel = false"
        @adicionar="adicionarNota($event)"
      />
    </v-dialog>

    <!-- Dialog de edição-->
    <v-dialog v-model="editaCampo.visivel" width="70%" persistent>
      <EditarCamposDialog
        :campo="editaCampo"
        :tipoPedido="p.objeto.tipo"
        @fechar="fechaEditaCampoDialog($event)"
        @editarCampo="editarCampo($event)"
      />
    </v-dialog>

    <!-- Dialog de erros -->
    <v-dialog v-model="erroDialog.visivel" width="50%" persistent>
      <ErroDialog :erros="erroDialog.mensagem" uri="/pedidos" />
    </v-dialog>

    <!-- Dialog de Notas-->
    <v-dialog v-model="notaDialogApp.visivel" width="50%" persistent>
      <AdicionarNotaAplicacao
        v-if="
          notaDialogApp.campo !== 'donos' &&
            notaDialogApp.campo !== 'processosRelacionados' &&
            notaDialogApp.campo !== 'legislacao'
        "
        :notaAtual="notaDialogApp.nota"
        @fechar="notaDialogApp.visivel = false"
        @adicionar="adicionarNotaAplicacao($event, notaDialogApp.campo)"
      />
      <v-card
        v-if="
          notaDialogApp.campo === 'donos' ||
            notaDialogApp.campo === 'processosRelacionados' ||
            notaDialogApp.campo === 'legislacao'
        "
      >
        <v-card-text>
          <DonosSelect
            v-if="notaDialogApp.campo === 'donos'"
            :entidadesReady="true"
            :entidades="entidadesD"
            @selectEntidade="selectEntidade($event, notaDialogApp.campo)"
          />
          <ProcessosRelacionadosSelect
            v-if="notaDialogApp.campo === 'processosRelacionados'"
            :procReady="true"
            :processos="listaProcessos"
            @selectProcesso="selectProcesso($event, notaDialogApp.campo)"
          />
          <LegislacaoSelect
            v-if="notaDialogApp.campo === 'legislacao'"
            :legs="listaLegislacao"
            :legislacaoReady="true"
            @selectDiploma="selectDiploma($event)"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red darken-4"
            text
            rounded
            dark
            @click="notaDialogApp.visivel = false"
          >
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirmacao.visivel" width="50%" persistent>
      <ConfirmacaoOperacao
        :mensagem="dialogConfirmacao.mensagem"
        @fechar="fechaDialogConfirmacao()"
        @confirma="finalizarPedido(dialogConfirmacao.dados)"
      />
    </v-dialog>
  </div>
</template>

<script>
const nanoid = require("nanoid");

import PO from "@/components/pedidos/generic/PainelOperacoes";
import Loading from "@/components/generic/Loading";
import AdicionarNota from "@/components/pedidos/generic/AdicionarNota";
import AdicionarNotaAplicacao from "@/components/pedidos/generic/AdicionarNotaAplicacao";
import ConfirmacaoOperacao from "@/components/pedidos/generic/ConfirmacaoOperacao";
import EditarCamposDialog from "@/components/pedidos/generic/EditarCamposDialog";
import VerNotas from "@/components/pedidos/generic/VerNotas";
import DonosSelect from "@/components/classes/criacao/DonosSelect.vue";
import ProcessosRelacionadosSelect from "@/components/classes/criacao/ProcessosRelacionadosSelect.vue";
import LegislacaoSelect from "@/components/classes/criacao/LegislacaoSelect.vue";

import ErroDialog from "@/components/generic/ErroDialog";

import {
  comparaSigla,
  mapKeys,
  identificaItemAdicionado,
  adicionarNotaComRemovidos
} from "@/utils/utils";
import { createCipher } from "crypto";

export default {
  props: { p: Object, validar: Boolean },

  components: {
    PO,
    Loading,
    AdicionarNota,
    EditarCamposDialog,
    ErroDialog,
    AdicionarNotaAplicacao,
    ConfirmacaoOperacao,
    VerNotas,
    DonosSelect,
    ProcessosRelacionadosSelect,
    LegislacaoSelect
  },

  data() {
    return {
      loading: true,
      json: null,
      dialogNotas: false,
      nota: "",
      animacoes: {},
      esconderOperacoes: {},
      allowedInfo: [
        "nivel",
        "codigo",
        "descricao",
        "titulo",
        "notasAp",
        "exemplosNotasAp",
        "notasEx",
        "termosInd",
        "tipoProc",
        "procTrans",
        "donos",
        "processosRelacionados",
        "legislacao"
      ],
      novoHistorico: {},
      formatNotas: {
        notasAp: { id: "id", nota: "nota", idType: "na" },
        exemplosNotasAp: { id: "idExemplo", nota: "exemplo", idType: "exna" },
        notasEx: { id: "id", nota: "nota", idType: "ne" },
        termosInd: { id: "id", nota: "termo", idType: "ti" }
      },
      headerNotas: {
        notasAp: [
          { text: "Notas de Aplicação", value: "nota", class: "subtitle-1" },
          {
            text: "Operação",
            value: "operacao",
            class: "subtitle-1",
            sortable: false,
            width: "10%",
            align: "center"
          }
        ],
        notasEx: [
          { text: "Notas de Aplicação", value: "nota", class: "subtitle-1" },
          {
            text: "Operação",
            value: "operacao",
            class: "subtitle-1",
            sortable: false,
            width: "10%",
            align: "center"
          }
        ],
        exemplosNotasAp: [
          {
            text: "Exemplo Notas de Aplicação",
            value: "exemplo",
            class: "subtitle-1"
          },
          {
            text: "Operação",
            value: "operacao",
            class: "subtitle-1",
            sortable: false,
            width: "10%",
            align: "center"
          }
        ],
        termosInd: [
          {
            text: "Termos Indice",
            value: "termo",
            class: "subtitle-1"
          },
          {
            text: "Operação",
            value: "operacao",
            class: "subtitle-1",
            sortable: false,
            width: "10%",
            align: "center"
          }
        ],
        donos: [
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
        ],
        processosRelacionados: [
          { text: "Relação", value: "relacao", class: "subtitle-1" },
          { text: "Processo", value: "codigo", class: "subtitle-1" },
          { text: "Titulo", value: "titulo", class: "subtitle-1" },
          {
            text: "Operação",
            value: "operacao",
            class: "subtitle-1",
            sortable: false,
            width: "10%",
            align: "center"
          }
        ],
        legislacao: [
          { text: "Tipo", value: "tipo", class: "subtitle-1" },
          { text: "Número", value: "numero", class: "subtitle-1" },
          { text: "Sumário", value: "sumario", class: "subtitle-1" },
          { text: "Data", value: "data", class: "subtitle-1" },
          {
            text: "Operação",
            value: "operacao",
            class: "subtitle-1",
            sortable: false,
            width: "10%",
            align: "center"
          }
        ]
      },
      erroDialog: {
        visivel: false,
        mensagem: null
      },
      footerProps: {
        "items-per-page-text": "Notas por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todas"
      },
      tipologias: [],
      notaDialogApp: {
        visivel: false,
        campo: "",
        nota: ""
      },
      notaDialog: {
        visivel: false,
        campo: "",
        nota: ""
      },
      dialogConfirmacao: {
        visivel: false,
        mensagem: "",
        dados: null
      },
      editaCampo: {
        visivel: false,
        nome: "",
        key: "",
        valorAtual: ""
      },
      entidadesD: {},
      listaProcessos: {},
      listaLegislacao: {}
    };
  },

  async created() {
    try {
      await this.loadTipologias();
      await this.loadEntidades();
      await this.loadProcessos();
      await this.loadLegislacao();

      this.loading = false;
    } catch (e) {
      this.erroDialog.visivel = true;
      this.erroDialog.mensagem =
        "Erro ao carregar os dados, por favor tente novamente";
    }
  },

  mounted() {
    this.json = JSON.stringify(this.p, null, 2);

    const copiaHistorico = JSON.parse(
      JSON.stringify(this.historico[this.historico.length - 1])
    );

    //:FIXME:
    copiaHistorico.codigo = { cor: "verde" };
    Object.keys(copiaHistorico).forEach(h => (copiaHistorico[h].nota = null));

    this.novoHistorico = copiaHistorico;

    Object.keys(this.dados).forEach(key => {
      this.esconderOperacoes[key] = false;
      this.animacoes[key] = true;
    });
  },

  computed: {
    dados() {
      return this.p.objeto.dados;
    },

    historico() {
      return this.p.historico;
    }
  },
  methods: {
    transformaKeys(key) {
      return mapKeys(key);
    },

    abrirNotaDialog(campo) {
      this.notaDialog.visivel = true;
      this.notaDialog.campo = campo;
      if (this.novoHistorico[campo].nota !== undefined)
        this.notaDialog.nota = this.novoHistorico[campo].nota;
    },

    adicionarNota(dados) {
      this.notaDialog.visivel = false;
      this.novoHistorico[dados.campo] = {
        ...this.novoHistorico[dados.campo],
        nota: dados.nota
      };
    },

    edita(campo) {
      this.editaCampo = {
        visivel: true,
        nome: this.transformaKeys(campo),
        key: campo,
        valorAtual: this.dados[campo]
      };
    },

    verifica(campo) {
      this.novoHistorico[campo] = {
        ...this.novoHistorico[campo],
        cor: "verde"
      };

      this.animacoes[campo] = !this.animacoes[campo];
    },

    anula(campo) {
      this.novoHistorico[campo] = {
        ...this.novoHistorico[campo],
        cor: "vermelho"
      };

      this.animacoes[campo] = !this.animacoes[campo];
    },

    fechaEditaCampoDialog(campo) {
      this.editaCampo.visivel = false;
    },

    fechaDialogConfirmacao() {
      this.dialogConfirmacao = {
        visivel: false,
        mensagem: "",
        dados: null
      };
    },

    editarCampo(event) {
      this.editaCampo.visivel = false;

      this.dados[event.campo.key] = event.dados;
      this.novoHistorico[event.campo.key] = {
        ...this.novoHistorico[event.campo.key],
        dados: event.dados,
        cor: "amarelo"
      };

      this.esconderOperacoes[event.campo.key] = true;
      this.animacoes[event.campo.key] = !this.animacoes[event.campo.key];
    },

    abrirNotaAplicacao(campo) {
      this.notaDialogApp.visivel = true;
      this.notaDialogApp.campo = campo;
    },

    adicionarNotaAplicacao(event, campo) {
      this.notaDialogApp.visivel = false;

      let novaNota = {};
      novaNota[this.formatNotas[campo].id] = `${
        this.formatNotas[campo].idType
      }_${nanoid()}`;
      novaNota[this.formatNotas[campo].nota] = event.nota;

      this.dados[campo].push(novaNota);
      this.novoHistorico[campo] = {
        ...this.novoHistorico[campo],
        dados: this.dados[campo],
        cor: "amarelo"
      };

      this.esconderOperacoes[campo] = true;
      this.animacoes[campo] = !this.animacoes[campo];
    },

    removeNota(item, campo) {
      let index;
      if (campo === "donos") {
        index = this.dados[campo].findIndex(i => item.id === i.id);
        if (item.estado && item.estado != "Nova") {
          this.entidadesD.push(item);
        } else if (!item.estado) {
          this.entidadesD.push(item);
        }
      } else if (campo === "processosRelacionados") {
        index = this.dados[campo].findIndex(i => item.codigo === i.codigo);
        this.listaProcessos.push(item);
      } else {
        index = this.dados[campo].findIndex(i => item === i);
      }

      if (index !== -1) {
        const bs = this.dados[campo].splice(index, 1);
        this.novoHistorico[campo] = {
          ...this.novoHistorico[campo],
          cor: "amarelo",
          dados: this.dados[campo]
        };

        this.animacoes[campo] = !this.animacoes[campo];
        this.esconderOperacoes[campo] = true;
      }
    },

    selectEntidade: function(entidade, campo) {
      var index = this.entidadesD.findIndex(e => e.id === entidade.id);
      this.entidadesD.splice(index, 1);

      this.dados[campo].push(entidade);
      this.novoHistorico[campo] = {
        ...this.novoHistorico[campo],
        dados: this.dados[campo],
        cor: "amarelo"
      };

      this.esconderOperacoes[campo] = true;
      this.animacoes[campo] = !this.animacoes[campo];
    },

    selectDiploma: function(leg, campo) {
      var index = this.listaLegislacao.findIndex(e => e.id === leg.id);
      this.listaLegislacao.splice(index, 1);

      this.dados[campo].push(leg);
      this.novoHistorico[campo] = {
        ...this.novoHistorico[campo],
        dados: this.dados[campo],
        cor: "amarelo"
      };

      this.esconderOperacoes[campo] = true;
      this.animacoes[campo] = !this.animacoes[campo];
    },

    selectProcesso: function(processo, campo) {
      var index = this.listaProcessos.findIndex(e => e.id === processo.id);
      this.listaProcessos.splice(index, 1);

      this.dados[campo].push(processo);
      this.novoHistorico[campo] = {
        ...this.novoHistorico[campo],
        dados: this.dados[campo],
        cor: "amarelo"
      };

      this.esconderOperacoes[campo] = true;
      this.animacoes[campo] = !this.animacoes[campo];
    },

    async loadTipologias() {
      try {
        let { data } = await this.$request("get", "/tipologias/");

        this.tipologias = data.map(item => {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id
          };
        });
      } catch (error) {
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem =
          "Erro ao carregar os dados, por favor tente novamente";
      }
    },

    async loadEntidades() {
      try {
        var response = await this.$request("get", "/entidades");
        let filtered = response.data.filter(item => {
          if (this.dados.donos.findIndex(el => el.id == item.id) > -1) {
            return false;
          }
          return true;
        });
        this.entidadesD = filtered.map(function(item) {
          return {
            selected: false,
            id: item.id,
            sigla: item.sigla,
            designacao: item.designacao,
            tipo: "Entidade",
            intervencao: "Indefinido",
            estado: item.estado
          };
        });
        response = await this.$request("get", "/tipologias");
        this.entidadesD = await this.entidadesD.concat(
          response.data.map(function(item) {
            return {
              selected: false,
              id: item.id,
              sigla: item.sigla,
              designacao: item.designacao,
              tipo: "Tipologia",
              intervencao: "Indefinido"
            };
          })
        );
        await this.entidadesD.sort(function(a, b) {
          return a.sigla.localeCompare(b.sigla);
        });

        this.entidadesP = JSON.parse(JSON.stringify(this.entidadesD));
      } catch (erro) {
        return erro;
      }
    },

    async loadProcessos() {
      try {
        var response = await this.$request("get", "/classes?nivel=3");
        let filtered = response.data.filter(item => {
          if (
            this.dados.processosRelacionados.findIndex(
              el => el.codigo == item.codigo
            ) > -1
          ) {
            return false;
          }
          return true;
        });
        this.listaProcessos = filtered
          .map(function(item) {
            return {
              selected: false,
              id: item.id.split("#")[1],
              codigo: item.codigo,
              titulo: item.titulo,
              idRel: "Indefinido"
            };
          })
          .sort(function(a, b) {
            return a.codigo.localeCompare(b.codigo);
          });
      } catch (error) {
        return error;
      }
    },

    async loadLegislacao() {
      try {
        var response = await this.$request("get", "/legislacao?estado=Ativo");
        this.listaLegislacao = response.data
          .map(function(item) {
            return {
              tipo: item.tipo,
              numero: item.numero,
              sumario: item.sumario,
              data: item.data,
              selected: false,
              id: item.id
            };
          })
          .sort(function(a, b) {
            return -1 * a.data.localeCompare(b.data);
          });
      } catch (error) {
        return error;
      }
    },

    async despacharPedido(dados) {
      try {
        const estado = "Devolvido";

        let dadosUtilizador = this.$verifyTokenUser();

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho
        };

        let pedido = JSON.parse(JSON.stringify(this.p));

        pedido.estado = estado;

        this.novoHistorico = adicionarNotaComRemovidos(
          this.historico[this.historico.length - 1],
          this.novoHistorico
        );

        pedido.historico.push(this.novoHistorico);

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao
        });

        this.$router.go(-1);
      } catch (e) {
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem =
          "Erro ao devolver o pedido, por favor tente novamente";
      }
    },

    async encaminharPedido(dados) {
      try {
        let dadosUtilizador = this.$verifyTokenUser();

        let pedido = JSON.parse(JSON.stringify(this.p));

        const estado =
          pedido.estado === "Distribuído" ? "Apreciado" : "Reapreciado";

        pedido.estado = estado;

        this.novoHistorico = adicionarNotaComRemovidos(
          this.historico[this.historico.length - 1],
          this.novoHistorico
        );

        pedido.historico.push(this.novoHistorico);

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          proximoResponsavel: {
            nome: dados.utilizadorSelecionado.name,
            entidade: dados.utilizadorSelecionado.entidade,
            email: dados.utilizadorSelecionado.email
          },
          data: new Date(),
          despacho: dados.mensagemDespacho
        };

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao
        });

        this.$router.go(-1);
      } catch (e) {
        console.log(e);
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem =
          "Erro ao distribuir o pedido, por favor tente novamente";
      }
    },
    async verificaEstadoCampos(dados) {
      // procura campos a vermelho
      const haVermelhos = Object.keys(this.novoHistorico).some(
        key => this.novoHistorico[key].cor === "vermelho"
      );
      // Se existirem abre dialog de confirmação
      if (haVermelhos)
        this.dialogConfirmacao = {
          visivel: true,
          mensagem:
            "Existem um ou mais campos assinalados a vermelho, deseja mesmo continuar com a submissão do pedido?",
          dados: dados
        };
      // Caso contrário segue para a finalização do pedido
      else await this.finalizarPedido(dados);
    },
    async finalizarPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.p));

        let numeroErros = 0;

        if (numeroErros === 0) {
          for (const key in pedido.objeto.dados) {
            if (
              pedido.objeto.dados[key] === null ||
              pedido.objeto.dados[key] === ""
            ) {
              delete pedido.objeto.dados[key];
            }
          }

          await this.$request("post", "/classes", pedido.objeto.dados);

          const estado = "Validado";

          let dadosUtilizador = this.$verifyTokenUser();

          const novaDistribuicao = {
            estado: estado,
            responsavel: dadosUtilizador.email,
            data: new Date(),
            despacho: dados.mensagemDespacho
          };

          pedido.estado = estado;

          this.novoHistorico = adicionarNotaComRemovidos(
            this.historico[this.historico.length - 1],
            this.novoHistorico
          );

          pedido.historico.push(this.novoHistorico);

          await this.$request("put", "/pedidos", {
            pedido: pedido,
            distribuicao: novaDistribuicao
          });

          this.$router.push(`/pedidos/finalizacao/${this.p.codigo}`);
        } else {
          this.erroPedido = true;
        }
      } catch (e) {
        this.erroPedido = true;

        let parsedError = Object.assign({}, e);
        parsedError = parsedError.response;

        if (parsedError !== undefined) {
          if (parsedError.status === 422) {
            parsedError.data.forEach(erro => {
              this.erros.push({
                parametro: mapKeys(erro.param),
                mensagem: erro.msg
              });
            });
          }
        } else {
          this.erros.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Ocorreu um erro ao aceder à ontologia."
          });
        }
      }
    }
  }
};
</script>

<style scoped>
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
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 1s;
  background-color: #c8e6c9; /* lighten-4 */
}

.info-descricao-vermelho {
  opacity: 1;
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

@keyframes fadeInOpacity {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
