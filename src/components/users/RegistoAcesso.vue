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
          :options.sync="options"
          :server-items-length="totalLogs"
          item-key="_id"
          class="elevation-1 ma-10"
          :loading="loadingLogs"
          loading-text="A carregar o registo de acesso..."
        >
          <template v-slot:top>
            <v-toolbar flat color="indigo darken-4" dark>
              <v-toolbar-title>
                Registo de acesso nos últimos 30 dias
              </v-toolbar-title>
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

          <v-alert slot="no-data" :value="true" class="error" icon="warning">
            Não foi possível obter os resultados.
          </v-alert>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row row wrap>
      <v-col cols="12">
        <v-data-table
          :headers="headersIdLogs"
          :items="idLogs"
          :items-per-page="5"
          :footer-props="footer_props"
          item-key="_id"
          class="elevation-1 ma-10"
          :loading="loadingIdLogs"
          loading-text="A carregar o registo de acesso de um utilizador/chave API..."
          show-group-by
          multi-sort
        >
          <template v-slot:top>
            <v-toolbar
              flat
              color="indigo darken-4"
              dark
              extended
              extension-height="20px"
            >
              <v-toolbar-title>
                Registo de acesso nos últimos 30 dias de um utilizador/chave API
              </v-toolbar-title>
              <div class="flex-grow-1"></div>
              <v-autocomplete
                class="mt-7"
                :items="tipos"
                label="Tipo"
                :rules="regraV"
                v-model="tipo"
                dark
              />
              <div class="flex-grow-1"></div>
              <v-autocomplete
                class="mt-7"
                v-if="tipo"
                :items="getEmails(tipo)"
                label="Email"
                :rules="regraV"
                v-model="id"
                dark
              />
              <div class="flex-grow-1"></div>
              <v-btn
                class="mt-4"
                color="indigo accent-4"
                :disabled="!tipo || !id"
                @click="
                  getIdLogs();
                  notRunId = false;
                "
                dark
              >
                Obter
              </v-btn>
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

          <v-alert
            slot="no-data"
            :value="notRunId"
            class="warning"
            icon="warning"
          >
            Ainda não escolheu se pretende ver os registos de um utilizador ou
            chave API e/ou ainda não escolheu o email deste.
          </v-alert>
          <v-alert
            slot="no-data"
            :value="!notRunId"
            class="error"
            icon="warning"
          >
            Não há resultados.
          </v-alert>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row row wrap>
      <v-col cols="12">
        <v-data-table
          :headers="headersRouteLogs"
          :items="routeLogs"
          :items-per-page="5"
          :footer-props="footer_props"
          item-key="_id"
          class="elevation-1 ma-10"
          :loading="loadingRouteLogs"
          loading-text="A carregar o registo de acesso de uma rota..."
          show-group-by
          multi-sort
        >
          <template v-slot:top>
            <v-toolbar
              flat
              color="indigo darken-4"
              dark
              extended
              extension-height="20px"
            >
              <v-toolbar-title>
                Registo de acesso nos últimos 30 dias de uma rota
              </v-toolbar-title>
              <div class="flex-grow-1"></div>
              <v-autocomplete
                class="mt-7"
                :items="verbos"
                label="Verbo"
                :rules="regraV"
                v-model="verbo"
                dark
              />
              <div class="flex-grow-1"></div>
              <v-text-field
                class="mt-7"
                label="Caminho"
                :rules="regraV"
                v-model="caminho"
                dark
              />
              <div class="flex-grow-1"></div>
              <v-btn
                class="mt-4"
                color="indigo accent-4"
                :disabled="!verbo || !caminho"
                @click="
                  getRouteLogs();
                  notRunRoute = false;
                "
                dark
              >
                Obter
              </v-btn>
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

          <template v-slot:footer.page-text="props">
            {{ props.pageStart }} - {{ props.pageStop }} de
            {{ props.itemsLength }}
          </template>

          <v-alert
            slot="no-data"
            :value="notRunRoute"
            class="warning"
            icon="warning"
          >
            Ainda não escolheu uma rota.
          </v-alert>
          <v-alert
            slot="no-data"
            :value="!notRunRoute"
            class="error"
            icon="warning"
          >
            Não há resultados.
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
      this.assocEmails(this.aggregateLogs, "lastAccess");
      this.loadingAggLogs = false;

      await this.getLogPage();
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
    downloadedLogs: [],
    totalLogs: 0,
    idLogs: [],
    routeLogs: [],
    sPage: 0,
    options: {},
    aggregateLogs: [],
    headersLogs: [
      { text: "Email", align: "center", value: "email", sortable: false },
      { text: "Tipo", align: "center", value: "type", sortable: false },
      { text: "Rota", align: "center", value: "route", sortable: false },
      { text: "Método", align: "center", value: "method", sortable: false },
      {
        text: "Status HTTP",
        align: "center",
        value: "httpStatus",
        sortable: false
      },
      {
        text: "Acedido em",
        align: "center",
        value: "accessDate",
        sortable: false
      }
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
    headersIdLogs: [
      { text: "Rota", align: "center", value: "route" },
      { text: "Método", align: "center", value: "method" },
      { text: "Status HTTP", align: "center", value: "httpStatus" },
      { text: "Acedido em", align: "center", value: "accessDate" }
    ],
    headersRouteLogs: [
      { text: "Email", align: "center", value: "email" },
      { text: "Tipo", align: "center", value: "type" },
      { text: "Status HTTP", align: "center", value: "httpStatus" },
      { text: "Acedido em", align: "center", value: "accessDate" }
    ],
    footer_props: {
      "items-per-page-text": "Entradas por página",
      "items-per-page-options": [5, 10, 20, -1],
      "items-per-page-all-text": "Todas"
    },
    tipos: ["User", "Chave"],
    tipo: "",
    id: "",
    verbos: ["GET", "POST", "PUT", "DELETE"],
    verbo: "",
    caminho: "",
    regraV: [v => !!v || "Obrigatório. Escolha um valor."],
    color: "",
    text: "",
    searchAggLog: "",
    loadingAggLogs: false,
    loadingLogs: false,
    loadingIdLogs: false,
    loadingRouteLogs: false,
    notRunRoute: true,
    notRunId: true
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
    },
    getEmails(tipo) {
      var ret = [];
      var key = tipo == "User" ? "users" : "keys";
      Object.keys(this[key]).map(k =>
        ret.push({
          text: this[key][k],
          value: k
        })
      );
      return ret;
    },
    async getIdLogs() {
      this.loadingIdLogs = true;
      var response = await this.$request(
        "get",
        "/logs?tipo=" + this.tipo + "&id=" + this.id
      );
      this.idLogs = response.data;

      for (var i = 0; i < this.idLogs.length; i++) {
        this.idLogs[i].accessDate = this.getDateTime(this.idLogs[i].accessDate);
      }
      this.loadingIdLogs = false;
    },
    async getRouteLogs() {
      this.loadingRouteLogs = true;
      var response = await this.$request(
        "get",
        "/logs/" + this.verbo + "?rota=" + encodeURIComponent(this.caminho)
      );

      this.routeLogs = response.data;
      this.assocEmails(this.routeLogs, "accessDate");
      this.loadingRouteLogs = false;
    },
    assocEmails(list, keyDate) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].type == "Chave") {
          list[i].email = this.keys[list[i].id];
        } else {
          list[i].email = this.users[list[i].id];
        }

        list[i][keyDate] = this.getDateTime(list[i][keyDate]);
      }
    },
    async getLogPage() {
      this.loadingLogs = true;
      const sizeSPage = 2500;
      const { page, itemsPerPage } = this.options;

      if (page == 1 || page * itemsPerPage > sizeSPage * (this.sPage + 1)) {
        this.sPage = ((page - 1) * itemsPerPage) / sizeSPage;
        var response = await this.$request("get", "/logs?pagina=" + this.sPage);
        this.downloadedLogs = response.data.items;
        this.totalLogs = response.data.total;
        this.assocEmails(this.downloadedLogs, "accessDate");
      }

      this.logs = this.downloadedLogs.slice(
        (page - 1) * itemsPerPage - this.sPage * sizeSPage,
        page * itemsPerPage - this.sPage * sizeSPage
      );
      this.loadingLogs = false;
    }
  },
  watch: {
    options: {
      async handler() {
        await this.getLogPage();
      },
      deep: true
    }
  }
};
</script>
