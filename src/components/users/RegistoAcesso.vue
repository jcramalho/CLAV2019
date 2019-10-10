<template>
  <v-container fluid fill-height>
    <v-row align-center justify-center>
      <v-col cols="12">
        <v-data-table
          :headers="headersUsers"
          :items="users"
          item-key="_id"
          :single-expand="true"
          show-expand
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="indigo darken-4" dark>
              <v-toolbar-title>Registo de acesso</v-toolbar-title>
            </v-toolbar>
          </template>
          <template v-slot:expanded-item="{ item, headers }">
            <td :colspan="headers.length" class="pa-1">
              <v-data-table
                :headers="headersRoutes"
                :items="item.logs"
                item-key="id"
                :single-expand="true"
                show-expand
                class="elevation-1"
              >
                <template v-slot:expanded-item>
                  <td :colspan="headersUsers.length">Peek-a-boo!</td>
                </template>
              </v-data-table>
            </td>
          </template>
        </v-data-table>
        <v-snackbar :value="text != ''" :color="color" :top="true">
          {{ text }}
          <v-btn text @click="text = ''">Fechar</v-btn>
        </v-snackbar>
      </v-col>
    </v-row>
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
    users: [],
    headersUsers: [
      { text: "Nome", align: "center", value: "name" },
      { text: "Email", align: "center", value: "email" },
      { text: "", value: "data-table-expand" }
    ],
    headersRoutes: [
      { text: "Rota", align: "center", value: "route" },
      { text: "Método", align: "center", value: "method" },
      { text: "", value: "data-table-expand" }
    ],
    color: "",
    text: ""
  }),

  methods: {
  }
};
</script>
