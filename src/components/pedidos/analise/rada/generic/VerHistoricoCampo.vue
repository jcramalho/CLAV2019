<template>
  <div>
    <v-row dense class="ma-1">
      <v-col cols="2">
        <div :class="['info-descricao', `info-descricao-${historicoCampo.cor}`]">{{campoText}}</div>
      </v-col>
      <v-col>
        <div class="info-conteudo">
          <slot name="campo">
            <span v-if="(historicoCampo.dados instanceof Array)">
              <ul>
                <li v-for="(v, i) in historicoCampo.dados" :key="i">{{ v }}</li>
              </ul>
            </span>
            <span v-else>{{ historicoCampo.dados }}</span>
          </slot>
        </div>
      </v-col>
      <v-col cols="1" v-if="!!historicoCampo.nota">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" @click="verNota = true">message</v-icon>
          </template>
          <span>Ver nota relativa ao campo...</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-dialog v-model="verNota" width="50%">
      <v-card>
        <v-card-title class="indigo darken-4 title white--text">Nota {{ campoText }}</v-card-title>

        <v-card-text>
          <v-row>
            <v-col>
              <v-textarea :value="historicoCampo.nota" auto-grow outlined readonly color="indigo" />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn class="red darken-4" dark @click="verNota = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ["campoText", "historicoCampo"],
  data() {
    return {
      verNota: false,
    };
  },
};
</script>
