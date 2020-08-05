<template>
  <v-card flat class="mb-12">
    <RADAEntry label="Título" :value="TS.titulo" />
    <div v-if="!!TS.classes[0]">
      <v-row>
        <v-col xs="11" sm="11">
          <v-text-field
            v-model="searchClasse"
            label="Pesquise a classe"
            clearable
            append-icon="search"
          ></v-text-field>
        </v-col>
        <v-col xs="1" sm="1">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-switch
                prepend-icon="table_view"
                inset
                hide-details
                v-model="tree_ou_tabela"
                v-on="on"
              ></v-switch>
            </template>
            <span>Alterar modo de visualização das classes</span>
          </v-tooltip>
        </v-col>
      </v-row>

      <v-row v-if="!tree_ou_tabela">
        <v-col cols="12">
          <v-treeview
            hoverable
            :items="preparaTree"
            item-key="codigo"
            :search="searchClasse"
            :filter="filter"
          >
            <template v-slot:prepend="{ item }">
              <img v-if="item.tipo == 'Série'" style="width:23px; height:30px" :src="svg_sr" />
              <img
                v-else-if="item.tipo == 'Subsérie'"
                style="width:23px; height:30px"
                :src="svg_ssr"
              />
            </template>
            <template v-slot:label="{ item }">
              <b @click="showClasse(item)">{{ item.titulo }}</b>
            </template>
          </v-treeview>
        </v-col>
      </v-row>
      <v-row v-else>
        <TabelaClassesRADA
          :formaContagem="formaContagem"
          :classes="TS.classes"
          @editarClasse="showClasse"
          :search="searchClasse"
        />
      </v-row>
    </div>
    <div v-else>
      <br />
      <v-alert class="text-center" :value="true" color="amber accent-3" icon="warning">
        <b>Sem Classes!</b> É obrigatório adicionar.
      </v-alert>
    </div>
    <br />
    <br />
    <br />

    <h5>Unidades de Instalação</h5>
    <v-divider></v-divider>
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
          :headers="headers"
          :items="filtrar_uis"
          :footer-props="footer_props"
          :items-per-page="5"
        >
          <template v-slot:item="props">
            <tr style="text-align: center; background-color:#ffffff" @click="showUI(props.item)">
              <td>{{ props.item.codigo }}</td>
              <td>{{ props.item.titulo }}</td>
              <!-- <td>
                <br/>
                <ul v-if="!!props.item.classesAssociadas[0]">
                  <li
                    v-for="(classe, i) in props.item.classesAssociadas"
                    :key="i"
                  >{{ classe.codigo }}</li>
                </ul>
                <p v-else>Não tem séries/subséries associadas!</p>
              </td>-->
              <td>
                <v-list v-if="!!props.item.classesAssociadas[0]" dense>
                  <v-list-item
                    v-for="(classe, i) in props.item.classesAssociadas"
                    :key="i"
                    align-center
                  >
                    <v-list-item-icon>
                      <img
                        v-if="classe.tipo == 'Série'"
                        style="width:23px; height:30px"
                        :src="svg_sr"
                      />
                      <img v-else style="width:23px; height:30px" :src="svg_ssr" />
                    </v-list-item-icon>
                    <v-list-item-content>{{classe.codigo + " - " + classe.titulo}}</v-list-item-content>
                  </v-list-item>
                </v-list>
                <p v-else>Não tem séries/subséries associadas!</p>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" xs="12" sm="12">
        <v-alert class="text-center" :value="true" color="amber accent-3" icon="warning">
          Não foram adicionadas
          <b>Unidades de Instalação</b>.
        </v-alert>
      </v-col>
    </v-row>
    <ShowSerieSubserie
      v-if="show_serie_subserie"
      :dialog="show_serie_subserie"
      @fecharDialog="show_serie_subserie = false"
      :formaContagem="formaContagem"
      :treeview_object="treeview_object"
      :classes="TS.classes"
      :show_a_partir_de_pedido="true"
    />
    <ShowOrganico
      v-if="show_area_organico"
      @fecharDialog="show_area_organico = false"
      :dialog="show_area_organico"
      :treeview_object="treeview_object"
      :classes="TS.classes"
    />
    <ShowUI v-if="show_ui" @fecharDialog="show_ui = false" :dialog="show_ui" :UI="UI" />
  </v-card>
</template>

<script>
import ShowSerieSubserie from "@/components/pedidos/consulta/rada/elementos/ShowSerieOuSubserie";
import ShowOrganico from "@/components/pedidos/consulta/rada/elementos/ShowOrganico";
import ShowUI from "@/components/pedidos/consulta/rada/elementos/ShowUI";
import TabelaClassesRADA from "@/components/rada/consulta/TabelaClassesRADA";

import RADAEntry from "@/components/rada/consulta/elementos/campos/RadaEntry.vue";

