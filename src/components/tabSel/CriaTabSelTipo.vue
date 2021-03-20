<template>
  <v-card flat class="pa-3">
    <v-row align="center">
      <!-- Header -->
      <v-col cols="3" align="center">
        <Voltar />
      </v-col>
      <v-col cols="6" align="center">
        <p class="clav-content-title-1">Criar Tabela de Seleção</p>
      </v-col>
      <v-col cols="3" align="center"> </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p
          class="content-text px-8 py-2 mb-6"
          style="text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important"
        >
          Selecione o tipo de Tabela de Seleção a criar:
        </p>
        <v-tooltip top color="info" open-delay="500">
          <template v-slot:activator="{ on }">
            <div
              class="pa-4 px-5 pb-6 mx-auto"
              style="min-height: 30px; max-width: 60%"
              v-on="on"
            >
              <v-select
                :items="['Organizacional', 'Pluriorganizacional']"
                label="Tipo"
                v-model="tipo"
                clearable
                hide-details
                single-line
                color="blue darken-3"
              ></v-select>
            </div>
          </template>

          <span> Tipo da Tabela de Seleção</span>
        </v-tooltip>

        <!--v-flex xs12 sm4>
                <v-btn
                  medium
                  @click="infoButton = true"
                  v-if="!infoButton"
                  icon
                  color="info"
                >
                  <v-icon>info</v-icon>
                </v-btn>
                <v-btn medium v-if="infoButton" color="info" @click="passos()">
                  <v-icon left>info</v-icon>Info dos seguintes passos
                </v-btn>
              </v-flex-->

        <div class="text-center mt-6">
          <v-btn
            v-if="!tipo"
            disabled
            rounded
            :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown,
            }"
            class="mb-6"
            id="botao-shadow"
          >
            <unicon
              name="continuar-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 37.261"
              fill="#b8b8b8"
            />
            <p class="ml-2">Continuar</p>
          </v-btn>
          <v-btn
            v-else
            @click="continuar()"
            rounded
            class="clav-linear-background white--text"
          >
            <unicon
              name="continuar-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 37.261"
              fill="#ffffff"
            />
            <p class="ml-2">Continuar</p>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import Voltar from "@/components/generic/Voltar";
export default {
  data() {
    return {
      // Tipo da TS
      tipo: "",
      // Botão da informação sobre os passos da criação de TS
      infoButton: false,
    };
  },
  components: {
    Voltar,
  },
  methods: {
    goBack() {
      this.$router.push("/tsInfo");
    },
    // Reencaminha para a página da informação dos seguintes passos
    passos: function () {
      this.$router.push("/ts/passos");
    },

    continuar: function () {
      if (this.tipo === "Organizacional") {
        this.$router.push("/ts/criar/organizacional");
      } else if (this.tipo === "Pluriorganizacional") {
        this.$router.push("/ts/criar/pluriorganizacional");
      }
    },
  },
};
</script>

<style scoped>
.info-content {
  padding: 5px;
  width: 100%;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
