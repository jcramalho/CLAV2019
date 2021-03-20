<template>
  <div>
    <Loading v-if="loading" :message="'pedido'" />
    <div v-else>
      <div v-for="(info, campo) in dados" :key="campo">
        <CampoPedido
          v-if="allowedInfo.includes(campo)"
          :title="transformaKeys(campo)"
          :campo="campo"
          :info="formatInfo(campo, info)"
          :estado="novoHistorico[campo].cor"
          :hideOps="esconderOperacoes[campo]"
          :validate="mudarEstado('verde')"
          :invalidate="mudarEstado('vermelho')"
          :edit="!blockedEdit.includes(campo) ? edita : null"
          :add="abrirNotaAplicacao"
          :remove="removeNota"
          :comment="abrirNotaDialog"
          :header="headerNotas[campo]"
        />
      </div>
    </div>

    <PainelOperacoesPedido
      :p="p"
      :historico="historico"
      :novoHistorico="novoHistorico"
      :validar="validar"
    />

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
        @fechar="editaCampo.visivel = false"
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
  </div>
</template>

<script>
const nanoid = require("nanoid");
import PainelOperacoesPedido from "@/components/pedidos/generic/PainelOperacoesPedido";
import CampoPedido from "@/components/pedidos/generic/CampoPedido";

import Loading from "@/components/generic/Loading";
import AdicionarNota from "@/components/pedidos/generic/AdicionarNota";
import AdicionarNotaAplicacao from "@/components/pedidos/generic/AdicionarNotaAplicacao";
import EditarCamposDialog from "@/components/pedidos/generic/EditarCamposDialog";
import DonosSelect from "@/components/classes/criacao/DonosSelect.vue";
import ProcessosRelacionadosSelect from "@/components/classes/criacao/ProcessosRelacionadosSelect.vue";
import LegislacaoSelect from "@/components/classes/criacao/LegislacaoSelect.vue";

import ErroDialog from "@/components/generic/ErroDialog";

import { mapKeys, adicionarNotaComRemovidos } from "@/utils/utils";

export default {
  props: { p: Object, validar: Boolean },

  components: {
    PainelOperacoesPedido,
    CampoPedido,
    Loading,
    AdicionarNota,
    EditarCamposDialog,
    ErroDialog,
    AdicionarNotaAplicacao,
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
      blockedEdit: ["nivel", "codigo"],
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
    mudarEstado(estado) {
      return campo => {
        this.novoHistorico[campo] = {
          ...this.novoHistorico[campo],
          cor: estado
        };
      };
    },
    editarDados(campo, dados) {
      this.novoHistorico[campo] = {
        ...this.novoHistorico[campo],
        dados: dados,
        cor: "amarelo"
      };
      this.esconderOperacoes[campo] = true;
    },
    formatInfo(campo, info) {
      switch (campo) {
        case "tipoProc":
          return info === "PC" ? "Processo Comum" : "Processo Específico";
          break;
        case "procTrans":
          return info === "S" ? "Sim" : "Não";
        default:
          return info;
          break;
      }
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
      this.editarDados(event.campo.key, event.dados);
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
        this.editarDados(campo, this.dados[campo]);
      }
    },

    selectEntidade: function(entidade, campo) {
      var index = this.entidadesD.findIndex(e => e.id === entidade.id);
      this.entidadesD.splice(index, 1);

      this.dados[campo].push(entidade);
      this.editarDados(campo, this.dados[campo]);
    },

    selectDiploma: function(leg, campo) {
      var index = this.listaLegislacao.findIndex(e => e.id === leg.id);
      this.listaLegislacao.splice(index, 1);
      this.dados[campo].push(leg);
      this.editarDados(campo, this.dados[campo]);
    },

    selectProcesso: function(processo, campo) {
      var index = this.listaProcessos.findIndex(e => e.id === processo.id);
      this.listaProcessos.splice(index, 1);
      this.dados[campo].push(processo);
      this.editarDados(campo, this.dados[campo]);
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
    }
  }
};
</script>
