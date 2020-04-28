<template>
    <v-container>
      <v-row>
        <v-dialog v-model="dialog" width="95%">
      <v-card>
        <v-card-title class="headline">
          {{ p.classe }} - {{ p.designacao }}
        </v-card-title>
        <v-card-text>
          <v-data-table
            :items="p.entidades"
            :headers="headers"
            class="ma-1"
            hide-default-footer
          >
            <template v-slot:item="props">
                <tr>
                    <td>
                        {{ props.item.label }}
                    </td>
                    <td>
                        <v-checkbox color="indigo darken-4" v-model="props.item.dono"></v-checkbox>
                    </td>
                    <td>
                        <v-radio-group v-model="props.item.participante" row>
                            <v-radio label="Não part." value="NP"></v-radio>
                            <v-radio 
                                v-for="p in participacao"
                                :key="p.idtermo" 
                                :label="p.termo.substring(0,3)" 
                                :value="p.termo"
                                class="caption"></v-radio>
                        </v-radio-group>
                    </td>
                </tr>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="indigo darken-4" text dark rounded @click="selecionar">Selecionar</v-btn>
            <v-btn color="red darken-4" text dark rounded @click="dialog = false;">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
      </v-dialog>
      </v-row>
    </v-container>
</template>

<script>
export default {
  props: ["es", "p"],

  data: function() {
    return {
      dialog: false,
      participacao: [],

      headers: [
          { text: 'Entidade', value: 'searchField', width: "40%", class: ["table-header", "subtitle-2", "font-weight-bold"], sortable: false},
          { text: 'Dono', value: 'dono', class: ["table-header", "subtitle-2", "font-weight-bold"], sortable: false },
          { text: 'Participante', value: 'participante', class: ["table-header", "subtitle-2", "font-weight-bold"], sortable: false }
      ],
    }
  },

  created: async function(){
      try{
          await this.tipoParticipacao();
      }
      catch(e){
          console.log("Erro no carregamento dos tipos de participação...");
      }
  },

  mounted: function(){
    if(!("entidades" in this.p)){
        this.p["entidades"] = [];
        for(let i=0; i < this.es.length; i++){
            this.p.entidades.push({
                sigla: this.es[i].sigla,
                designacao: this.es[i].designacao,
                id: this.es[i].id,
                label: this.es[i].searchField,
                dono: false,
                participante: "NP"
            });
        }
    }
    this.dialog = true;
  },

  methods: {
    // Lista com todos os tipos de intervenção possíveis
    tipoParticipacao: async function() {
      var resPar = await this.$request(
        "get",
        "/vocabularios/vc_processoTipoParticipacao"
      );
      
      this.participacao = resPar.data;
    },

    // Devolve a seleção para cima
    selecionar: function(){
        this.$emit("selecionadas");
    }
  }
}

</script>