<template>
  <div class="ma-1" v-if="auto.zonaControlo[index].agregacoes.length>0">
    <v-row justify="space-between" class="info-label">
      <v-col>Lista de Agregações:</v-col>
      <v-col>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Procura"
          single-line
          hide-details
        ></v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      :headers="cabecalho"
      :items="auto.zonaControlo[index].agregacoes"
      :items-per-page="5"
      class="elevation-1 ma-4"
      :footer-props="footer_props"
      :search="search"
    >
      <template v-slot:item.action="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" small class="mr-2" @click="editAG = true">edit</v-icon>
          </template>
          <span>Editar Agregação</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" small @click="deleteObj=item; deleteDialog=true">delete</v-icon>
          </template>
          <span>Remover Agregação</span>
        </v-tooltip>
        <v-dialog v-model="editAG" max-width="80%">
          <DialogAgregacao 
            v-bind:auto="auto"
            v-bind:index="index"
            v-bind:agregacao="item"
            v-bind:indexAg="auto.zonaControlo[index].agregacoes.map(function(x) {return x.codigo}).indexOf(item.codigo)"
            v-bind:closeAg="closeAg"
          />
        </v-dialog>
        <v-dialog v-model="deleteDialog" width="700" persistent>
          <v-card outlined>
          <v-card-title
            class="red darken-4 title white--text"
            dark
          >Comfirmação para remover Agregação</v-card-title>

          <v-card-text>
            <div class="subtitle-1" style="white-space: pre-wrap">Este método remove <strong>permanentemente</strong> a agregação.</div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn color="green darken-4" text @click="deleteDialog = false">Fechar</v-btn>
            <v-btn color="red darken-4" text @click="deleteAG">Confirmar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      </template>
    </v-data-table>
    <v-snackbar
      v-model="snackbar"
      color="success"
    >
      Agregação editada com sucesso!
      <v-btn
        dark
        text
        @click="snackbar = false"
      >
        Fechar
      </v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import DialogAgregacao from "@/components/autosEliminacao/criacao/DialogAgregacao.vue"

export default {
  props: ["auto","index"],

  components: {
    DialogAgregacao
  },

  data: () => ({
    editAG: false,
    snackbar: false,
    search: "",
    deleteDialog: false,
    deleteObj: null,
    cabecalho: [
      {text: 'Código', align: 'left', sortable: false, value: 'codigo'},
      {text: 'Título', align: 'left', value: 'titulo'},
      {text: 'Data de Contagem', align: 'center', value: 'dataContagem'},
      {text: 'Natureza de Intervenção', align: 'center', value: 'ni'},
      {text: 'Ações', align: 'center' , sortable: false, value: 'action'}
    ],
    footer_props: {
      "items-per-page-text": "Mostrar"
    },
  }),
  methods: {
    deleteAG: function () {
      var indexAG = this.auto.zonaControlo[this.index].agregacoes.map(function(x) {return x.codigo}).indexOf(this.deleteObj.codigo)
      this.auto.zonaControlo[this.index].agregacoes.splice(indexAG,1)
      this.deleteDialog = false;
    },
    closeAg: function() {
      this.editAG = false
      this.snackbar = true
    }
  }
}
</script>