<template>
  <v-card 
    class="overflow-y-auto" max-height="100%">
    <div v-for="(noticia,i) in noticias" :key="i" class="noticia" @click="go(noticia.id)">
      <p>{{ noticia.titulo }}</p>
      <v-row>
        <v-col>
          <span style="font-size: 12px">Publicada: {{ noticia.activa ? "Sim" : "Não"}}</span>
        </v-col>
        <v-spacer/>
        <v-col>
          <span style="font-size: 12px">{{ noticia.data }}</span>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
import { NIVEL_MINIMO_ALTERAR } from "@/utils/consts";

export default {
  data: () => ({
    tipo: "Notícias",
    noticias: [],
    campos: [],
    cabecalhos: [],
    operacoes: [],
    noticiasReady: false,
    search: "",
    headers: [],
    dialog: false,
    footer_props: {
      "items-per-page-options": [10, 20, 100],
      "items-per-page-text": "Mostrar"
    },
    snackbar: false,
    text: "",
    color: "",
    timeout: 4000,
    eliminarId: "",
    done: false
  }),

  components: {
  },

  methods: {

    preparaLista(level, listaNoticias) {
      let myTree = [];

      if (this.operacoes.length != 0) {
        for (let i = 0; i < listaNoticias.length; i++) {
          if (level >= NIVEL_MINIMO_ALTERAR) {
            myTree.push({
              titulo: listaNoticias[i].titulo,
              data: listaNoticias[i].data,
              ativa: listaNoticias[i].ativa,
              id: listaNoticias[i]._id
            });
          } else {
            myTree.push({
              titulo: listaNoticias[i].titulo,
              data: listaNoticias[i].data,
              id: listaNoticias[i]._id
            });
          }
        }
      } else {
        for (let i = 0; i < listaNoticias.length; i++) {
          if (listaNoticias[i].ativa == true) {
            myTree.push({
              titulo: listaNoticias[i].titulo,
              data: listaNoticias[i].data,
              id: listaNoticias[i]._id
            });
          }
        }
      }
      return myTree;
    },

    go(id) {
      this.$router.push("/noticias/" + id);
    },

    fecharSnackbar() {
      this.snackbar = false;
      if (this.done == true) this.getNoticias();
    },

    async getNoticias() {
      try {
        let response = await this.$request("get", "/noticias");

        let level = this.$userLevel();

        this.preparaCabecalhos(level);

        this.preparaOperacoes(level);

        this.noticias = await this.preparaLista(level, response.data);

        this.noticiasReady = true;
      } catch (e) {
        return e;
      }
    }
  },

  created: async function() {
    try {
      let response = await this.$request("get", "/noticias");

      let level = this.$userLevel();
      
      this.noticias = await this.preparaLista(level, response.data);
    } catch (e) {
      return e;
    }
  }
};
</script>
<style scoped>
.noticia {
  background:  #f1f6f8;
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  color: black;
}
</style>