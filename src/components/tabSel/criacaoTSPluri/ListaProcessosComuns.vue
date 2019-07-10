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
                    <v-btn fab small color="primary">
                        <v-icon>list</v-icon>
                    </v-btn>
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
    props: ["lista"],
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
    }),
    mounted: async function(){
        try {
            console.log(this.lista)
        } catch (err) {
            return err;
        }
    }
}
</script>

