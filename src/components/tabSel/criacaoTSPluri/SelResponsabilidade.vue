<template>
    <v-container>
      <v-row>
        <v-dialog v-model="dialog" width="95%">
      <v-card>
        <v-card-title class="headline">
          {{ p.proc }} - {{ p.designacao }}
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
            <v-btn color="indigo darken-4" text dark rounded @click="selecionar">Guardar</v-btn>
        </v-card-actions>
      </v-card>
      </v-dialog>
      </v-row>
    </v-container>
</template>

<script>
export default {
  props: ["p"],

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
          alert(this.p);
          await this.tipoParticipacao();
      }
      catch(e){
          console.log("Erro no carregamento dos tipos de participação...");
      }
  },

  mounted: function(){
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
        var contador = 0; // Controla se este proc entra ou não na contagem dos selecionados
        let i=0, encontreiDono=false, encontreiParticipante=false;
        while(i < this.p.entidades.length && (!encontreiDono || !encontreiParticipante)){
            if(this.p.entidades[i].dono) encontreiDono = true;
            if(this.p.entidades[i].participante != "NP") encontreiParticipante = true;
            i++;
        }
        if(encontreiDono) this.p.dono = true;
        else this.p.dono = false;
        if(encontreiParticipante) this.p.participante = true;
        else this.p.participante = false;

        if(encontreiDono || encontreiParticipante) {
            if(!this.p.edited){
                this.p.edited = true;
                contador++;
            }
        }
        else{
            if(this.p.edited){
                this.p.edited = false;
                contador--;
            }
        } 

        this.p.chave = this.p.chave * -1;
        this.$emit("selecionadas", contador);
    }
  }
}

</script>