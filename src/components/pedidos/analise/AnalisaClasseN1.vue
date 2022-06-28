<template>
  <div>
    <div v-for="(info, campo) in dados" :key="campo">
      <CampoPedido
        v-if="allowedInfo.includes(campo)"
        :title="transformaKeys(campo)"
        :campo="campo"
        :info="info"
        :estado="novoHistorico[campo].cor"
        :hideOps="esconderOperacoes[campo]"
        :validate="mudarEstado('verde')"
        :invalidate="mudarEstado('vermelho')"
        :edit="!blockedEdit.includes(campo) ? edita : null"
        :add="abrirNotaAplicacao"
        :remove="removeNota"
        :comment="abrirNotaDialog"
        :header="notasAppHeader"
      />
    </div>

    <PainelOperacoesPedido
      :p="p"
      :o="o"
      :historico="historico"
      :novoHistorico="novoHistorico"
      :validar="validar"
    />

    <!-- Dialog da nota -->
    <v-dialog v-model="notaDialog" width="70%" persistent>
      <AdicionarNota
        :campo="dialogCampo"
        :notaAtual="dialogValue"
        @fechar="notaDialog = false"
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

    <!-- Dialog de Edição para Notas De Aplicação/Exclusão -->
    <v-dialog v-model="notaDialogApp" width="50%" persistent>
      <AdicionarNotaAplicacao
        :campo="dialogCampo"
        :notaAtual="dialogValue"
        @fechar="notaDialogApp = false"
        @adicionar="adicionarNotaAplicacao($event, dialogCampo)"
      />
    </v-dialog>

    <!-- Dialog de erros -->
    <v-dialog v-model="erroDialog" width="50%" persistent>
      <ErroDialog :erros="dialogValue" uri="/pedidos" />
    </v-dialog>
  </div>
</template>

<script>
const {nanoid} = require("nanoid");
import PainelOperacoesPedido from "@/components/pedidos/generic/PainelOperacoesPedido";
import CampoPedido from "@/components/pedidos/generic/CampoPedido";
import AdicionarNota from "@/components/pedidos/generic/AdicionarNota";
import AdicionarNotaAplicacao from "@/components/pedidos/generic/AdicionarNotaAplicacao";
import EditarCamposDialog from "@/components/pedidos/generic/EditarCamposDialog";
import ErroDialog from "@/components/generic/ErroDialog";
import { mapKeys } from "@/utils/utils";

export default {
  props: {
    p: Object,
    o: Array,
    validar: Boolean
  },
  components: {
    PainelOperacoesPedido,
    CampoPedido,
    AdicionarNota,
    EditarCamposDialog,
    ErroDialog,
    AdicionarNotaAplicacao
  },

  data() {
    return {
      /**
       * Campos que vão aparecer
       */
      allowedInfo: [
        "nivel",
        "codigo",
        "descricao",
        "titulo",
        "notasAp",
        "notasEx"
      ],
      /**
       * Campos que não é possivel editar
       */
      blockedEdit: ["nivel", "codigo"],
      novoHistorico: {},
      esconderOperacoes: {},
      notasAppHeader: [
        { text: "Notas", value: "nota", class: "subtitle-1" },
        { text: "Operação", value: "operacao", class: "subtitle-1", sortable: false, width: "10%", align: "center"
        }
      ],
      /**
       * Estado para os dialogs de erro, nota, campo em String e campo em Array
       */
      dialogCampo: "",
      dialogValue: "",
      erroDialog: false,
      notaDialogApp: false,
      notaDialog: false,
      editaCampo: {
        visivel: false,
        nome: "",
        key: "",
        valorAtual: ""
      }
    };
  },

  async created() {
    try {
      this.novoHistorico = JSON.parse(
        JSON.stringify(this.historico[this.historico.length - 1])
      );
      Object.keys(this.dados).forEach(key => {
        this.esconderOperacoes[key] = false;
      });
      this.esconderOperacoes = {
        ...this.esconderOperacoes,
        nivel: true,
        codigo: true
      };
    } catch (e) {
      this.erroDialog = true;
      this.dialogValue = "Erro ao carregar os dados, por favor tente novamente";
    }
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
    abrirNotaDialog(campo) {
      this.dialogCampo = campo;
      if (this.novoHistorico[campo].nota !== undefined)
        this.dialogValue = this.novoHistorico[campo].nota;
      this.notaDialog = true;
    },
    abrirNotaAplicacao(campo) {
      this.notaDialogApp = true;
      this.dialogCampo = campo;
    },
    adicionarNota(dados) {
      this.notaDialog = false;
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
    editarCampo(event) {
      this.editaCampo.visivel = false;
      this.dados[event.campo.key] = event.dados;
      this.editarDados(event.campo.key, event.dados);
    },
    adicionarNotaAplicacao(event, campo) {
      this.notaDialogApp = false;
      const novaNota = { id: `na_${nanoid()}`, nota: event.nota };
      this.dados[campo].push(novaNota);
      this.editarDados(campo, this.dados[campo]);
    },
    removeNota(item, campo) {
      const index = this.dados[campo].findIndex(i => item == i);
      if (index !== -1) {
        this.dados[campo].splice(index, 1);
        this.editarDados(campo, this.dados[campo]);
      }
    }
  }
};
</script>
