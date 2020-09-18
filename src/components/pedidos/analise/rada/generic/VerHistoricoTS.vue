<template>
  <div>
    <VerHistoricoCampo campoText="Título Tabela Seleção" :historicoCampo="historico.titulo" />

    <!-- LISTAR CLASSES -->

    <v-row>
      <v-col cols="12">
        <v-divider></v-divider>
        <h5>Classes</h5>
        <v-data-table
          flat
          :headers="headers"
          :items="historico.classes.dados"
          :footer-props="footer_props"
          :items-per-page="5"
          item-key="dados.codigo.dados"
          show-expand
          single-expand
        >
          <template v-slot:item.tipo="{ item }">
            <img
              v-if="item.dados.tipo.dados == 'Série'"
              style="width:23px; height:30px"
              :src="svg_sr"
            />
            <img
              v-else-if="item.dados.tipo.dados == 'Subsérie'"
              style="width:23px; height:30px"
              :src="svg_ssr"
            />
            <img
              v-else-if="item.dados.tipo.dados == 'N1'"
              style="width:23px; height:30px"
              :src="svg_N1"
            />
            <img
              v-else-if="item.dados.tipo.dados == 'N2'"
              style="width:23px; height:30px"
              :src="svg_N2"
            />
            <img
              v-else-if="item.dados.tipo.dados == 'N3'"
              style="width:23px; height:30px"
              :src="svg_N3"
            />
            <i v-else>{{ item.tipo }}</i>
          </template>

          <template v-slot:item.codigo="{ item }">{{ item.dados.codigo.dados }}</template>

          <template v-slot:item.titulo="{ item }">{{ item.dados.titulo.dados }}</template>

          <template v-slot:item.df="{ item }">{{ !!item.dados.df ? item.dados.df.dados : '' }}</template>
          <template
            v-slot:item.eFilhoDe="{ item }"
          >{{ !!item.dados.eFilhoDe.dados ? item.dados.eFilhoDe.dados : '' }}</template>

          <template v-slot:item.pca="{ item }">{{ !!item.dados.pca ? item.dados.pca.dados : '' }}</template>

          <template v-slot:item.validade="{ item }">
            <v-avatar size="25" color="green" v-if="item.cor == 'verde'"></v-avatar>
            <v-avatar size="25" color="red" v-else-if="item.cor == 'vermelho'"></v-avatar>
            <v-avatar size="25" color="amber" v-else-if="item.cor == 'amarelo'"></v-avatar>
          </template>

          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <VerHistoricoArea
                v-if="item.dados.tipo.dados != 'Série' && item.dados.tipo.dados != 'Subsérie'"
                :historico="item.dados"
              />
              <VerHistoricoSerie v-else :formaContagem="formaContagem" :historico="item.dados" />
            </td>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-row v-if="!!historico.UIs.dados[0]">
      <v-col cols="12">
        <v-divider></v-divider>
        <h5>Unidades de Instalação</h5>
        <v-data-table
          :headers="headersUI"
          :items="historico.UIs.dados"
          :footer-props="footer_props"
          :items-per-page="5"
          item-key="dados.codigo.dados"
          show-expand
          single-expand
        >
          <template v-slot:item.validade="{ item }">
            <v-avatar size="25" color="green" v-if="item.cor == 'verde'"></v-avatar>
            <v-avatar size="25" color="red" v-else-if="item.cor == 'vermelho'"></v-avatar>
            <v-avatar size="25" color="amber" v-else-if="item.cor == 'amarelo'"></v-avatar>
          </template>
          <template v-slot:item.codigo="{ item }">{{ item.dados.codigo.dados }}</template>

          <template v-slot:item.titulo="{ item }">{{ item.dados.titulo.dados }}</template>

          <template v-slot:item.classesAssociadas="{ item }">
            <ul style="list-style-type:none;" v-if="!!item.dados.classesAssociadas.dados[0]">
              <li v-for="(classe, i) in item.dados.classesAssociadas.dados" :key="i">
                <span style="padding-right: 10px;">
                  <img v-if="classe.tipo == 'Série'" style="width:23px; height:23px" :src="svg_sr" />
                  <img v-else style="width:23px; height:23px" :src="svg_ssr" />
                </span>
                <span>{{ classe.codigo }}</span>
              </li>
            </ul>
            <p v-else>
              <br />Não tem séries/subséries associadas!
            </p>
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <VerHistoricoUI :historico="item.dados" />
            </td>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import VerHistoricoCampo from "@/components/pedidos/analise/rada/generic/VerHistoricoCampo";
