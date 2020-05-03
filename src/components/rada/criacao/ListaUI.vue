<template>
  <div>
    <v-row>
      <v-col cols="12" xs="12" sm="12">
        <UI :UIs="TS.UIs" :RE="RE" :classes="TS.classes" />
      </v-col>
    </v-row>
    <!-- {{TS.UIs}} -->
    <v-row v-if="TS.UIs[0]">
      <v-col cols="12" xs="12" sm="12">
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Procurar Unidade de Instalação"
          single-line
          hide-details
        ></v-text-field>
        <v-data-table
          style="background-color:#fafafa"
          :headers="headers"
          :items="TS.UIs"
          :search="search"
          :footer-props="footer_props"
        >
          <template v-slot:item="props">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <tr
                  :style="'text-align: center; background-color:' + isComplete(props.item)"
                  v-on="on"
                  @click="editarUI(props.item)"
                >
                  <td>{{ props.item.codigo }}</td>
                  <td>{{ props.item.titulo }}</td>
                </tr>
              </template>
              <span width="100%">
                <h4>
                  Classes associadas a:
                  <b>{{ props.item.codigo + " - " + props.item.titulo }}</b>
                </h4>
                <ul v-if="!!props.item.classesAssociadas[0]">
                  <li v-for="(classe, i) in props.item.classesAssociadas" :key="i">{{classe.codigo}}</li>
                </ul>
                <p v-else>Não tem classes associadas!</p>
              </span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" xs="12" sm="12">
        <v-alert class="text-center" :value="true" color="amber accent-3" icon="warning">
          Ainda não foram adicionadas
          <b>Unidades de Instalação</b>.
        </v-alert>
      </v-col>
    </v-row>
    <EditaUI
      v-if="dialog_editar_UI"
      :dialog="dialog_editar_UI"
      @fecharDialog="dialog_editar_UI = false"
      @remover="remover_UI"
      @atualizar="atualizarUI"
      :UI_clone="UI_clone"
      :RE="RE"
      :classes="TS.classes"
    />
  </div>
</template>

<script>
import UI from "@/components/rada/criacao/classes/UI";
import EditaUI from "@/components/rada/alteracao/EditarUI";

export default {
  props: ["TS", "RE"],
  components: {
    UI,
    EditaUI
  },
  data: () => ({
    search: "",
    UI_clone: null,
    dialog_editar_UI: false,
    footer_props: {
      "items-per-page-options": [10, 20, 100],
      "items-per-page-text": "Mostrar"
    },
    headers: [
      {
        text: "Código",
        align: "center",
        value: "codigo",
        width: "50%",
        sortable: true,
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Título",
        value: "titulo",
        align: "center",
        width: "50%",
        class: ["table-header", "body-2", "font-weight-bold"]
      }
    ]
  }),
  methods: {
    isComplete(UI) {
      let back_color = "#FAFAFA";

      if (UI.classesAssociadas.length == 0 || UI.titulo == "") {
        back_color = "#FFEBEE";
      }
      return back_color;
    },
    editaClasses(UI_real, UI_copia) {
      let novo_classesAssociadas = [];

      // Iterar o array alterado pelo utilizador
      for (let i = 0; i < UI_copia.classesAssociadas.length; i++) {
        let classe_ui_igual = UI_real.classesAssociadas.find(
          ui => ui.codigo == UI_copia.classesAssociadas[i].codigo
        );

        if (classe_ui_igual == undefined) {
          this.adiciona_a_classe(UI_copia.classesAssociadas[i], UI_real.codigo);
        }

        delete UI_copia.classesAssociadas[i].titulo;
        novo_classesAssociadas.push(UI_copia.classesAssociadas[i]);
      }

      //Iterar o array original de uis
      for (let j = 0; j < UI_real.classesAssociadas.length; j++) {
        let classe_ui_igual = UI_copia.classesAssociadas.find(
          ui => ui.codigo == UI_real.classesAssociadas[j].codigo
        );

        if (classe_ui_igual == undefined) {
          this.elimina_de_classe(
            UI_real.classesAssociadas[j].codigo,
            UI_real.codigo
          );
        }
      }
      return novo_classesAssociadas;
    },
    elimina_de_classe(classe_eliminada, codigo_UI) {
      let classe = this.TS.classes.find(cl => cl.codigo == classe_eliminada);

      classe.UIs = classe.UIs.filter(e => e != codigo_UI);
    },
    adiciona_a_classe(classe_adicionada, codigo_UI) {
      let classe = this.TS.classes.find(
        cl => cl.codigo == classe_adicionada.codigo
      );

      if (classe == undefined) {
        if (classe_adicionada.tipo == "Série") {
          classe = {
            codigo: classe_adicionada.codigo,
            titulo: classe_adicionada.titulo,
            descricao: "",
            dataInicial: null,
            dataFinal: null,
            tUA: null,
            tSerie: null,
            suporte: null,
            medicao: null,
            localizacao: [],
            entProdutoras: [],
            tipologiasProdutoras: [],
            legislacao: [],
            relacoes: [],
            notaPCA: null,
            notaDF: null,
            UIs: [codigo_UI],
            pca: null,
            formaContagem: {
              forma: null
            },
            justificacaoPCA: [],
            df: null,
            justificacaoDF: [],
            eFilhoDe: null,
            tipo: "Série"
          };
        } else {
          classe = {
            codigo: classe_adicionada.codigo,
            titulo: classe_adicionada.titulo,
            descricao: "",
            dataInicial: null,
            dataFinal: null,
            relacoes: [],
            UIs: [codigo_UI],
            notaPCA: null,
            notaDF: null,
            pca: null,
            formaContagem: {
              forma: null
            },
            justificacaoPCA: [],
            df: null,
            justificacaoDF: [],
            eFilhoDe: null,
            tipo: "Subsérie"
          };
        }
        this.TS.classes.push(classe);
      } else {
        classe.UIs.push(codigo_UI);
      }
    },
    async atualizarUI() {
      let UI = this.TS.UIs.find(ui => ui.codigo == this.UI_clone.codigo);
      UI.classesAssociadas = await this.editaClasses(UI, this.UI_clone);

      UI.titulo = this.UI_clone.titulo;
      UI.codCota = this.UI_clone.codCota;
      UI.dataInicial = this.UI_clone.dataInicial;
      UI.dataFinal = this.UI_clone.dataFinal;
      UI.produtor = this.UI_clone.produtor;
      UI.descricao = this.UI_clone.descricao;
      UI.notas = this.UI_clone.notas;
      UI.localizacao = this.UI_clone.localizacao;

      // Destruir objeto
      this.UI_clone = null;
      this.dialog_editar_UI = false;
    },
    editarUI(item) {
      this.UI_clone = JSON.parse(JSON.stringify(item));

      this.buscarTitulosClasses();

      this.dialog_editar_UI = true;
    },
    buscarTitulosClasses() {
      this.UI_clone.classesAssociadas.forEach(rel => {
        let classe_relacionada = this.TS.classes.find(
          cl => cl.codigo == rel.codigo
        );

        rel["titulo"] = classe_relacionada.titulo;
      });
    },
    remover_UI(ui_codigo) {
      this.TS.UIs = this.TS.UIs.filter(e => e.codigo != ui_codigo);
    }
  }
};
</script>

<style>
.table-header {
  color: #1a237e;
  font-weight: 400;
  background-color: #dee2f8;
  font-weight: bold;
}
</style>