<template>
  <v-dialog v-model="dialog">
    <template v-slot:activator="{ on }">
      <b text depressed v-on="on">{{ treeview_object.titulo }}</b>
      <!-- @click="filterSeries" -->
    </template>
    <v-card>
      <v-card-title class="indigo darken-1 white--text">
        <b>{{ 'Alterar a série: ' + treeview_object.titulo }}</b>
      </v-card-title>
      <br />
      <!-- <v-card-text>
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
              <v-text-field disabled v-model="classe.titulo" solo></v-text-field>
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
                :items="classesFiltradas"
                item-text="titulo"
                item-value="codigo"
                dense
                solo
                clearable
                placeholder="Classe Pai"
                chips
              >
                <template v-slot:item="{ item }">{{ item.codigo }} - {{ item.titulo }}</template>
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
         <v-btn color="indigo darken-4" text @click="apagar">
          <v-icon>delete_sweep</v-icon>
      </v-btn>
        <v-btn color="indigo darken-4" outlined text @click="dialog = false">Cancelar</v-btn>

        <v-btn color="success" class="mr-4" @click="save">Atualizar</v-btn>
      </v-card-actions>-->
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["treeview_object"],
  data: () => ({
    dialog: false
  })
};
</script>