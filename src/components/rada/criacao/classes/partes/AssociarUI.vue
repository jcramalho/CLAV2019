<template>
  <div>
    <v-row>
      <v-col md="3" sm="3">
        <div class="info-label">Unidades de Instalação</div>
      </v-col>
      <v-col md="9" sm="9" xs="12">
        <!-- {{newSerie.UIs}} -->
        <v-combobox
          v-model="newSerie.UIs"
          :items="getCodigos"
          label="Unidades de Instalação"
          clearable
          multiple
          item-text="searchField"
          item-value="codigo"
          chips
          solo
          deletable-chips
          :return-object="false"
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <strong>Unidade de Instalação</strong> em questão não existe
                  no sistema!
                </v-list-item-title>
                <v-list-item-subtitle>
                  Pode criar aqui uma nova unidade de instalação. Para tal,
                  escreva o código da nova UI e prima a tecla "
                  <i>Enter</i>".
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-combobox>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["newSerie", "UIs"],
  computed: {
    getCodigos() {
      return this.UIs.map(e => {
        return {
          codigo: e.codigo,
          searchField: e.codigo + " - " + e.titulo
        };
      });
    }
  }
};
</script>
