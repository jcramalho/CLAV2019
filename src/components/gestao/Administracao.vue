<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="11">
        <v-alert :type="type" :value="text != ''" dismissible>
          {{ text }}
        </v-alert>
        <v-card class="elevation-12">
          <v-card-title class="primary text-white">
            Administração
          </v-card-title>
          <v-spacer></v-spacer>
          <v-card-text>
            <v-card>
              <v-card-title class="primary text-white">
                Reload da cache do servidor
              </v-card-title>
              <v-card-text class="pa-5">
                <p>
                  Realiza o reload da cache do servidor API. Faz o reset das
                  travessias, o reload da cache das classes e do índice de
                  pesquisa e gera o ficheiro com toda a informação das classes.
                </p>
                <p class="font-weight-bold">
                  <span style="color:red">CUIDADO:</span> Pedido pesado que deve
                  ser apenas executado se houver alterações nas classes. Este
                  pedido deve ser executado fora das 'horas de ponta' do
                  servidor.
                </p>
                <v-col class="text-center">
                  <v-btn color="primary" @click="reload = true">
                    Iniciar reload
                  </v-btn>
                </v-col>
              </v-card-text>
            </v-card>
            <br />
            <v-card>
              <v-card-title class="primary text-white">
                Recalculo dos fechos transitivos
              </v-card-title>
              <v-card-text>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog :value="reload" max-width="290px">
      <v-card>
        <v-card-title class="headline">Confirmar ação</v-card-title>
        <v-card-text>
          Tem a certeza que pretende realizar o reload da cache?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="reload = false">
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="
              reloadCache();
              reload = false;
            "
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "Administração",
  data: () => ({
    text: "",
    type: "",
    reload: false
  }),
  methods: {
    async reloadCache() {
      try {
        var response = await this.$request("get", "/api/reload/cache");
        this.text = response.data;
        this.type = "success";
      } catch (erro) {
        this.text = error.response.data;
        this.type = "error";
      }
    }
  }
};
</script>
