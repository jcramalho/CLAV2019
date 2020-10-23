<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <!-- Header -->
        <v-app-bar color="indigo darken-3" dark>
          <v-toolbar-title class="card-heading"
            >Importação de Dados na Documentação de Apoio</v-toolbar-title
          >
        </v-app-bar>
        <!-- Content -->
        <v-card-text>
          <v-row>
            <v-col cols="2">
              <div class="info-label">Opção</div>
            </v-col>
            <v-col>
              <v-radio-group v-model="opcao" row>
                <v-radio label="Substituição" value="substituição"></v-radio>
                <v-radio label="Adição" value="adição"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
   
          <v-row>
            <v-col cols="2">
              <div class="info-label">Ficheiro</div>
            </v-col>
            <v-col>
              <v-file-input
                v-model="ficheiro"
                placeholder="Selecione o ficheiro a submeter"
                show-size
                clearable
                single-line
                accept="application/json"
                solo
              ></v-file-input>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="indigo darken-4" dark @click="cancelar">
                Cancelar
            </v-btn>
            <v-btn v-if="ready" color="indigo darken-4" dark @click="executar">
                Importar
            </v-btn>
            <v-btn v-else text disabled>
                Importar
            </v-btn>
            <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
      <v-alert :value="text != ''" :type="alertType">
        {{ text }}
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
export default {
  components: {
    
  },
  data: nt => ({
    opcao: "adição",
    ficheiro: null,
    text: "",
    alertType: "success"
  }),
  computed: {
      ready(){
          if((this.opcao === "adição" || this.opcao === "substituição") && this.ficheiro && this.ficheiro.name){
            return true;
          }
          else {
              return false;
          }    
      }
  },
  methods: {
    cancelar() {
        this.$router.push("/");
    },
    async executar() {
      var formData = new FormData();
      formData.append("opcao", this.opcao);
      if (this.ficheiro != null) {
        formData.append("file", this.ficheiro);
      }
      this.$request(
        "post",
        "/documentacaoApoio/importar",
        formData
      )
        .then(res => {
          this.text = res.data;
          this.alertType = "success";
        })
        .catch(e => {
          this.text = e.response.data[0].msg || e.response.data;
          this.alertType = "error";
        });
    }
  }
};
</script>

<style scoped>
.expansion-panel-heading {
  background-color: #283593 !important;
  color: #fff;
  font-size: large;
  font-weight: bold;
}

.card-heading {
  font-size: x-large;
  font-weight: bold;
}

.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}
</style>
