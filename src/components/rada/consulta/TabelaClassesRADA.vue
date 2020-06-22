<template>
  <div style="overflow: auto; width:100%;">
    <v-data-table
      flat
      :style="`background-color:${!!background_color ? background_color : '#ffffff;'} `"
      :headers="headers"
      :items="classes"
      class="elevation-1 mytable"
      :footer-props="footer_props"
      @click:row="editarClasse"
      :search="search"
      :items-per-page="5"
      dense
    >
      <template v-slot:item.tipo="{ item }">
        <img v-if="item.tipo == 'Série'" style="width:23px; height:30px" :src="svg_sr" />
        <img v-else-if="item.tipo == 'Subsérie'" style="width:23px; height:30px" :src="svg_ssr" />
        <i v-else>{{ item.tipo }}</i>
      </template>
      <template v-slot:item.produtoras="{ item }">
        <ul>
          <li
            v-for="(tipologia, i) in item.tipologiasProdutoras"
            :key="i"
          >{{ tipologia.split(' - ')[0]}}</li>
        </ul>
        <ul>
          <li v-for="(entidade, i) in item.entProdutoras" :key="i">{{ entidade.split(' - ')[0]}}</li>
        </ul>
      </template>
      <template v-slot:item.legislacao="{ item }">
        <ul>
          <li v-for="(leg, i) in item.legislacao" :key="i">{{ leg.legislacao.split(' - ')[0] }}</li>
        </ul>
      </template>
      <template v-slot:item.suporte_e_medicao="{ item }">
        <ul>
          <li
            v-for="(valores, i) in item.suporte_e_medicao"
            :key="i"
          >{{ valores.suporte + ": " + valores.medicao}}</li>
        </ul>
      </template>
      <template v-slot:item.relacoes="{ item }">
        <ul>
          <li v-for="(rel, i) in item.relacoes" :key="i">
            <b>{{ rel.relacao }}</b>
            - {{rel.serieRelacionada.codigo }}
          </li>
        </ul>
      </template>
      <template v-slot:item.justificacaoPCA="{ item }">
        <ul>
          <li v-for="(criterio, i) in item.justificacaoPCA" :key="i">
            <b>{{ criterio.tipo }}</b>
            - {{ criterio.nota}}
            <i
              v-for="(rel, j) in criterio.relacoes"
              :key="j"
            >{{rel.codigo }}</i>
          </li>
        </ul>
      </template>

      <template v-slot:item.justificacaoDF="{ item }">
        <ul>
          <li v-for="(criterio, i) in item.justificacaoDF" :key="i">
            <b>{{ criterio.tipo }}</b>
            - {{ criterio.nota}}
            <i
              v-for="(rel, j) in criterio.relacoes"
              :key="j"
            >{{rel.codigo }}</i>
          </li>
        </ul>
      </template>

      <template v-slot:item.completo="{ item }">
        <v-icon
          color="red"
          v-if="(item.tipo == 'Série' && (item.eFilhoDe == null || (item.temDF && !!!item.children[0]))) || (item.tipo == 'Subsérie' && (item.eFilhoDe == null || item.temDF)) || (item.eFilhoDe == null &&
                    (item.tipo == 'N2' || item.tipo == 'N3'))"
        >report</v-icon>
      </template>

      <template v-slot:item.formaContagem="{ item }">
        {{ !!item.formaContagem ? (!!item.formaContagem.forma ? descobrirForma(item.formaContagem.forma): '') : '' }}
        <br />
        {{ !!item.formaContagem ? (!!item.formaContagem.subforma ? descobrirSubforma(item.formaContagem.subforma): '') : '' }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  props: ["classes", "formaContagem", "background_color", "search"],
  methods: {
    descobrirForma(forma) {
      let forma_certa = this.formaContagem.formasContagem.find(
        e => e.value == forma
      );

      return "Forma: " + forma_certa.label;
    },
    descobrirSubforma(subforma) {
      let subforma_certa = this.formaContagem.subFormasContagem.find(
        e => e.value == subforma
      );
      return "Subforma: " + subforma_certa.label.split(": ")[1];
    },
    editarClasse(item) {
      this.$emit("editarClasse", {
        tipo: item.tipo,
        titulo: item.titulo,
        codigo: item.codigo,
        children: [this.classes.find(e => e.eFilhoDe == item.codigo)],
        temDF: Boolean(
          (!Boolean(item.df) && !Boolean(item.notaDF)) ||
            (!Boolean(item.pca) && !Boolean(item.notaPCA)) ||
            item.formaContagem.forma == null
        )
      });
    }
  },
  data: () => ({
    footer_props: {
      "items-per-page-options": [1, 5, 10, -1],
      "items-per-page-text": "Mostrar"
    },
    svg_sr: require("@/assets/common_descriptionlevel_sr.svg"),
    svg_ssr: require("@/assets/common_descriptionlevel_ssr.svg"),
    class: ["table-header", "body-2", "font-weight-bold"],
    headers: [
      {
        text: "Tipo",
        sortable: true,
        value: "tipo",
        align: "center",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Código",
        sortable: true,
        align: "center",
        value: "codigo",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Título",
        sortable: true,
        align: "center",
        value: "titulo",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Descrição",
        align: "left",
        sortable: true,
        align: "center",
        value: "descricao",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Data Inicial",
        align: "left",
        sortable: true,
        align: "center",
        value: "dataInicial",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Data Final",
        align: "left",
        sortable: true,
        align: "center",
        value: "dataFinal",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Tipo de Unidade Arquivistica",
        align: "left",
        sortable: true,
        align: "center",
        value: "tUA",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Tipo Serie",
        align: "left",
        sortable: true,
        align: "center",
        value: "tSerie",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Suporte e Medição",
        align: "left",
        sortable: true,
        align: "center",
        value: "suporte_e_medicao",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Unidades de Instalação",
        align: "left",
        sortable: false,
        align: "center",
        value: "UIs",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Localização",
        align: "left",
        sortable: false,
        align: "center",
        value: "localizacao",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Produtoras",
        align: "left",
        sortable: false,
        align: "center",
        value: "produtoras",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Legislação",
        align: "left",
        sortable: false,
        align: "center",
        value: "legislacao",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Relações",
        align: "left",
        sortable: false,
        align: "center",
        value: "relacoes",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "PCA",
        align: "left",
        sortable: true,
        align: "center",
        value: "pca",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Nota PCA",
        align: "left",
        sortable: true,
        align: "center",
        value: "notaPCA",
        class: ["table-header", "body-2", "font-weight-bold"]
      },

      {
        text: "Forma Contagem PCA",
        align: "left",
        sortable: false,
        align: "center",
        value: "formaContagem",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Justificação PCA",
        align: "left",
        sortable: false,
        align: "center",
        value: "justificacaoPCA",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "DF",
        align: "left",
        sortable: true,
        align: "center",
        value: "df",
        class: ["table-header", "body-2", "font-weight-bold"]
      },

      {
        text: "Nota DF",
        align: "left",
        sortable: true,
        align: "center",
        value: "notaDF",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Justificação DF",
        align: "left",
        sortable: false,
        align: "center",
        value: "justificacaoDF",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Pai",
        sortable: true,
        align: "center",
        value: "eFilhoDe",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        sortable: true,
        align: "center",
        value: "completo",
        class: ["table-header", "body-2", "font-weight-bold"]
      }
    ]
  })
};
</script>
<style scoped>
.mytable table tr {
  background-color: #333;
  overflow: auto;
  white-space: nowrap;
}
</style>