export default {
  props: ["TS"],
  components: {
    ShowOrganico,
    ShowSerieSubserie,
    ShowUI,
    TabelaClassesRADA,
    RADAEntry,
  },
  data: () => ({
    svg_sr: require("@/assets/common_descriptionlevel_sr.svg"),
    svg_ssr: require("@/assets/common_descriptionlevel_ssr.svg"),
    search: "",
    searchClasse: null,
    UI: null,
    show_ui: false,
    show_serie_subserie: false,
    show_area_organico: false,
    treeview_object: null,
    tree_ou_tabela: false,
    formaContagem: {
      formasContagem: [],
    },
    footer_props: {
      "items-per-page-options": [1, 5, 10, -1],
      "items-per-page-text": "Mostrar",
    },
    headers: [
      {
        text: "Código",
        align: "center",
        value: "codigo",
        width: "10%",
        sortable: true,
        class: ["table-header", "body-2", "font-weight-bold"],
      },
      {
        text: "Título",
        value: "titulo",
        align: "center",
        width: "45%",
        class: ["table-header", "body-2", "font-weight-bold"],
      },
      {
        text: "Séries/Subséries Associadas",
        value: "classesAssociadas",
        align: "center",
        width: "45%",
        sortable: false,
        class: ["table-header", "body-2", "font-weight-bold"],
      },
    ],
  }),
  computed: {
    filtrar_uis() {
      if (!!this.search) {
        return this.TS.UIs.filter(
          (e) =>
            e.codigo.includes(this.search) ||
            e.titulo.includes(this.search) ||
            e.classesAssociadas.some(
              (e) =>
                e.codigo.includes(this.search) ||
                e.tipo.includes(this.search) ||
                e.titulo.includes(this.search)
            )
        );
      } else {
        return this.TS.UIs;
      }
    },
    filter() {
      return (item, searchClasse) => {
        return (
          item.codigo.indexOf(searchClasse) > -1 ||
          item.titulo.indexOf(searchClasse) > -1
        );
      };
    },
    preparaTree() {
      var myTree = [];

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.TS.classes.sort((a, b) => a.codigo.localeCompare(b.codigo));

      for (var i = 0; i < this.TS.classes.length; i++) {
        if (this.TS.classes[i].eFilhoDe == null) {
          myTree.push({
            codigo: this.TS.classes[i].codigo,
            titulo:
              this.TS.classes[i].codigo + " - " + this.TS.classes[i].titulo,
            tipo: this.TS.classes[i].tipo,
            eFilhoDe: this.TS.classes[i].eFilhoDe,
            children: this.preparaTreeFilhos(
              this.TS.classes[i].codigo,
              this.TS.classes[i].titulo
            ),
          });
        }
      }
      return myTree;
    },
  },
  methods: {
    showUI(item) {
      this.UI = item;
      this.show_ui = true;
    },
    showClasse(item) {
      if (item.tipo == "Série" || item.tipo == "Subsérie") {
        this.treeview_object = item;
        this.show_serie_subserie = true;
      } else {
        this.treeview_object = item;
        this.show_area_organico = true;
      }
    },
    preparaTreeFilhos: function (pai_codigo, pai_titulo) {
      let children = [];

      for (let i = 0; i < this.TS.classes.length; i++) {
        if (this.TS.classes[i].eFilhoDe == pai_codigo) {
          children.push({
            codigo: this.TS.classes[i].codigo,
            titulo:
              this.TS.classes[i].codigo + " - " + this.TS.classes[i].titulo,
            tipo: this.TS.classes[i].tipo,
            eFilhoDe: this.TS.classes[i].eFilhoDe + " - " + pai_titulo,
            children: this.preparaTreeFilhos(
              this.TS.classes[i].codigo,
              this.TS.classes[i].titulo
            ),
          });
        }
      }

      return children;
    },
  },
  async created() {
    // FAZER PEDIDOS PARA A FORMA DE CONTAGEM
    let responseFC = await this.$request(
      "get",
      "/vocabularios/vc_pcaFormaContagem"
    );

    this.formaContagem.formasContagem = responseFC.data.map((item) => {
      return {
        label: item.termo,
        value: item.idtermo.split("#")[1],
      };
    });

    // MANIPULAÇÃO DOS DADOS PARA ADICIONAR OS TITULOS DAS CLASSES PARA SURGIREM NAS VIEWS
    let series_subseries = this.TS.classes.filter(
      (cl) => cl.tipo == "Série" || cl.tipo == "Subsérie"
    );

    for (let i = 0; i < series_subseries.length; i++) {
      series_subseries[i].relacoes.forEach((rel) => {
        let classe_relacionada = this.TS.classes.find(
          (cl) => cl.codigo == rel.serieRelacionada.codigo
        );
        rel.serieRelacionada["titulo"] = classe_relacionada.titulo;

        if (!!series_subseries[i].justificacaoPCA) {
          let criterio = null;
          if (rel.relacao == "Suplemento para") {
            criterio = series_subseries[i].justificacaoPCA.find(
              (e) => e.tipo == "Critério de Utilidade Administrativa"
            );
          }
          if (rel.relacao == "Complementar de") {
            criterio = series_subseries[i].justificacaoDF.find(
              (e) => e.tipo == "Critério de Complementaridade Informacional"
            );
          }
          if (rel.relacao == "Síntese de" || rel.relacao == "Sintetizado por") {
            criterio = series_subseries[i].justificacaoDF.find(
              (e) => e.tipo == "Critério de Densidade Informacional"
            );
          }
          if (criterio != null) {
            let relacaoCriterio = criterio.relacoes.find(
              (e) => e.codigo == classe_relacionada.codigo
            );
            relacaoCriterio["titulo"] = classe_relacionada.titulo;
          }
        }
      });
    }

    for (let j = 0; j < this.TS.UIs.length; j++) {
      this.TS.UIs[j].classesAssociadas.forEach((rel) => {
        let classe_relacionada = this.TS.classes.find(
          (cl) => cl.codigo == rel.codigo
        );

        this.$set(rel, "titulo", classe_relacionada.titulo);
      });
    }
  },
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
