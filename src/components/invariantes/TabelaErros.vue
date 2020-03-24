<template>
  <v-card>
    <v-card-title class="indigo darken-2 white--text" fill-height>
      <div>
        <h2>{{ mutableInv.descRel }}</h2>
        <h4 v-html="mutableInv.descInv"></h4>
      </div>
    </v-card-title>

    <v-toolbar text color="white">
      <v-toolbar-title>PNs que não cumprem o invariante:</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <div v-if="mutableInv.results.length != 0">
      <v-data-table :headers="headers" :items="mutableInv.results">
        <template v-slot:item="{ item }">
          <tr>
            <td v-for="v in Object.keys(item)" :key="v" class="text-center">
              <a
                v-if="item[v].includes('#c')"
                @click="goToClass(item[v].split('#')[1])"
              >
                {{ item[v].split("#")[1] }}
              </a>
              <span v-else-if="item[v].includes('#')">
                {{ item[v].split("#")[1] }}
              </span>
              <span v-else>{{ item[v] }}</span>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
    <div v-else>
      <v-alert :value="true" color="success">
        Não há PNs a apresentar...
      </v-alert>
    </div>

    <v-card-actions>
      <v-btn class="ma-2" color="indigo darken-2" @click="goBack()" dark>
        Voltar à lista de invariantes
      </v-btn>
      <v-spacer />
      <v-btn
        v-if="mutableInv.isFixable && mutableInv.results.length > 0"
        class="ma-2"
        color="indigo darken-2"
        :loading="aCorrigir"
        @click="fix()"
        dark
      >
        Corrigir erros do invariante
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["inv", "idRel", "idInv"],
  data: () => ({
    headers: [],
    aCorrigir: false,
    mutableInv: null
  }),

  methods: {
    goBack: function() {
      this.$router.push("/invariantes");
    },
    goToClass: function(classe) {
      this.$router.push("/classes/consultar/" + classe);
    },
    fix: async function() {
      this.$emit("erro", "");
      this.aCorrigir = true;
      try {
        await this.$request("post", "/invariantes", {
          idRel: this.idRel,
          idInv: this.idInv
        });
        try {
          var response = await this.$request(
            "get",
            "/invariantes?idRel=" + this.idRel + "&idInv=" + this.idInv
          );
          this.mutableInv = response.data;
        } catch (erro) {
          this.$emit(
            "erro",
            "Não foi possível testar o invariante... Tente novamente mais tarde."
          );
        }
      } catch (erro) {
        this.$emit("erro", "Não foi possível realizar a correção dos erros...");
      }
      this.aCorrigir = false;
    }
  },

  created: function() {
    this.mutableInv = JSON.parse(JSON.stringify(this.inv));
    if (this.mutableInv.results.length > 0) {
      Object.keys(this.mutableInv.results[0]).forEach(key => {
        this.headers.push({ text: key, align: "center", value: key });
      });
    }
  }
};
</script>
