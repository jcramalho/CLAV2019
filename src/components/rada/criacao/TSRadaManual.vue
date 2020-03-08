<template>
  <v-card flat class="mb-12">
    <v-form ref="form" :lazy-validation="false">
      <v-row>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Título</div>
        </v-col>
        <v-col xs="12" sm="9">
          <v-text-field
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="TS.titulo"
            label="Título da TS"
            solo
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" xs="12" sm="12">
          <AddOrgFunc :classes="TS.classes" />
          <Serie :classes="TS.classes" :legislacao="legislacao" :RE="RE" />
          <SubSerie :classes="TS.classes" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="12">
          <v-treeview v-if="TS.classes.length > 0" hoverable :items="preparaTree" item-key="titulo">
            <template v-slot:label="{ item }">
              <EditarSerie
                v-if="item.tipo == 'Série'"
                @atualizacao="atualizacao_serie"
                :treeview_object="item"
                :classes="TS.classes"
                :legislacao="legislacao"
                :RE="RE"
              />
              <EditarSubserie v-else-if="item.tipo == 'Subsérie'" :treeview_object="item" />
              <!-- <Editar
                v-else-if="item.tipo == ''"
                :treeview_object="item"
                :classes="TS.classes"
                :legislacao="legislacao"
                :RE="RE"
              />-->
              <EditarOrganicaFunc
                v-else
                @atualizacao="atualizacao_area_organico"
                :classes="TS.classes"
                :treeview_object="item"
              />
            </template>
          </v-treeview>
          <v-alert
            class="text-center"
            v-else
            :value="true"
            color="amber accent-3"
            icon="warning"
          >Sem Classes! É obrigatório adicionar.</v-alert>
          <br />
        </v-col>
      </v-row>
    </v-form>
    <v-btn dark color="indigo darken-1" @click="sendToFather()">Concluir</v-btn>
    <v-btn @click="$emit('voltar', 2)">Voltar</v-btn>
    <v-btn color="indigo darken-4" text @click="apagar">
      <v-icon>delete_sweep</v-icon>
    </v-btn>
  </v-card>
</template>

<script>
import AddOrgFunc from "@/components/rada/criacao/classes/OrganicaFunc";
import Serie from "@/components/rada/criacao/classes/Serie";
import SubSerie from "@/components/rada/criacao/classes/Subserie";
import EditarOrganicaFunc from "@/components/rada/alteracao/EditarOrganicaFunc";
import EditarSerie from "@/components/rada/alteracao/EditarSerie";
import EditarSubserie from "@/components/rada/alteracao/EditarSubserie";
// import Editar from "@/components/rada/alteracao/Editar";

