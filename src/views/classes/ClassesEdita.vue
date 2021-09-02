<template>
  <EditaClasse v-if="nivel > 2" :idc="$route.params.idClasse" />
  <EditaClasse12 v-else :idc="$route.params.idClasse" />
</template>

<script>
import EditaClasse from "@/components/classes/edicao/EditaClasse.vue"; // @ is an alias to /src
import EditaClasse12 from "@/components/classes/edicao/EditaClasse12.vue";

export default {
  components: {
    EditaClasse,
    EditaClasse12,
  },

  data: () => ({
    nivel: 0,
  }),

  created: function () {
    if (this.$route.params.idClasse.includes("-"))
      this.$request("get", `/pedidos/${this.$route.params.idClasse}`)
        .then((data) => {
          this.nivel = data.data.objeto.dados.codigo.split(".").length;
        })
        .catch((err) => console.log(err));
    else this.nivel = this.$route.params.idClasse.split(".").length;
  },
};
</script>
