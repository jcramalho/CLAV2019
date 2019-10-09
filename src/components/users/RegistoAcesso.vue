<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm12 md12>
        <v-data-table
          :headers="headersUsers"
          :items="users"
          :expanded.sync="expanded"
          item-key="_id"
          show-expand
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="indigo darken-4" dark>
              <v-toolbar-title>Registo de acesso</v-toolbar-title>
            </v-toolbar>
          </template>
          <template v-slot:expanded-item="{ headersUsers }">
            <v-data-table
              :headers="headersRoutes"
              :items="users"
              :expanded.sync="expanded"
              item-key="_id"
              show-expand
              class="elevation-1"
            >
              <template v-slot:expanded-item="{ headers }">
                <td :colspan="headers.length">Peek-a-boo!</td>
              </template>
            </v-data-table>
          </template>
        </v-data-table>
        <v-snackbar :value="text != ''" :color="color" :top="true">
          {{ text }}
          <v-btn text @click="text = ''">Fechar</v-btn>
        </v-snackbar>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  mounted: async function() {
    try {
      var response = await this.$request("get", "/api/users");
      this.users = response.data;

      for (var i = 0; i < this.users.length; i++) {
        response = await this.$request(
          "get",
          "/api/calls/User/" + this.users[i]._id
        );
        this.users[i].logs = response.data;
      }
    } catch (error) {
      this.color = "error";
      this.text = error.response.data;
    }
  },
  data: () => ({
    expanded: [],
    logs: [],
    users: [],
    headersUsers: [
      { text: "Nome", align: "center", value: "name" },
      { text: "Email", align: "center", value: "email" },
      { text: "", value: "data-table-expand" }
    ],
    color: "",
    text: ""
  }),

  methods: {
  }
};
</script>
