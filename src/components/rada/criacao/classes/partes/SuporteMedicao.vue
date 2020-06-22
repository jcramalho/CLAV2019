<template>
  <v-card outlined>
    <v-row v-for="(valores, i) in newSerie.suporte_e_medicao" :key="i">
      <v-col md="3" sm="3">
        <div class="info-label">Suporte ({{ i+1 }})</div>
      </v-col>
      <v-col sm="3" md="3">
        <v-select
          :rules="[v => !!v || 'Campo obrigatório!']"
          :items="suporte_items"
          solo
          clearable
          v-model="valores.suporte"
          label="Suporte"
        ></v-select>
      </v-col>
      <v-col md="3" sm="3">
        <div class="info-label">Medição ({{ i+1 }})</div>
      </v-col>
      <v-col sm="2" md="2">
        <v-text-field
          :rules="[v => (!!v && new Number(v) >= 0) || 'Campo obrigatório!']"
          type="number"
          solo
          clearable
          v-model="valores.medicao"
          label="Medição"
        ></v-text-field>
      </v-col>
      <v-col sm="1" md="1">
        <v-tooltip bottom v-if="i == newSerie.suporte_e_medicao.length - 1">
          <template v-slot:activator="{ on }">
            <v-btn text rounded @click="add()" v-on="on">
              <v-icon size="25" color="green lighten-1">add_circle</v-icon>
            </v-btn>
          </template>
          <span>Clique para adicionar novo suporte e medição!</span>
        </v-tooltip>
        <v-tooltip bottom v-if="i != 0">
          <template v-slot:activator="{ on }">
            <v-btn text rounded @click="remove(i)" v-on="on">
              <v-icon size="25" color="red lighten-1">remove_circle</v-icon>
            </v-btn>
          </template>
          <span>Clique para remover o suporte e medição!</span>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: ["newSerie"],
  data: () => ({
    suporte_items: [
      "Eletrónico Digitalizado",
      "Eletrónico Nativo",
      "Papel",
      "Outro"
    ]
  }),
  methods: {
    add() {
      this.newSerie.suporte_e_medicao.push({ suporte: null, medicao: null });
    },
    remove(index) {
      this.newSerie.suporte_e_medicao.splice(index, 1);
    }
  }
};
</script>
