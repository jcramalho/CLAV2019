<template>
  <v-card class="ma-4" style="background-color:#fafafa">
    <v-card-title
      class="indigo darken-4 white--text"
    >Relatório de Avaliação de Documentação Acumulada: {{rada.titulo}}</v-card-title>
    <v-card-text>
      <InformacaoGeral :rada="rada" />
      <v-expansion-panels>
        <v-expansion-panel class="ma-1">
          <v-expansion-panel-header
            class="pa-2 indigo darken-4 title white--text"
          >Relatório Expositivo</v-expansion-panel-header>
          <v-expansion-panel-content>
            <RelatorioExpositivo :rada="rada" />
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel class="ma-1">
          <v-expansion-panel-header class="pa-2 indigo darken-4 title white--text">Tabela de Seleção</v-expansion-panel-header>
          <v-expansion-panel-content>
            <TabelaSelecao :rada="rada" />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <!-- <p>{{rada}}</p> -->
    </v-card-text>
  </v-card>
</template>

<script>
import InformacaoGeral from "@/components/rada/consulta/elementos/InformaçãoGeral.vue";
import RelatorioExpositivo from "@/components/rada/consulta/elementos/RelatorioExpositivo.vue";
import TabelaSelecao from "@/components/rada/consulta/elementos/TabelaSelecao.vue";

export default {
  data: () => ({
    rada: {}
  }),
  components: {
    InformacaoGeral,
    RelatorioExpositivo,
    TabelaSelecao
  },
  async mounted() {
    var response = await this.$request("get", "/rada/" + this.$route.params.id);
    this.rada = response.data;

    this.rada.tsRada.forEach(async e => {
      let pai = e.pai.split("_");
      e.pai = pai[pai.length - 1];

      if (!Boolean(e.tipo)) {
        let tipo = e.classes.split("_");
        e["tipo"] = tipo[tipo.length - 2];
      }

       this.rada.tsRadaArv = await this.preparaTree();
    });
  },
  methods: {
     preparaTree() {
      var myTree = [];

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.rada.tsRada.sort((a, b) => a.codigo.localeCompare(b.codigo));

      for (var i = 0; i < this.rada.tsRada.length; i++) {
        if (this.rada.tsRada[i].pai == null) {
          myTree.push({
            codigo: this.rada.tsRada[i].codigo,
            titulo: this.rada.tsRada[i].titulo,
            tipo: this.rada.tsRada[i].tipo,
            eFilhoDe: this.rada.tsRada[i].pai,
            children: this.preparaTreeFilhos(
              this.rada.tsRada[i].codigo,
              this.rada.tsRada[i].titulo
            )
          });
        }
      }
      return myTree;
    },
    preparaTreeFilhos: function(pai_codigo, pai_titulo) {
      let children = [];

      for (let i = 0; i < this.rada.tsRada.length; i++) {
        if (this.rada.tsRada[i].pai == pai_codigo) {
          children.push({
            codigo: this.rada.tsRada[i].codigo,
            titulo: this.rada.tsRada[i].titulo,
            tipo: this.rada.tsRada[i].tipo,
            eFilhoDe: this.rada.tsRada[i].pai + " - " + pai_titulo,
            children: this.preparaTreeFilhos(
              this.rada.tsRada[i].codigo,
              this.rada.tsRada[i].titulo
            )
          });
        }
      }

      return children;
    }
  }
};
</script>