<template>
  <v-dialog v-model="dialogState" max-width="90%">
    <v-card>
      <v-card-title class="indigo darken-4 white--text">
        <b>Unidade de Instalação: {{ UI.codigo + " - " + UI.titulo }}</b>
      </v-card-title>
      <v-card-text style="margin-top: 16px">
        <RADAEntry label="Código" :value="UI.codigo" />
        <RADAEntry label="Título" :value="UI.titulo" />
        <RADAEntry v-if="!!UI.codCota" label="Cota" :value="UI.codCota" />
        <RADAEntry v-if="!!UI.descricao" label="Descrição" :value="UI.descricao" />
        <RADAEntryDouble
          label_1="Data inicial"
          :value_1="UI.dataInicial"
          label_2="Data final"
          :value_2="UI.dataFinal"
        />

        <RADAEntry label="Entidade produtora" v-if="UI.produtor.entProdutoras.length > 0">
          <template v-slot:valor>
            <ul>
              <li v-for="(ent, i) in UI.produtor.entProdutoras" :key="i">{{ent}}</li>
            </ul>
          </template>
        </RADAEntry>

        <RADAEntry v-else label="Tipologias Produtoras">
          <template v-slot:valor>
            <ul>
              <li v-for="(ent, i) in UI.produtor.tipologiasProdutoras" :key="i">{{ent}}</li>
            </ul>
          </template>
        </RADAEntry>

        <RADAEntry label="Série/Subsérie">
          <template v-slot:valor>
            <v-data-table :headers="headers" :items="UI.classesAssociadas" hide-default-footer>
              <template v-slot:item.codigo="props">
                <img
                  v-if="props.item.tipo == 'Série'"
                  style="width:23px; height:30px"
                  :src="svg_sr"
                />
                <img
                  v-else-if="props.item.tipo == 'Subsérie'"
                  style="width:23px; height:30px"
                  :src="svg_ssr"
                />
                {{
                props.item.codigo + " - " + props.item.titulo
                }}
              </template>
            </v-data-table>
          </template>
        </RADAEntry>

        <RADAEntry v-if="!!UI.notas" label="Notas" :value="UI.notas" />
        <RADAEntry v-if="!!UI.localizacao" label="Localização" :value="UI.localizacao" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="indigo darken-4" dark @click="dialogState = false">Voltar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import RADAEntry from "@/components/rada/consulta/elementos/campos/RadaEntry.vue";
import RADAEntryDouble from "@/components/rada/consulta/elementos/campos/RadaEntryDouble.vue";

export default {
  props: ["UI", "dialog"],
  components: {
    RADAEntry,
    RADAEntryDouble
  },
  data: () => ({
    svg_sr: require("@/assets/common_descriptionlevel_sr.svg"),
    svg_ssr: require("@/assets/common_descriptionlevel_ssr.svg"),
    headers: [
      {
        text: "Série/Subsérie Associada",
        align: "center",
        value: "codigo",
        width: "100%",
        class: ["table-header", "body-2", "font-weight-bold"]
      }
    ]
  }),
  computed: {
    dialogState: {
      get() {
        return this.dialog;
      },
      set(val) {
        this.$emit("fecharDialog", false);
      }
    }
  }
};
</script>
