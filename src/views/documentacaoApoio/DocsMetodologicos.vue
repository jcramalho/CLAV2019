<template>
<v-main v-if="response" class="px-12">
    <p class="content-title-1" >{{ response.classe }}</p>
    <div v-for="entrada in response.entradas" :key="entrada._id">
      <p class="content-text px-8 py-2">{{ entrada.descricao }}</p>
      <v-container fluid class="ma-0 px-12">
          <ul class="px-9 pt-3">
              <li v-for="elemento in entrada.elementos" :key="elemento._id">
                  <span v-html="compiledMarkdownOmmitParagraph(elemento.texto)"></span>
              </li>
          </ul>
        </v-container>
    </div>
</v-main>
</template>

<script>
import marked from "marked";
export default {
    name: "DocsMetodologicos",
    data() {
        return {
            response: null,
            publicPath: process.env.BASE_URL
        };
    },
    methods: {
      compiledMarkdownOmmitParagraph: function(d) {
        return marked.inlineLexer(d || "", []);
      }
    },
    async mounted() {
        this.response = (await this.$request("get", "/documentacaoApoio")).data[this.$route.meta.index]; //falta indice dinamico

        console.log(this.response)

        window.scrollTo(0, 0);
    }
};
</script>

<style scoped>
ul li {
    list-style: none;
    color: #606060;
    font-size: 0.9em;
    margin-bottom: 1rem;
    position: relative;
}

ul li::before {
    content: "\2022";
    position: absolute;
    left: -2rem;
    top: -2.35rem;
    font-size: 4em;
    color: #4da0d0;
}
</style>