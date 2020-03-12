<template>
  <div ma-2>
    <v-row row wrap>
      <v-col cols="12">
        <v-data-table
          :headers="headersAggLogs"
          :items="aggregateLogs"
          :items-per-page="5"
          :footer-props="footer_props"
          item-key="_id"
          class="elevation-1 ma-10"
          :search="searchAggLog"
          :loading="loadingAggLogs"
          loading-text="A carregar o sumário do registo de acesso..."
          multi-sort
        >
          <template v-slot:top>
            <v-toolbar flat color="indigo darken-4" dark>
              <v-toolbar-title>Sumário do registo de acesso</v-toolbar-title>
              <div class="flex-grow-1"></div>
              <v-text-field
                v-model="searchAggLog"
                append-icon="search"
                label="Filtrar"
                single-line
                hide-details
              ></v-text-field>
            </v-toolbar>
          </template>

          <template v-slot:item.nGETs="{ item }">
            <v-chip class="font-weight-bold" color="green" dark>
              {{ item.nGETs }}
            </v-chip>
          </template>

          <template v-slot:item.nPOSTs="{ item }">
            <v-chip class="font-weight-bold" color="cyan" dark>
              {{ item.nPOSTs }}
            </v-chip>
          </template>

          <template v-slot:item.nPUTs="{ item }">
            <v-chip class="font-weight-bold" color="orange" dark>
              {{ item.nPUTs }}
            </v-chip>
          </template>

          <template v-slot:item.nDELETEs="{ item }">
            <v-chip class="font-weight-bold" color="red" dark>
              {{ item.nDELETEs }}
            </v-chip>
          </template>

          <template v-slot:footer.page-text="props">
            {{ props.pageStart }} - {{ props.pageStop }} de
            {{ props.itemsLength }}
          </template>

          <v-alert slot="no-results" :value="true" class="error" icon="warning">
            A procura por "{{ searchAggLog }}" não deu resultados.
          </v-alert>

          <v-alert slot="no-data" :value="true" class="error" icon="warning">
            Não foi possível obter os resultados.
          </v-alert>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row row wrap>
      <v-col cols="12">
        <v-data-table
          :headers="headersLogs"
          :items="logs"
          :items-per-page="5"
          :footer-props="footer_props"
          item-key="_id"
          class="elevation-1 ma-10"
          :search="searchLog"
          :loading="loadingLogs"
          loading-text="A carregar o registo de acesso..."
          show-group-by
          multi-sort
        >
          <template v-slot:top>
            <v-toolbar flat color="indigo darken-4" dark>
              <v-toolbar-title>
                Registo de acesso nos últimos 30 dias
              </v-toolbar-title>
              <div class="flex-grow-1"></div>
              <v-text-field
                v-model="searchLog"
                append-icon="search"
                label="Filtrar"
                single-line
                hide-details
              ></v-text-field>
            </v-toolbar>
          </template>

          <template v-slot:item.httpStatus="{ item }">
            <v-chip
              class="font-weight-bold"
              :color="getColorStatus(item.httpStatus)"
              dark
            >
              {{ item.httpStatus }}
            </v-chip>
          </template>

          <template v-slot:item.method="{ item }">
            <v-chip
              class="font-weight-bold"
              :color="getColorMethod(item.method)"
              dark
            >
              {{ item.method }}
            </v-chip>
          </template>

          <template v-slot:footer.page-text="props">
            {{ props.pageStart }} - {{ props.pageStop }} de
            {{ props.itemsLength }}
          </template>

          <v-alert slot="no-results" :value="true" class="error" icon="warning">
            A procura por "{{ searchLog }}" não deu resultados.
          </v-alert>

          <v-alert slot="no-data" :value="true" class="error" icon="warning">
            Não foi possível obter os resultados.
          </v-alert>
        </v-data-table>
      </v-col>
    </v-row>
    <v-snackbar :value="text != ''" :color="color" :top="true">
      {{ text }}
      <v-btn text @click="text = ''">Fechar</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  mounted: async function() {
    try {
      this.loadingAggLogs = true;
      this.loadingLogs = true;

      var response = await this.$request("get", "/users");
      this.users = {};

      for (var i = 0; i < response.data.length; i++) {
        this.users[response.data[i]._id] = response.data[i].email;
      }

      response = await this.$request("get", "/chaves");
      this.keys = {};

      for (i = 0; i < response.data.length; i++) {
        this.keys[response.data[i].id] = response.data[i].contactInfo;
      }

      response = await this.$request("get", "/logsAgregados");
      this.aggregateLogs = response.data;

      for (i = 0; i < this.aggregateLogs.length; i++) {
        if (this.aggregateLogs[i].type == "Chave") {
          this.aggregateLogs[i].email = this.keys[this.aggregateLogs[i].id];
        } else {
          this.aggregateLogs[i].email = this.users[this.aggregateLogs[i].id];
        }

        this.aggregateLogs[i].lastAccess = this.getDateTime(
          this.aggregateLogs[i].lastAccess
        );
      }

      this.loadingAggLogs = false;

      response = await this.$request("get", "/logs");
      this.logs = response.data;

      for (i = 0; i < this.logs.length; i++) {
        if (this.logs[i].type == "Chave") {
          this.logs[i].email = this.keys[this.logs[i].id];
        } else {
          this.logs[i].email = this.users[this.logs[i].id];
        }

        this.logs[i].accessDate = this.getDateTime(this.logs[i].accessDate);
      }

      this.loadingLogs = false;
    } catch (error) {
      this.loadingAggLogs = false;
      this.loadingLogs = false;
      this.color = "error";
      this.text = error.response.data;
    }
  },
  data: () => ({
    users: {},
    keys: {},
    logs: [],
    aggregateLogs: [],
    headersLogs: [
      { text: "Email", align: "center", value: "email" },
      { text: "Tipo", align: "center", value: "type" },
      { text: "Rota", align: "center", value: "route" },
      { text: "Método", align: "center", value: "method" },
      { text: "Status HTTP", align: "center", value: "httpStatus" },
      { text: "Acedido em", align: "center", value: "accessDate" }
    ],
    headersAggLogs: [
      { text: "Email", align: "center", value: "email" },
      { text: "Tipo", align: "center", value: "type" },
      { text: "Número de pedidos GET", align: "center", value: "nGETs" },
      { text: "Número de pedidos POST", align: "center", value: "nPOSTs" },
      { text: "Número de pedidos PUT", align: "center", value: "nPUTs" },
      { text: "Número de pedidos DELETE", align: "center", value: "nDELETEs" },
      { text: "Último Acesso", align: "center", value: "lastAccess" }
    ],
    footer_props: {
      "items-per-page-text": "Entradas por página",
      "items-per-page-options": [5, 10, 20, -1],
      "items-per-page-all-text": "Todas"
    },
    color: "",
    text: "",
    searchLog: "",
    searchAggLog: "",
    loadingAggLogs: false,
    loadingLogs: false
  }),

  methods: {
    getDateTime(string) {
      var dt = new Date(string);

      var d = String(dt.getDate()).padStart(2, "0");
      var m = String(dt.getMonth() + 1).padStart(2, "0");
      var y = dt.getFullYear();
      var date = y + "/" + m + "/" + d;

      var h = String(dt.getHours()).padStart(2, "0");
      var min = String(dt.getMinutes()).padStart(2, "0");
      var s = String(dt.getSeconds()).padStart(2, "0");
      var hour = h + ":" + min + ":" + s;

      return date + ", " + hour;
    },
    getColorStatus(httpStatus) {
      return httpStatus >= 500
        ? "red"
        : httpStatus >= 400
        ? "yellow"
        : httpStatus >= 300
        ? "cyan"
        : httpStatus >= 200
        ? "green"
        : "";
    },
    getColorMethod(method) {
      return method == "GET"
        ? "green"
        : method == "POST"
        ? "cyan"
        : method == "PUT"
        ? "orange"
        : method >= "DELETE"
        ? "red"
        : "";
    }
  }
};
</script>