export default {
  props: ["TS", "entidades", "RE", "legislacao"],
  components: {
    AddOrgFunc,
    Serie,
    SubSerie,
    EditarOrganicaFunc,
    EditarSubserie,
    EditarSerie
    // Editar
  },
  computed: {
    preparaTree() {
      var myTree = [];

      for (var i = 0; i < this.TS.classes.length; i++) {
        if (
          this.TS.classes[i].eFilhoDe == null ||
          this.TS.classes[i].eFilhoDe == ""
        ) {
          myTree.push({
            codigo: this.TS.classes[i].codigo,
            titulo:
              this.TS.classes[i].codigo + " - " + this.TS.classes[i].titulo,
            tipo: this.TS.classes[i].tipo,
            children: this.preparaTreeFilhos(this.TS.classes[i].codigo)
          });
        }
      }
      return myTree;
    }
  },
  methods: {
    preparaTreeFilhos: function(pai) {
      let children = [];

      for (let i = 0; i < this.TS.classes.length; i++) {
        if (this.TS.classes[i].eFilhoDe == pai) {
          children.push({
            codigo: this.TS.classes[i].codigo,
            titulo:
              this.TS.classes[i].codigo + " - " + this.TS.classes[i].titulo,
            tipo: this.TS.classes[i].tipo,
            children: this.preparaTreeFilhos(this.TS.classes[i].codigo)
          });
        }
      }

      return children;
    },
    apagar: function() {
      this.$refs.form.reset();
    },
    sendToFather: function() {
      if (this.$refs.form.validate() && this.TS.classes[0]) {
        this.$emit("done");
      }
    },
    deleteItem(item) {
      const index = this.TS.classes.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.TS.classes.splice(index, 1);
    },
    atualizacao_area_organico(c) {
      let area_organico = this.TS.classes.find(e => e.codigo == c.codigo);

      area_organico.descricao = c.descricao;
    },
    async atualizacao_serie(c) {
      let serie_classe = this.TS.classes.find(e => e.codigo == c.codigo);
      // FAZER LIGAÇÕES
      serie_classe.relacoes = await this.editaRelacoes(serie_classe, c);

      serie_classe.titulo = c.titulo;
      serie_classe.descricao = c.descricao;
      serie_classe.dataInicial = c.dataInicial;
      serie_classe.dataFinal = c.dataFinal;
      serie_classe.tUA = c.tUA;
      serie_classe.tSerie = c.tSerie;
      serie_classe.suporte = c.suporte;
      serie_classe.medicao = c.medicao;
      serie_classe.localizacao = c.localizacao;
      serie_classe.entProdutoras = c.entProdutoras;
      serie_classe.tipologiasProdutoras = c.tipologiasProdutoras;
      serie_classe.legislacao = c.legislacao;
      serie_classe.pca = c.pca;
      serie_classe.formaContagem = c.formaContagem;
      serie_classe.notas = c.notas;
      serie_classe.justicacaoPCA = c.justicacaoPCA;
      serie_classe.df = c.df;
      serie_classe.justificacaoDF = c.justificacaoDF;
      serie_classe.eFilhoDe = c.eFilhoDe;
    },
    async editaRelacoes(serie_classe, c) {
      let novo_relacoes = [];

      /*
      
        Iterar o array alterado pelo utilizador

      */
      for (let i = 0; i < c.relacoes.length; i++) {
        let relacao_igual = serie_classe.relacoes.find(
          rel =>
            rel.relacao == c.relacoes[i].relacao &&
            rel.serieRelacionada.codigo == c.relacoes[i].serieRelacionada.codigo
        );

        if (relacao_igual != undefined) {
          novo_relacoes.push(relacao_igual);
        } else {
          await this.adicionaRelacoesInversas(c.relacoes[i], serie_classe);
          novo_relacoes.push(c.relacoes[i]);
        }
      }

      /*
      
        Iterar o array original de relacoes

      */
      for (let j = 0; j < serie_classe.relacoes.length; j++) {
        let relacao_igual = c.relacoes.find(
          rel =>
            rel.relacao == serie_classe.relacoes[j].relacao &&
            rel.serieRelacionada.codigo ==
              serie_classe.relacoes[j].serieRelacionada.codigo
        );

        if (relacao_igual == undefined) {
          await this.removeRelacoesInversas(
            serie_classe.relacoes[j],
            serie_classe
          );
        }
      }
      return novo_relacoes;
    },
    async adicionaRelacoesInversas(relacao, serie_classe) {
      let classe_relacionada = await this.TS.classes.find(
        e => e.codigo == relacao.serieRelacionada.codigo
      );

      if (classe_relacionada == undefined) {
        if (relacao.serieRelacionada.tipo == "Série") {
          classe_relacionada = {
            codigo: relacao.serieRelacionada.codigo,
            titulo: relacao.serieRelacionada.titulo,
            descricao: "",
            dataInicial: "",
            dataFinal: "",
            tUA: "",
            tSerie: "",
            suporte: "",
            medicao: "",
            localizacao: [],
            entProdutoras: [],
            tipologiasProdutoras: [],
            legislacao: [],
            relacoes: [],
            pca: "",
            formaContagem: "",
            justicacaoPCA: "",
            df: "",
            justificacaoDF: "",
            notas: "",
            eFilhoDe: "",
            tipo: "Série"
          };
        } else {
          classe_relacionada = {
            codigo: relacao.serieRelacionada.codigo,
            titulo: relacao.serieRelacionada.titulo,
            descricao: "",
            dataInicial: "",
            dataFinal: "",
            relacoes: [],
            pca: "",
            formaContagem: "",
            justicacaoPCA: "",
            df: "",
            justificacaoDF: "",
            notas: "",
            eFilhoDe: "",
            tipo: "Subsérie"
          };
        }

        this.TS.classes.push(classe_relacionada);
      }

      let relacao_inversa = "";

      switch (relacao.relacao) {
        case "Antecessora de":
          relacao_inversa = "Sucessora de";
          break;
        case "Sucessora de":
          relacao_inversa = "Antecessora de";
          break;
        case "Complementar de":
          relacao_inversa = "Complementar de";
          break;
        case "Sintetizado por":
          relacao_inversa = "Síntese de";
          break;
        case "Síntese de":
          relacao_inversa = "Sintetizado por";
          break;
        case "Suplemento de":
          relacao_inversa = "Suplemento para";
          break;
        case "Suplemento para":
          relacao_inversa = "Suplemento de";
          break;
      }

      let existe_repetida = await classe_relacionada.relacoes.find(
        e =>
          e.relacao == relacao_inversa &&
          e.serieRelacionada.codigo == serie_classe.codigo
      );

      if (existe_repetida == undefined) {
        classe_relacionada.relacoes.push({
          relacao: relacao_inversa,
          serieRelacionada: {
            codigo: serie_classe.codigo,
            titulo: serie_classe.titulo
          }
        });
      }
    },
    async removeRelacoesInversas(relacao, serie_classe) {
      let classe_relacionada = await this.TS.classes.find(
        e => e.codigo == relacao.serieRelacionada.codigo
      );

      let relacao_inversa = "";

      switch (relacao.relacao) {
        case "Antecessora de":
          relacao_inversa = "Sucessora de";
          break;
        case "Sucessora de":
          relacao_inversa = "Antecessora de";
          break;
        case "Complementar de":
          relacao_inversa = "Complementar de";
          break;
        case "Sintetizado por":
          relacao_inversa = "Síntese de";
          break;
        case "Síntese de":
          relacao_inversa = "Sintetizado por";
          break;
        case "Suplemento de":
          relacao_inversa = "Suplemento para";
          break;
        case "Suplemento para":
          relacao_inversa = "Suplemento de";
          break;
      }

      // console.log(JSON.stringify(classe_relacionada.relacoes));
      classe_relacionada.relacoes = await classe_relacionada.relacoes.filter(
        e => {
          // console.log(relacao_inversa)
          // console.log(serie_classe.codigo)
          // console.log(
          //   e.relacao != relacao_inversa &&
          //     e.serieRelacionada.codigo != serie_classe.codigo
          // );
          return (
            e.relacao != relacao_inversa ||
            e.serieRelacionada.codigo != serie_classe.codigo
          );
        }
      );
    }
  }
};
</script>

<style scoped>
::v-deep .v-treeview-node {
  background-color: rgba(240, 163, 10, 0.2);
  /* background-color: rgba(0, 0, 0, 0.1); */
}
</style>
