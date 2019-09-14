<template>
  <v-card>
    <v-card-title class="indigo darken-2 white--text" fill-height>
      <div>
        <h2>{{ inv.descRel }}</h2>
        <h4 v-html="inv.descInv"></h4>
      </div>
    </v-card-title>

    <v-toolbar text color="white">
      <v-toolbar-title>PNs que não cumprem o invariante:</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <div v-if="inv.results.length != 0">
      <v-data-table :headers="headers" :items="inv.results">
        <template v-slot:item="{ item }">
          <tr>
            <td v-for="v in Object.keys(item)" :key="v" class="text-center">
              <a
                v-if="item[v].includes('#c')"
                @click="goToClass(item[v].split('#')[1])"
              >
                {{ item[v].split("#")[1] }}
              </a>
              <span v-else-if="item[v].includes('#')">
                {{ item[v].split("#")[1] }}
              </span>
              <span v-else>{{ item[v] }}</span>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
    <div v-else>
      <v-alert :value="true" color="success">
        Não há PNs a apresentar...
      </v-alert>
    </div>

    <v-btn class="ma-2" color="indigo darken-2" @click="goBack()" dark>
      Voltar à lista de invariantes
    </v-btn>
  </v-card>
</template>

<script>
export default {
  props: ["inv"],
  data: () => ({
    headers: []
  }),

  methods: {
    goBack: function() {
      this.$router.push("/invariantes");
    },
    goToClass: function(classe) {
      this.$router.push("/classes/consultar/" + classe);
    }
  },

  mounted: function() {
    if (this.inv.results.length > 0) {
      Object.keys(this.inv.results[0]).forEach(key => {
        this.headers.push({ text: key, align: "center", value: key });
      });
    }
  }
};
</script>
