<template>
  <v-container fluid class="pa-0 ma-0" style="max-width:100%;">
    <v-row
      :class="{
        'mt-4': $vuetify.breakpoint.smAndDown,
        'mt-5': $vuetify.breakpoint.mdAndUp
      }"
    >
      <v-col cols="12" lg="2">
        <div class="info-label">
          Tipologias selecionadas
        </div>
      </v-col>
      <v-col cols="12" lg="10" v-if="tipologias.length > 0">
        <div class="info-content">
          <v-data-table
            class="content-table pa-4"
            :headers="headers"
            :items="tipologias"
            :items-per-page="100"
            hide-default-footer
          >
            <template v-slot:headers="props">
              <tr>
                <th v-for="h in props.headers" :key="h.text" class="subtitle-2">
                  {{ h.text }}
                </th>
              </tr>
            </template>

            <template v-slot:item="props">
              <tr>
                <td style="color: #1A237E;">{{ props.item.sigla }}</td>
                <td style="color: #1A237E;">{{ props.item.designacao }}</td>
                <td>
                  <v-btn
                    icon
                    color="red darken-2"
                    @click="unselectTipologia(props.item)"
                  >
                    <unicon
                      name="remove-icon"
                      width="15"
                      height="15"
                      viewBox="0 0 20.71 20.697"
                      fill="#ff5252"
                    />
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </v-col>
      <v-col v-else>
        <v-alert :value="true" type="warning" style="border-radius: 40px;"
          >Não tem tipologias selecionadas...</v-alert
        >
      </v-col>
    </v-row>
  </v-container>
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

<style scoped>
.info-label {
  color: #1a237e !important;
  padding: 8px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
  text-align: center;
}
.info-content {
  width: 100%;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
}
.content-table {
  background-color: #f1f6f8 !important;
  border-radius: 10px;
}
tr:hover {
  background-color: #eaeef9 !important;
}
</style>
