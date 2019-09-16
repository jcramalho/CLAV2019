<template>
  <v-row>
    <v-col cols="12" md="2">
      <v-subheader
        class="info-label"
        style="border-color: white; border-style:solid; color: #1A237E;"
      >Tipologias selecionadas:</v-subheader>
    </v-col>
    <v-col xs="9" md="9" v-if="tipologias.length > 0">
      <v-data-table :headers="headers" :items="tipologias" class="elevation-1" hide-default-footer>
         <template v-slot:headers="props">
          <tr>
            <th
              v-for="h in props.headers"
              :key="h.text"
              style="color: #1A237E;"
            >{{ h.text }}</th>
          </tr>
        </template>

        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.sigla }}</td>
            <td>{{ props.item.designacao }}</td>
            <td>
              <v-btn small color="red darken-2" dark rounded @click="unselectTipologia(props.item)">
                <v-icon dark>remove_circle</v-icon>
              </v-btn>
            </td>
          </tr> 
        </template>
        
      </v-data-table>
    </v-col>
    <v-col xs="9" md="9" v-else>
      <v-alert :value="true" type="warning">Não tem tipologias selecionadas...</v-alert>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["tipologias"],

  data: function() {
    return {
      headers: [
        { text: "Sigla", align: "left", value: "sigla" },
        { text: "Designação", value: "designacao" },
        { text: "Remover" }
      ]
    };
  },

  methods: {
    unselectTipologia: function(tipologia) {
      this.$emit("unselectTipologia", tipologia);
    }
  }
};
</script>

