<template>
  <v-row align-center justify-center>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="logs"
        item-key="_id"
        class="elevation-1 ma-10"
        show-group-by
      >
        <template v-slot:top>
          <v-toolbar flat color="indigo darken-4" dark>
            <v-toolbar-title>Registo de acesso</v-toolbar-title>
          </v-toolbar>
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
      var response = await this.$request("get", "/api/users");
      this.users = {};

      for (var i = 0; i < response.data.length; i++) {
        this.users[response.data[i]._id] = response.data[i].email;
      }

      response = await this.$request("get", "/api/chaves/listagem");
      this.keys = {};

      for (i = 0; i < response.data.length; i++) {
        this.keys[response.data[i].id] = response.data[i].contactInfo;
      }

      response = await this.$request("get", "/api/calls");
      this.logs = response.data;

      for (i = 0; i < this.logs.length; i++) {
        if (this.logs[i].type == "Chave") {
          this.logs[i].email = this.keys[this.logs[i].id];
        } else {
          this.logs[i].email = this.users[this.logs[i].id];
        }

        this.logs[i].accessDate = new Date(this.logs[i].accessDate).toLocaleString();
      }
    } catch (error) {
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
    text: ""
  }),

  methods: {
  }
};
</script>
