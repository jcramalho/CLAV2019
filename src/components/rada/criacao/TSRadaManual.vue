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
          <Serie :classes="TS.classes" :entidades="entidades" :legislacao="legislacao" />
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
                :entidades="entidades"
                :legislacao="legislacao"
              />
              <EditarSubserie v-else-if="item.tipo == 'Subsérie'" :treeview_object="item" />
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

export default {
  props: ["TS", "entidades"],
  components: {
    AddOrgFunc,
    Serie,
    SubSerie,
    EditarOrganicaFunc,
    EditarSubserie,
    EditarSerie
  },
  data: () => {
    return {
      legislacao: []
    };
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
  created: async function() {
    let response = await this.$request("get", "/api/legislacao");
    this.legislacao = response.data;
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
    atualizacao_serie(c) {
      let serie_classe = this.TS.classes.find(e => e.codigo == c.codigo);
      // FAZER LIGAÇÕES

      serie_classe.titulo = c.titulo;
      // codigo: "",
      //   titulo: "",
      //   descricao: "",
      //   dataInicial: "",
      //   dataFinal: "",
      //   tUA: "",
      //   tSerie: "",
      //   suporte: "",
      //   medicao: "",
      //   localizacao: [],
      //   produtoras: [],
      //   legislacao: [],
      //   relacoes: [],
      //   pca: "",
      //   formaContagem: "",
      //   justicacaoPCA: "",
      //   df: "",
      //   justificacaoDF: "",
      //   notas: "",
      //   eFilhoDe: "",
      //   tipo: "Série"
      // console.log(serie_classe, c);
    }
  }
};
</script>

<style scoped>
::v-deep .v-treeview-node {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>