<template>
  <div>
  <v-expansion-panels flat focusable v-model="panel" class="mb-5">
    <v-expansion-panel>
      <v-expansion-panel-header disable-icon-rotate color="#dee2f8" ripple>
        <b style="color:#1a237e">Criar Classe / Série</b>

        <template v-slot:actions>
          <v-icon color="sucess" rounded>add</v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content color="indigo lighten-5">
        <v-card flat color="indigo lighten-5">
          <v-card-text>
            <v-form :lazy-validation="false">
              <v-row>
                <v-col>
                  <v-text-field v-model="codigo" label="Código"></v-text-field>
                </v-col>

                <v-col>
                  <v-text-field
                    v-model="referencia"
                    label="Referência"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="titulo"
                    label="Título"
                  ></v-text-field>
                </v-col>
                
                <v-col>
                  <v-text-field
                    v-model="seriesDocumentais"
                    label="Séries Documentais"
                    :rules="[v => !!v || 'Preenchimento Obrigatório']"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  <v-text-field
                    v-model="pca"
                    :rules="pcaRules"
                    label="Prazo de Conservação Administrativa"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="notasPCA"
                    label="Notas"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  <v-select
                    v-model="df"
                    item-text="label"
                    item-value="value"
                    :rules="[v => !!v || 'Preenchimento Obrigatório']"
                    :items="destino"
                    label="Destino Final"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="notasDF"
                    label="Notas"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-text style="position: relative">
            <v-fab-transition>
              <v-btn @click="newClasse" color="indigo darken-2" dark absolute right bottom fab>
                <v-icon>add</v-icon>
              </v-btn>
            </v-fab-transition>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
  <v-data-table
    v-if="classes.length>0"
    :headers="headers"
    :items="classes"
    class="elevation-1 mt-2"
  />

  <v-snackbar
    v-model="snackbar"
    :color="color"
    :timeout="1000"
  >
    {{ message }}
    <v-btn
      color="white"
      text
      @click="snackbar = false"
    >
      Fechar
    </v-btn>
  </v-snackbar>
  </div>
</template>
<script>
export default {
  props: ["classes"],
  data: () => ({
    panel: [0],
    codigo: "",
    referencia: "",
    titulo: "",
    seriesDocumentais: "",
    df: "",
    notasDF: "",
    pca: "",
    notasPCA: "",
    pcaRules: [
      (v) => /^[0-9]*$/.test(v) || "Apenas são aceites caracteres numéricos.",
      v => !!v || "Preenchimento obrigatório"
    ],
    snackbar: false,
    message: "",
    color: "",
    destino: [
      {
        label: 'Eliminação',
        value: 'E'
      },
      {
        label: 'Conservação',
        value: 'C'
      },
      {
        label: 'Conservação Parcial',
        value: 'CPP'
      }
    ],
    headers: [
      { text: "Código", value: "codigo", class: "subtitle-1" },
      { text: "Referência", value: "referencia", class: "subtitle-1" },
      { text: "Séries Documentais", value: "seriesDocumentais", class: "subtitle-1" },
      { text: "PCA", value: "pca", class: "subtitle-1" },
      { text: "Destino Final", value: "df", class: "subtitle-1" }
    ]
  }),
  methods: {
    newClasse: function () {
      if(!this.codigo.trim() && !this.referencia.trim()) {
        this.snackbar=true;
        this.color="red darken-4"
        this.message = "O preenchimento de pelos menos um dos campos, código e referência é obrigatório"
      }
      else if(this.classes.find(e => e.codigo == this.codigo && e.referencia == this.referencia)) {
        this.snackbar=true;
        this.color="red darken-4"
        this.message = "Classe / Série já existente"
      }
      else if(/^[0-9]*$/.test(this.pca) && this.df && this.seriesDocumentais.trim()) {
        this.classes.unshift({
          codigo: this.codigo,
          referencia: this.referencia,
          titulo: this.titulo,
          seriesDocumentais: this.seriesDocumentais,
          df: this.df,
          notasDF: this.notasDF,
          pca: this.pca,
          notasPCA: this.notasPCA
        })
        this.snackbar=true;
        this.color = "success"
        this.message = "Classe / Série adicionada com sucesso"
        if(/[0-9]+/.test(this.referencia)) this.referencia = parseInt(this.referencia) + 1;
        else this.referencia = ""
        if(/[0-9]+\.[0-9]+\.[0-9]/.test(this.codigo)) this.codigo = this.codigo.split(".")[0] + "." + this.codigo.split(".")[1] + "."
        else this.codigo = ""
      }
    }
  }
}
</script>