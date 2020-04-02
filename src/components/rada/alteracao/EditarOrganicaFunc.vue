<template>
  <v-dialog v-model="dialog" persistent>
    <template v-slot:activator="{ on }">
      <b text depressed @click="filterSeries" v-on="on">{{ treeview_object.titulo }}</b>
    </template>
    <v-card>
      <v-card-title class="indigo darken-1 white--text">
        <b>{{ 'Alterar a classe: ' + treeview_object.titulo }}</b>
        <v-spacer />
        <v-icon dark color="red" @click="toDelete = true" right>delete_sweep</v-icon>
      </v-card-title>
      <br />
      <v-card-text>
        <v-row>
          <v-dialog v-model="toDelete" width="50%">
            <v-card>
              <v-card-title
                class="headline grey lighten-2"
                primary-title
              >Pretende mesmo eliminar a classe {{ treeview_object.titulo }} ?</v-card-title>

              <v-card-text align="center">
                <br />
                <v-btn class="ma-3 pa-3" color="indigo lighten-3" @click="toDelete = false">Voltar</v-btn>
                <v-btn class="ma-3 pa-5" color="red lighten-1" @click="eliminarClasse">Sim</v-btn>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-row>
        <v-form ref="form" :lazy-validation="false">
          <v-row>
            <v-col md="3" sm="3">
              <div class="info-label">Código</div>
            </v-col>
            <v-col sm="3" md="3">
              <v-text-field disabled v-model="classe.codigo" solo></v-text-field>
            </v-col>
            <v-col xs="3" sm="3">
              <div class="info-label">Título</div>
            </v-col>
            <v-col sm="3" md="3">
              <v-text-field v-model="classe.titulo" solo></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="3" sm="3">
              <div class="info-label">Descrição</div>
            </v-col>
            <v-col sm="9" md="9">
              <v-text-field
                v-model="classe.descricao"
                :rules="[v => !!v || 'Campo obrigatório!']"
                label="Descrição"
                solo
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <h5>Hierarquia</h5>
          <v-divider></v-divider>

          <v-row>
            <v-col md="3" sm="3">
              <div class="info-label">Classe Pai</div>
            </v-col>
            <v-col sm="9" md="9">
              <v-autocomplete
                disabled
                v-model="classe.eFilhoDe"
                :items="classesHierarquia"
                item-text="titulo"
                item-value="codigo"
                dense
                solo
                clearable
                placeholder="Classe Pai"
                chips
              >
                <template v-slot:item="{ item }">{{ item.codigo }} - {{ item.titulo }}</template>
                <template v-slot:selection="{ item }">
                  <v-chip>{{ item.codigo }} - {{ item.titulo }}</v-chip>
                </template>
                <template v-slot:no-data>
                  <v-container fluid>
                    <v-alert
                      :value="true"
                      color="red lighten-3"
                      icon="warning"
                    >Sem classes mais Área Orgânico-Funcional!</v-alert>
                  </v-container>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <!-- <v-btn color="indigo darken-4" text @click="apagar">
          <v-icon>delete_sweep</v-icon>
        </v-btn>-->
        <v-btn color="indigo darken-4" outlined text @click="dialog = false">Voltar</v-btn>

        <v-btn color="success" class="mr-4" @click="save">Atualizar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["treeview_object", "classes"],
  data: () => ({
    toDelete: false,
    dialog: false,
    classesHierarquia: [],
    classe: {}
  }),
  methods: {
    filterSeries() {
      // ir buscar o verdadeiro objeto
      let classe_area_organico = this.classes.find(
        e => e.codigo == this.treeview_object.codigo
      );

      // Clone
      this.classe = Object.assign({}, classe_area_organico);

      this.classesHierarquia = this.classes
        .filter(
          classe =>
            classe.tipo != "Série" &&
            classe.tipo != "Subsérie" &&
            classe.codigo != classe_area_organico.codigo
        )
        .sort((a, b) => a.codigo.localeCompare(b.codigo));
    },
    save() {
      this.$emit("atualizacao", this.classe);
      this.dialog = false;
    },
    eliminarClasse(){
      this.$emit("remover", this.classe);
      // this.toDelete = false;
      this.dialog = false;
    }
  }
};
</script>
