<template>
  <div>
    <v-row>
      <v-col cols="12" xs="12" sm="12">
        <v-btn color="indigo lighten-2" dark class="ma-2" @click="criar_nova_ui = true">
          <v-icon dark left>add</v-icon>Unidade de Instalação
        </v-btn>
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
          :items="filtrar_uis"
          :footer-props="footer_props"
          :items-per-page="5"
        >
          <template v-slot:item="props">
            <tr
              :style="'text-align: center; background-color:' + isComplete(props.item)"
              @click="editarUI(props.item)"
            >
              <td @click.stop>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon small v-on="on" @click="nova_ui_copia(props.item)">file_copy</v-icon>
                  </template>
                  <span>Criar nova UI baseada nos campos de {{props.item.codigo}}!</span>
                </v-tooltip>
              </td>
              <td>{{ props.item.codigo }}</td>
              <td>{{ props.item.titulo }}</td>
              <td>
                <v-list
                  v-if="!!props.item.classesAssociadas[0]"
                  dense
                  :style="'background-color:' + isComplete(props.item)"
                >
                  <v-list-item v-for="(classe, i) in props.item.classesAssociadas" :key="i">
                    <v-list-item-icon>
                      <img
                        v-if="classe.tipo == 'Série'"
                        style="width:23px; height:30px"
                        :src="svg_sr"
                      />
                      <img v-else style="width:23px; height:30px" :src="svg_ssr" />
                    </v-list-item-icon>
                    <v-list-item-content>{{classe.codigo + " - " + buscarTituloTable(classe.codigo)}}</v-list-item-content>
                  </v-list-item>
                </v-list>
                <p v-else>
                  <br />Não tem séries/subséries associadas!
                </p>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" xs="12" sm="12">
        <v-alert
          class="text-center"
          :value="true"
          color="amber accent-3"
          icon="warning"
        >
          Ainda não foram adicionadas
          <b>Unidades de Instalação</b>.
        </v-alert>
      </v-col>
    </v-row>
    <UI
      :UIs="TS.UIs"
      :RE="RE"
      :classes="TS.classes"
      v-if="criar_nova_ui"
      :dialog="criar_nova_ui"
      @fecharDialog="criar_nova_ui = false"
      @limpar_copia="UI_para_copiar = null"
      :UI_para_copiar="UI_para_copiar"
    />
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
    UI_para_copiar: null,
    svg_sr: require("@/assets/common_descriptionlevel_sr.svg"),
    svg_ssr: require("@/assets/common_descriptionlevel_ssr.svg"),
    criar_nova_ui: false,
    search: "",
    UI_clone: null,
    dialog_editar_UI: false,
    footer_props: {
      "items-per-page-options": [1, 5, 10, -1],
      "items-per-page-text": "Mostrar"
    },
    headers: [
      {
        align: "center",
        width: "1%",
        sortable: false,
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Código",
        align: "center",
        value: "codigo",
        width: "9%",
        sortable: true,
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Título",
        value: "titulo",
        align: "center",
        width: "45%",
        sortable: true,
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Séries/Subséries Associadas",
        value: "classesAssociadas",
        align: "center",
        width: "45%",
        sortable: false,
        class: ["table-header", "body-2", "font-weight-bold"]
      }
    ]
  }),
  computed: {
    filtrar_uis() {
      if (!!this.search) {
        return this.TS.UIs.filter(
          e =>
            e.codigo.includes(this.search) ||
            e.titulo.includes(this.search) ||
            e.classesAssociadas.some(
              e =>
                e.codigo.includes(this.search) || e.tipo.includes(this.search) || this.buscarTituloTable(e.codigo).includes(this.search)
            )
        );
      } else {
        return this.TS.UIs;
      }
    }
  },
  methods: {
    buscarTituloTable(codigo) {
      let classe = this.TS.classes.find(cl => cl.codigo == codigo);

      return classe.titulo;
    },
    isComplete(UI) {
      let back_color = "#FAFAFA";

      if (UI.classesAssociadas.length == 0 || UI.titulo == "") {
        back_color = "#FFEBEE";
      }
      return back_color;
    },
    nova_ui_copia(item) {
      this.UI_para_copiar = JSON.parse(JSON.stringify(item));

      this.buscarTitulosClasses(this.UI_para_copiar);

      this.criar_nova_ui = true;
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
            suporte_e_medicao: [{ suporte: null, medicao: null }],
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

      this.buscarTitulosClasses(this.UI_clone);

      this.dialog_editar_UI = true;
    },
    buscarTitulosClasses(UI) {
      UI.classesAssociadas.forEach(rel => {
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

<style scoped>
.table-header {
  color: #1a237e;
  font-weight: 400;
  background-color: #dee2f8;
  font-weight: bold;
}
</style>
