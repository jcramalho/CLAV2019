<template>
    <v-data-table
        :items="lista"
        :headers="headers"
        class="elevation-1"
        item-key="classe"
        :rows-per-page-items="[10, 20, 100]"
        rows-per-page-text="Mostrar"
    >
        <template v-slot:headers="props">
            <tr>
                <th
                    v-for="h in props.headers"
                    :key="h.value"
                    class="body-2 font-weight-bold"
                >
                    {{ h.text }}
                </th>
            </tr>
        </template>
        <template v-slot:items="props">
            <tr>
               <td>
                   {{ props.item.classe }}
                </td>
                <td>
                    {{ props.item.designacao }}
                </td> 
                <td>
                        <v-dialog v-model="props.item.dono" scrollable width="700px">
                            <template v-slot:activator="{ on }">
                                <v-btn fab small color="primary" v-on="on">
                                    <v-icon>list</v-icon>
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span class="headline">Selecione as entidades donas do processo: {{ props.item.classe }} </span>
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-card-text style="height: 400px;">
                                        <v-checkbox 
                                            v-for="e in entidades" 
                                            :key="e.id" 
                                            v-model="tempDono" 
                                            :value="e.id"
                                            :label="e.designacao"
                                        ></v-checkbox>
                                </v-card-text>
                                <v-divider></v-divider>
                                <v-card-actions>
                                    <v-btn color="blue darken-1" flat @click="props.item.dono = false; guardaEntDonos(props.item.classe)">Continuar</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                </td>
                <td>
                    <v-btn fab small color="primary">
                        <v-icon>list</v-icon>
                    </v-btn>
                </td>
            </tr>
        </template>
        <template v-slot:pageText="props">
            Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
            {{ props.itemsLength }}
        </template>
    </v-data-table>
</template>

<script>

export default {
    props: ["lista", "entidades"],
    data: () => ({
    // Cabeçalho da tabela para selecionar os PNs comuns
    headers: [
      {
        text: "Classe",
        value: "classe",
        width: "20%"
      },
      {
        text: "Designação",
        value: "designacao",
        width: "60%"
      },
      {
        text: "Dono",
        value: "dono"
      },
      {
        text: "Participante",
        value: "participante"
      }
    ],
    // Onde vão ficar armazenados as entidades donas de cada processo. Por ex: {proc1: [ent1,ent2]; proc2: [ent1,ent3]}
    entProcDono: [],
    // True quando a lista das entidades donas de cada processo estiver pronta
    entProcDonoReady: false,
    // Para abrir e fechar a caixa de dialogo
    dialog: false,
    tempDono: [],
    }),
    methods: {
        guardaEntDonos: async function(proc){
            this.entProcDono[proc] = this.tempDono;
            this.tempDono = [];
            console.log(this.entProcDono)
        }
    },
    mounted: async function(){
        try {
            for( var i = 0; i < this.lista.length; i++ ){
                this.entProcDono[this.lista[i].classe] = [];
            }
            this.entProcDonoReady = true;
        } catch (err) {
            return err;
        }
    }
}
</script>