import VerHistoricoArea from "@/components/pedidos/analise/rada/generic/VerHistoricoArea";
import VerHistoricoSerie from "@/components/pedidos/analise/rada/generic/VerHistoricoSerie";
import VerHistoricoUI from "@/components/pedidos/analise/rada/generic/VerHistoricoUI";

export default {
  props: ["historico"],
  components: {
    VerHistoricoCampo,
    VerHistoricoArea,
    VerHistoricoSerie,
    VerHistoricoUI
  },
  data() {
    return {
      formaContagem: [],
      svg_sr: require("@/assets/common_descriptionlevel_sr.svg"),
      svg_ssr: require("@/assets/common_descriptionlevel_ssr.svg"),
      svg_N1: require("@/assets/n1.svg"),
      svg_N2: require("@/assets/n2.svg"),
      svg_N3: require("@/assets/n3.svg"),
      footer_props: {
        "items-per-page-options": [1, 5, 10, -1],
        "items-per-page-text": "Mostrar",
      },
      headers: [
        {
          sortable: false,
          value: "validade",
          align: "right",
          width: "5%",
          class: ["table-header", "body-2", "font-weight-bold"],
        },
        {
          text: "Tipo",
          sortable: false,
          value: "tipo",
          width: "10%",
          align: "center",
          class: ["table-header", "body-2", "font-weight-bold"],
        },
        {
          text: "Código",
          sortable: false,
          align: "center",
          width: "15%",
          value: "codigo",
          class: ["table-header", "body-2", "font-weight-bold"],
        },
        {
          text: "Título",
          sortable: false,
          align: "center",
          value: "titulo",
          width: "35%",
          class: ["table-header", "body-2", "font-weight-bold"],
        },
        {
          text: "PCA",
          sortable: false,
          align: "center",
          value: "pca",
          width: "10%",
          class: ["table-header", "body-2", "font-weight-bold"],
        },
        {
          text: "DF",
          sortable: false,
          align: "center",
          value: "df",
          width: "10%",
          class: ["table-header", "body-2", "font-weight-bold"],
        },
        {
          text: "Classe Pai",
          value: "eFilhoDe",
          sortable: false,
          align: "center",
          width: "10%",
          class: ["table-header", "body-2", "font-weight-bold"],
        },
        {
          text: "",
          value: "data-table-expand",
          width: "5%",
          class: ["table-header", "body-2", "font-weight-bold"],
        },
      ],
      headersUI: [
        {
          value: "validade",
          align: "center",
          width: "5%",
          sortable: false,
          class: ["table-header", "body-2", "font-weight-bold"],
        },
        {
          text: "Código",
          align: "center",
          value: "codigo",
          width: "10%",
          sortable: false,
          class: ["table-header", "body-2", "font-weight-bold"],
        },
        {
          text: "Título",
          value: "titulo",
          align: "center",
          width: "45%",
          sortable: false,
          class: ["table-header", "body-2", "font-weight-bold"],
        },
        {
          text: "Séries/Subséries Associadas",
          value: "classesAssociadas",
          align: "center",
          width: "35%",
          sortable: false,
          class: ["table-header", "body-2", "font-weight-bold"],
        },
        {
          text: "",
          value: "data-table-expand",
          width: "5%",
          class: ["table-header", "body-2", "font-weight-bold"],
        },
      ],
    };
  },
  async created() {
    let responseFC = await this.$request(
      "get",
      "/vocabularios/vc_pcaFormaContagem"
    );

    this.formaContagem = responseFC.data.map((item) => {
      return {
        label: item.termo,
        value: item.idtermo.split("#")[1],
      };
    });
  },
};
</script>