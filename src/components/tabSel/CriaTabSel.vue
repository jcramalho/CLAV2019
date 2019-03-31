<template>
  <v-stepper v-model="e6" vertical>
    <v-stepper-step :complete="e6 > 1" step="1">
      Designação da Tabela de Seleção
      <small>Summarize if needed</small>
    </v-stepper-step>

    <v-stepper-content step="1">
      <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
      <v-btn color="primary" @click="e6 = 2">Continuar</v-btn>
      <v-btn flat>Guardar Trabalho</v-btn>
      <v-btn flat>Cancelar</v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="e6 > 2" step="2">Selecionar tipo da Tabela de Seleção</v-stepper-step>

    <v-stepper-content step="2">
        <v-container fluid grid-list-xl>
            <v-layout wrap align-center>
                <v-flex xs2>
                    <v-subheader>Selecionar tipo de Tabela de Seleção:</v-subheader>
                </v-flex>
                <v-flex xs12 sm6 d-flex>
                    <v-select
                    :items="items"
                    label="Tipo"
                    ></v-select>
                </v-flex>
            </v-layout>
        </v-container>
      <v-btn color="primary" @click="e6 = 3">Continuar</v-btn>
      <v-btn flat>Guardar Trabalho</v-btn>
      <v-btn flat>Cancelar</v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="e6 > 3" step="3">Indique as entidades abrangidas pela TS:</v-stepper-step>

    <v-stepper-content step="3">
      <v-layout wrap>
        <v-flex xs10 @click="barra(60)">
            <v-select
                item-text="label"
                item-value="value"
                :items="entidades"
                label="Selecione uma classe de nível superior"
                solo
                dense
            />
        </v-flex>
    </v-layout>
      <v-btn color="primary" @click="e6 = 4">Continuar</v-btn>
      <v-btn flat>Guardar Trabalho</v-btn>
      <v-btn flat>Cancelar</v-btn>
    </v-stepper-content>

    <v-stepper-step step="4">View setup instructions</v-stepper-step>
    <v-stepper-content step="4">
      <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
      <v-btn color="primary" @click="e6 = 1">Continuar</v-btn>
      <v-btn flat>Guardar Trabalho</v-btn>
      <v-btn flat>Cancelar</v-btn>
    </v-stepper-content>
  </v-stepper>
</template>


<script>
import axios from 'axios'
  export default {
    data () {
      return {
        e6: 1,
        items: ['Organizacional', 'Pluriorganizacional'],
        entidades: [],
      }
    },
    methods: {
        loadEntidades: async function () {
            try{
                var response = await axios.get("http://localhost:7778/api/entidades");
                this.entidades = response.data.map(function (item) {
                    return {
                        label: item.sigla + " - " + item.designacao,
                        value: item.id.split('#')[1],
                    }
                    }).sort(function (a, b) {
                        return a.label.localeCompare(b.label);
                    });
            }
            catch(erro){
                console.log(erro);
            }
        },
    },
    created: function() {
        this.loadEntidades()
        console.log(this.entidades)
    }
  }
</script>