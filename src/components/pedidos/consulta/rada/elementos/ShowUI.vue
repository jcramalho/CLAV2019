<template>
  <v-dialog v-model="dialogState">
    <v-card>
      <v-card-title class="indigo darken-1 white--text">
        <b>Unidade de Instalação: {{ UI.codigo + " - " + UI.titulo }}</b>
      </v-card-title>
      <v-card-text>
        <v-form ref="formUI" :lazy-validation="false">
          <v-row>
            <v-col md="3" sm="3">
              <div class="info-label">Código</div>
            </v-col>
            <v-col sm="3" md="3">
              <v-text-field readonly solo v-model="UI.codigo"></v-text-field>
            </v-col>
            <v-col md="3" sm="3">
              <div class="info-label">Titulo</div>
            </v-col>
            <v-col sm="3" md="3">
              <v-text-field readonly solo v-model="UI.titulo"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="2" sm="2">
              <div class="info-label">Código Classificação/Cota</div>
            </v-col>
            <v-col sm="2" md="2">
              <v-text-field solo v-model="UI.codCota" readonly></v-text-field>
            </v-col>
            <v-col md="2" sm="2">
              <div class="info-label">Descrição</div>
            </v-col>
            <v-col sm="6" md="6">
              <v-text-field readonly solo v-model="UI.descricao"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col xs="12" sm="3">
              <div class="info-label">Data Inicial da Documentação</div>
            </v-col>
            <v-col xs="12" sm="3">
              <v-text-field v-model="UI.dataInicial" prepend-icon="event" readonly></v-text-field>
            </v-col>
            <v-col xs="12" sm="3">
              <div class="info-label">Data Final da Documentação</div>
            </v-col>
            <v-col xs="12" sm="3">
              <v-text-field v-model="UI.dataFinal" prepend-icon="event" readonly></v-text-field>
            </v-col>
          </v-row>
          <v-divider style="border: 2px solid; border-radius: 1px;"></v-divider>

          <v-row v-if="UI.produtor.entProdutoras.length > 0">
            <v-col cols="12" xs="12" sm="3">
              <div class="info-label">Entidades Produtoras</div>
            </v-col>
            <v-col xs="12" sm="9">
              <v-combobox v-model="UI.produtor.entProdutoras" :items="[]" readonly multiple chips></v-combobox>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col cols="12" xs="12" sm="3">
              <div class="info-label">Tipologias Produtoras</div>
            </v-col>
            <v-col xs="12" sm="9">
              <v-combobox
                v-model="UI.produtor.tipologiasProdutoras"
                :items="[]"
                readonly
                multiple
                chips
              ></v-combobox>
            </v-col>
          </v-row>
          <v-divider style="border: 2px solid; border-radius: 1px;"></v-divider>
          <v-row>
            <v-col md="3" sm="2">
              <div class="info-label">Série/Subsérie</div>
            </v-col>
            <v-col md="9" sm="9">
              <!-- {{ UI_clone.classesAssociadas }} -->
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
            </v-col>
          </v-row>

          <v-divider style="border: 2px solid; border-radius: 1px;"></v-divider>

          <v-row>
            <v-col md="2" sm="2">
              <div class="info-label">Notas</div>
            </v-col>
            <v-col sm="4" md="4">
              <v-text-field readonly solo v-model="UI.notas"></v-text-field>
            </v-col>
            <v-col md="2" sm="2">
              <div class="info-label">Localização</div>
            </v-col>
            <v-col sm="4" md="4">
              <v-text-field readonly solo v-model="UI.localizacao"></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="indigo darken-4" outlined text @click="dialogState = false">Voltar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["UI", "dialog"],
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
