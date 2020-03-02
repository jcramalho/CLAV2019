<template>
  <v-row align-center justify-center>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="logs"
        item-key="_id"
        class="elevation-1 ma-10"
        :search="search"
        :loading="loading"
        loading-text="A carregar o registo de acesso..."
        show-group-by
        multi-sort
      >
        <template v-slot:top>
          <v-toolbar flat color="indigo darken-4" dark>
            <v-toolbar-title>Registo de acesso</v-toolbar-title>
            <div class="flex-grow-1"></div>
            <v-text-field
              v-model="search"
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
      </v-data-table>
      <v-snackbar :value="text != ''" :color="color" :top="true">
        {{ text }}
        <v-btn text @click="text = ''">Fechar</v-btn>
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script>
export default {
  mounted: async function() {
    try {
      this.loading = true;
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

      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.color = "error";
      this.text = error.response.data;
    }
  },
  data: () => ({
    users: {},
    keys: {},
    logs: [],
    headers: [
      { text: "Email", align: "center", value: "email" },
      { text: "Tipo", align: "center", value: "type" },
      { text: "Rota", align: "center", value: "route" },
      { text: "Método", align: "center", value: "method" },
      { text: "Status HTTP", align: "center", value: "httpStatus" },
      { text: "Acedido em", align: "center", value: "accessDate" }
    ],
    color: "",
    text: "",
    search: "",
    loading: false
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
