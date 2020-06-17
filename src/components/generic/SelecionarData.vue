<template>
  <v-menu
    ref="menu1"
    v-model="menu1"
    :close-on-content-click="false"
    :return-value.sync="dataValor"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <slot :item="{label, dataValor, on}">
        <v-text-field
          filled
          v-model="dataValor"
          :label="label"
          prepend-icon="event"
          readonly
          v-on="on"
        />
      </slot>
    </template>

    <v-date-picker
      v-model="dataValor"
      no-title
      scrollable
      show-current
      first-day-of-week="1"
      :max="maxData"
      :min="minData"
      locale="pt"
      @input="
        menu1 = false;
        dataSelecionada();
      "
    />
  </v-menu>
</template>

<script>
export default {
  props: ["d", "label", "dataMinima", "dataMaxima"],
  data() {
    return {
      dataValor: this.d,
      menu1: false,
      minData: "",
      maxData: ""
    };
  },
  /* 
  No caso dos RADA, no preenchimento de uma subsérie o utilizador pode preencher ou injetar as datas da série pai,
  caso injete a props "d" altera e este watch serve para verificar essa mudança.
  */ 
  watch: {
    d(novoValor){
      this.dataValor = novoValor;
    }
  },
  created() {
    this.minData = this.dataMinima || "1800-01-01";
    this.maxData = this.dataMaxima || new Date().toISOString().substr(0, 10);
  },
  methods: {
    dataSelecionada: function() {
      this.$refs.menu1.save(this.dataValor);
      this.$emit("dataSelecionada", this.dataValor);
      this.dataValor = "";
    }
  }
};
</script>
