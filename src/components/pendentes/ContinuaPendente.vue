<template>
  <v-container>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm10>
        <v-card v-if="pendenteLoaded">
          <v-toolbar color="blue" dark>
            <v-toolbar-title
              >Consulta do pendente: {{ pendente._id }}</v-toolbar-title
            >
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-container>
                <v-layout row wrap>
                  <v-flex xs12 sm10>
                    <v-text-field
                      :value="pendente.data.split('T')[0]"
                      label="Data"
                      readonly
                    ></v-text-field>
                    <v-text-field
                      :value="this.pedido.criadoPor"
                      label="Autor"
                      readonly
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm10>
                    <pre>{{ pendente.objeto }}</pre>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>

        <p v-else>A carregar...</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  props: ["obj"],
  data: () => ({
    pendente: {},
    pendenteLoaded: false,
    headers: [
      { text: "Data", value: "data" },
      { text: "Responsável", value: "criadoPor" },
      { text: "Objeto", value: "objeto" }
    ],
    etapas: []
  }),
  
  mounted: function() {
    this.pendente = this.obj
    this.pendenteLoaded = true
  }
};
</script>

<style></style>
