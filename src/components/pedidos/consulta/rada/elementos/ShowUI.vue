<template>
  <v-dialog v-model="dialog">
    <template v-slot:activator="{ on: dialog }">
      <v-tooltip top>
        <template v-slot:activator="{ on: tooltip }">
          <tr :style="'text-align: center'" v-on="{...tooltip, ...dialog}">
            <td>{{ UI.codigo }}</td>
            <td>{{ UI.titulo }}</td>
          </tr>
        </template>
        <span width="100%">
          <h4>
            Classes associadas a:
            <b>{{ UI.codigo + " - " + UI.titulo }}</b>
          </h4>

          <ul v-if="!!UI.classesAssociadas[0]">
            <li v-for="(classe, i) in UI.classesAssociadas" :key="i">{{classe.codigo}}</li>
          </ul>
          <p v-else>Não tem classes associadas!</p>
        </span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title class="indigo darken-1 white--text">
        <b>Unidade de Instalação: {{ UI.codigo + " - " + UI.titulo}}</b>
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
                <template
                  v-slot:item.codigo="props"
                >{{ props.item.codigo + " - " + props.item.titulo }}</template>
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
        <v-btn color="indigo darken-4" outlined text @click="dialog = false">Voltar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["UI"],
  data: () => ({
    dialog: false,
    headers: [
      {
        text: "Série/Subsérie Associada",
        align: "center",
        value: "codigo",
        width: "80%",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Tipo",
        align: "center",
        value: "tipo",
        width: "20%",
        class: ["table-header", "body-2", "font-weight-bold"]
      }
    ]
  })
};
</script>