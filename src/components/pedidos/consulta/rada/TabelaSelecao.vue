<template>
  <v-card flat class="mb-12">
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Título</div>
      </v-col>
      <v-col xs="12" sm="9">
        <v-text-field readonly v-model="TS.titulo" solo></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-treeview hoverable :items="preparaTree" item-key="codigo">
          <template v-slot:prepend="{ item }">
            <img v-if="item.tipo == 'Série'" style="width:23px; height:30px" :src="svg_sr" />
            <img v-else-if="item.tipo == 'Subsérie'" style="width:23px; height:30px" :src="svg_ssr" />
          </template>
          <template v-slot:label="{ item }">
            <b @click="showClasse(item)">{{ item.titulo }}</b>
          </template>
        </v-treeview>
      </v-col>
    </v-row>
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
          :items="TS.UIs"
          :search="search"
          :footer-props="footer_props"
        >
          <template v-slot:item="props">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <tr :style="'text-align: center'" v-on="on" @click="showUI(props.item)">
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
                  <li
                    v-for="(classe, i) in props.item.classesAssociadas"
                    :key="i"
                  >{{ classe.codigo }}</li>
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
          Não foram adicionadas
          <b>Unidades de Instalação</b>.
        </v-alert>
      </v-col>
    </v-row>
    <p>{{TS.classes}}</p>
    <ShowSerie
      v-if="show_serie"
      :dialog="show_serie"
      @fecharDialog="show_serie = false"
      :formaContagem="formaContagem"
      :treeview_object="treeview_object"
      :classes="TS.classes"
      :show_a_partir_de_pedido="true"
    />
    <ShowSubserie
      v-if="show_subserie"
      :dialog="show_subserie"
      @fecharDialog="show_subserie = false"
      :treeview_object="treeview_object"
      :classes="TS.classes"
      :formaContagem="formaContagem"
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
import ShowSerie from "@/components/pedidos/consulta/rada/elementos/ShowSerie";
import ShowSubserie from "@/components/pedidos/consulta/rada/elementos/ShowSubserie";
import ShowOrganico from "@/components/pedidos/consulta/rada/elementos/ShowOrganico";
import ShowUI from "@/components/pedidos/consulta/rada/elementos/ShowUI";

export default {
  props: ["TS"],
  components: {
    ShowOrganico,
    ShowSubserie,
    ShowSerie,
    ShowUI
  },
  data: () => ({
    svg_sr: require("@/assets/common_descriptionlevel_sr.svg"),
    svg_ssr: require("@/assets/common_descriptionlevel_ssr.svg"),
    search: "",
    UI: null,
    show_ui: false,
    show_serie: false,
    show_subserie: false,
    show_area_organico: false,
    treeview_object: null,
    formaContagem: {
      subFormasContagem: [],
      formasContagem: []
    },
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
  computed: {
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
            )
          });
        }
      }
      return myTree;
    }
  },
  methods: {
    showUI(item) {
      this.UI = item;
      this.show_ui = true;
    },
    showClasse(item) {
      switch (item.tipo) {
        case "Série":
          this.treeview_object = item;
          this.show_serie = true;
          break;
        case "Subsérie":
          this.treeview_object = item;
          this.show_subserie = true;
          break;
        default:
          this.treeview_object = item;
          this.show_area_organico = true;
          break;
      }
    },
    preparaTreeFilhos: function(pai_codigo, pai_titulo) {
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
            )
          });
        }
      }

      return children;
    }
  },
  async created() {
    // FAZER PEDIDOS PARA A FORMA/SUBFORMA DE CONTAGEM
    let responseFC = await this.$request(
      "get",
      "/vocabularios/vc_pcaFormaContagem"
    );

    this.formaContagem.formasContagem = responseFC.data.map(item => {
      return {
        label: item.termo,
        value: item.idtermo.split("#")[1]
      };
    });

    let responseSFC = await this.$request(
      "get",
      "/vocabularios/vc_pcaSubformaContagem"
    );

    this.formaContagem.subFormasContagem = responseSFC.data.map(item => {
      return {
        label: item.termo.split(": ")[1] + ": " + item.desc,
        value: item.idtermo.split("#")[1]
      };
    });

    // MANIPULAÇÃO DOS DADOS PARA ADICIONAR OS TITULOS DAS CLASSES PARA SURGIREM NAS VIEWS
    let series_subseries = this.TS.classes.filter(
      cl => cl.tipo == "Série" || cl.tipo == "Subsérie"
    );

    for (let i = 0; i < series_subseries.length; i++) {
      series_subseries[i].relacoes.forEach(rel => {
        let classe_relacionada = this.TS.classes.find(
          cl => cl.codigo == rel.serieRelacionada.codigo
        );
        rel.serieRelacionada["titulo"] = classe_relacionada.titulo;

        if (!!series_subseries[i].justificacaoPCA) {
          let criterio = null;
          if (rel.relacao == "Suplemento para") {
            criterio = series_subseries[i].justificacaoPCA.find(
              e => e.tipo == "Critério de Utilidade Administrativa"
            );
          }
          if (rel.relacao == "Complementar de") {
            criterio = series_subseries[i].justificacaoDF.find(
              e => e.tipo == "Critério de Complementaridade Informacional"
            );
          }
          if (rel.relacao == "Síntese de" || rel.relacao == "Sintetizado por") {
            criterio = series_subseries[i].justificacaoDF.find(
              e => e.tipo == "Critério de Densidade Informacional"
            );
          }
          if (criterio != null) {
            let relacaoCriterio = criterio.relacoes.find(
              e => e.codigo == classe_relacionada.codigo
            );
            relacaoCriterio["titulo"] = classe_relacionada.titulo;
          }
        }
      });
    }

    for (let j = 0; j < this.TS.UIs.length; j++) {
      this.TS.UIs[j].classesAssociadas.forEach(rel => {
        let classe_relacionada = this.TS.classes.find(
          cl => cl.codigo == rel.codigo
        );

        rel["titulo"] = classe_relacionada.titulo;
      });
    }
  }
};
</script>

<style scoped>
::v-deep .v-treeview-node {
  background-color: rgba(240, 163, 10, 0.2);
}
</style>
