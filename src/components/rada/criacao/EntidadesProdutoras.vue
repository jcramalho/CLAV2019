<template>
  <div>
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Entidades Produtoras</div>
      </v-col>
      <v-col cols="12" xs="12" sm="9">
        <v-data-table
          v-if="!!newSerie.produtoras[0]"
          :headers="headersDes"
          :items="newSerie.produtoras"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:header="props">
            <tr>
              <th v-for="h in props.headers" :key="h.text" class="subtitle-2">{{ h.text }}</th>
            </tr>
          </template>

          <template v-slot:item="props">
            <tr>
              <td>{{ props.item.sigla }}</td>
              <td>{{ props.item.designacao }}</td>
              <td>{{ props.item.estado }}</td>
              <td>
                <v-btn
                  small
                  color="red darken-2"
                  dark
                  rounded
                  @click="unselectEntidade(props.item)"
                >
                  <v-icon dark>remove_circle</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
        <v-alert
          v-else
          :value="true"
          icon="warning"
          color="amber accent-3"
        >Não tem entidades produtoras selecionadas...</v-alert>
      </v-col>
    </v-row>
    <NovaEntidade :entidades="entidades" :entidadesClone="entidadesClone" :newSerie="newSerie" />
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Selecione a(s) entidade(s) produtora(s)</div>
      </v-col>
      <v-col xs="12" sm="9">
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Procurar por entidades"
          single-line
          hide-details
        ></v-text-field>
        <v-data-table
          :search="search"
          :headers="headersSel"
          :items="entidadesClone"
          item-key="id"
          class="elevation-1"
          :footer-props="footer_props"
        >
          <template v-slot:item="props">
            <tr @click="selectEntidade(props.item)">
              <td>{{ props.item.sigla }}</td>
              <td>{{ props.item.designacao }}</td>
              <td>{{ props.item.estado }}</td>
            </tr>
          </template>

          <template
            v-slot:footer.page-text="props"
          >{{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}</template>

          <v-alert
            v-slot:no-results
            :value="true"
            class="error"
            icon="warning"
          >A procura por "{{ search }}" não deu resultados.</v-alert>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import NovaEntidade from "./NovaEntidade";

export default {
  name: "EntidadesProdutores",
  props: ["newSerie", "entidades"],
  components: {
    NovaEntidade
  },
  data: () => {
    return {
      entidadesClone: [],
      search: "",
      headersDes: [
        {
          text: "Sigla",
          align: "left",
          value: "sigla",
          width: "10%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Designação",
          value: "designacao",
          width: "55%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Tipo",
          value: "estado",
          width: "25%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Remover",
          width: "10%",
          class: ["table-header", "body-2", "font-weight-bold"]
        }
      ],
      headersSel: [
        {
          text: "Sigla",
          align: "left",
          value: "sigla",
          width: "10%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Designação",
          value: "designacao",
          width: "80%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Tipo",
          value: "estado",
          width: "10%",
          class: ["table-header", "body-2", "font-weight-bold"]
        }
      ],
      footer_props: {
        "items-per-page-text": "Entidades por página",
        "items-per-page-options": [5, 10, 20, -1],
        "items-per-page-all-text": "Todas"
      }
    };
  },
  methods: {
    selectEntidade: function(item) {
      this.newSerie.produtoras.push(item);
      this.entidadesClone = this.entidadesClone.filter(
        e => e.sigla != item.sigla
      );
    },
    unselectEntidade: function(item) {
      this.entidadesClone.push(item);
      this.newSerie.produtoras = this.newSerie.produtoras.filter(
        e => e.sigla != item.sigla
      );
    }
  },
  created: function() {
    // Criação de array clone para fazer as seleções
    this.entidadesClone = [...this.entidades];
  }
};
</script>

<style scoped>
.table-header {
  color: #1a237e;
  font-weight: 400;
  background-color: #dee2f8;
  font-weight: bold;
}
</style>