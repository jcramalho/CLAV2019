<template>
  <v-card flat class="mb-12" style="background-color:#fafafa">
    <v-form ref="form" :lazy-validation="false">
      <v-row>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Título</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="RADA.titulo"
            label="Título"
            solo
            clearable
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
          <v-autocomplete
            deletable-chips
            :rules="[v => !!v[0] || 'Campo de preenchimento obrigatório!']"
            v-model="RADA.entRes"
            :items="entidadesProcessadas"
            placeholder="Selecione as Entidades Responsáveis."
            chips
            multiple
            solo
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-title>
                  <strong>Entidade</strong> em questão não existe!
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
    </v-form>
    <v-btn color="indigo darken-4" dark @click="next">Continuar</v-btn>
    <v-btn color="indigo darken-4" text @click="apagar">
      <v-icon>delete_sweep</v-icon>
    </v-btn>
    <br />
  </v-card>
</template>

<script>
export default {
  props: ["RADA", "entidades"],
  computed: {
    entidadesProcessadas() {
      return this.entidades
      .filter(item => item.estado !== "Inativa")
      .map(item => {
        return item.sigla + " - " + item.designacao;
      });
    }
  },
  methods: {
    apagar: function() {
      this.$refs.form.reset();
    },
    next: function() {
      if (this.$refs.form.validate()) {
        this.$emit("seguinte", 2);
      }
    }
  }
};
</script>
