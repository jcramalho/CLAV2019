<template>
  <div>
    <v-list>
      <v-list-group>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title class="info-label">Adicionar Agregação</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item-content class="mx-4">
          <v-list-item-title>
            <v-row>
              <v-col :md="2">
                <div class="info-label">Código da Agregação:</div>
              </v-col>
              <v-col>
                <v-text-field
                  hint="Exemplo: AS_DGLAB_1/2019"
                  v-model="codigo"
                  solo
                  clearable
                >Insira um codigo para a agregação</v-text-field>
              </v-col>
              <v-col :md="2">
                <div class="info-label">Titulo da Agregação:</div>
              </v-col>
              <v-col>
                <v-text-field
                  hint="Exemplo: Auditoria à Entidade A"
                  v-model="titulo"
                  solo
                  clearable
                >Insira um codigo para a agregação</v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col :md="2">
                <div class="info-label">Data de Contagem do PCA:</div>
              </v-col>
              <v-col>
                <v-text-field
                  hint="Exemplo: 2009"
                  v-model="dataContagem"
                  solo
                  clearable
                >Insira um codigo para a agregação</v-text-field>
              </v-col>
              <v-col :md="2">
                <div class="info-label">Natureza de Intervenção:</div>
              </v-col>
              <v-col>
                <v-select
                  label="Selecione a Natureza de Intervenção"
                  :items="natureza"
                  v-model="ni"
                  solo
                  dense
                ></v-select>
              </v-col>
            </v-row>
            <v-row justify="end">
              <v-btn color="red darken-4" dark text @click="limparAG">Limpar</v-btn>
              <v-btn color="green darken-4" dark text @click="adicionarAG">Adicionar</v-btn>
            </v-row>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-group>
    </v-list>
    <v-dialog v-model="erroDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title
          class="red darken-4 title white--text"
          dark
        >Erro: Não foi possível adicionar Agregação</v-card-title>

        <v-card-text>
          <span class="subtitle-1" style="white-space: pre-wrap" v-html="erro"></span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="erroDialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: ["auto","index"],

  data: () => ({
    codigo: null,
    titulo: null,
    dataContagem: null,
    ni: "Dono",
    natureza: ["Dono", "Participante"],
    erro: null,
    erroDialog: false,
  }),
  methods: {
    limparAG: function () {
      this.codigo = null
      this.titulo = null
      this.dataContagem = null,
      this.ni = "Dono"
    },
    adicionarAG: function () {
      const re = /\d{4}/;
      var currentTime = new Date();
      if(!this.codigo || !this.titulo || !this.dataContagem) {
        this.erro = " Verifique se os campos <strong>Código da Agregação," +
                    " Título da Agregação e Data de Contagem do PCA</strong> se encontram devidamente preenchidos.";
        this.erroDialog = true
      } else if(!re.test(this.dataContagem)) {
        this.erro =
          " Verifique se o campo <strong>" +
          "Data de Contagem do PCA</strong> se encontra devidamente preenchido.";
        this.erroDialog = true;
      } else {
        var res = parseInt(this.auto.zonaControlo[this.index].prazoConservacao) + parseInt(this.dataContagem)
        if(!(res<=currentTime.getFullYear())) {
          this.erro =
            "Note que a <strong>Prazo de Conservação Administrativa</strong> sumado com "+
            "<strong>Data de Contagem do PCA</strong> têm que ser <strong>inferior ou igual</strong> à data atual";
          this.erroDialog = true;
        } else {
          this.auto.zonaControlo[this.index].agregacoes.push({
            codigo: this.codigo,
            titulo: this.titulo,
            dataContagem: this.dataContagem,
            ni: this.ni
          })

          this.limparAG()
        }
      }
    }
  }
};
</script>
<style>
.consulta tr {
  vertical-align: top;
  border-bottom: 1px solid #ddd;
}

.consulta td {
  padding-left: 5px;
  padding-bottom: 5px;
  padding-top: 5px;
  align-content: center;
}

.consulta td:nth-of-type(2) {
  vertical-align: middle;
  padding-left: 15px;
}

.info-label {
  color: #2e7d32; /* green darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8f5e9; /* green lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #696969;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>