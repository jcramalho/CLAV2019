<template>
  <div>
<<<<<<< HEAD
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Título</div>
      </v-col>
      <v-col cols="12" xs="12" sm="9">
        <v-text-field
          readonly
          v-model="RADA.titulo"
          label="Título"
          solo
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div style="padding-top:6px" class="info-label">
          Entidades Responsáveis
        </div>
      </v-col>
      <v-col cols="12" xs="12" sm="9">
        <v-combobox
          v-model="RADA.entRes"
          readonly
          :items="[]"
          chips
          multiple
        ></v-combobox>
      </v-col>
    </v-row>
=======
    <RADAEntry label="Título" :value="RADA.titulo" />
    <RADAEntry label="Entidades Responsáveis" >
      <template v-slot:valor>
        <ul>
          <li v-for="(ent, i) in RADA.entRes" :key="i">{{ent}}</li>
        </ul>
      </template>
    </RADAEntry>
>>>>>>> 19aa347ffbebc7de3f58077a61af422fc80a45a0
  </div>
</template>

<script>
import RADAEntry from "@/components/rada/consulta/elementos/campos/RadaEntry.vue";

export default {
  props: ["RADA"],
  components: { 
    RADAEntry
  }
};
</script>
