<template>
  <v-card class="pa-3">
    <p class="clav-content-title-1">{{ tipo }}</p>
    <v-card-text>
      <v-tooltip top color="info" open-delay="500">
        <template v-slot:activator="{ on }">
          <v-text-field
            v-on="on"
            v-model="search"
            append-icon="search"
            label="Procurar / filtrar"
            text
            single-line
            hide-details
            clearable
            color="blue darken-3"
            class="mt-n2 mb-3 mx-6 font-weight-medium"
          ></v-text-field>
        </template>

        <span> Filtrar </span>
      </v-tooltip>

      <v-data-table
        v-if="this.headers[this.cabecalho.length - 1]"
        class="content-table"
        :headers="headers"
        :items="lista"
        :search="search"
        :footer-props="footer_props"
      >
        <template v-slot:no-results>
          <v-alert
            :value="true"
            color="error"
            icon="warning"
            class="font-weight-medium my-3"
            id="alerta-erro"
            >Não foram encontrados resultados para "{{ search }}".</v-alert
          >
        </template>

        <template v-slot:item="props">
          <ListagemTI
            v-if="tipo === 'Termos de Índice'"
            :item="props.item"
            @rowClicked="go($event.idClasse)"
          />

          <ListagemTE
            v-else-if="tipo == 'Tipologias de Entidade'"
            :item="props.item"
            @rowClicked="go($event.id)"
            @iconClicked="
              switchOperacao($event.operacao.descricao, $event.item.id)
            "
          />

          <ListagemE
            v-else-if="tipo == 'Entidades'"
            :item="props.item"
            @rowClicked="go($event.id)"
            @iconClicked="
              switchOperacao($event.operacao.descricao, $event.item.id)
            "
          />

          <ListagemLegislacao
            v-else-if="tipo == 'Legislação'"
            :item="props.item"
            @rowClicked="go($event.numero)"
            @iconClicked="
              switchOperacao($event.operacao.descricao, $event.item.id)
            "
          />

          <ListagemNot
            v-else-if="tipo == 'Notícias'"
            :item="props.item"
            @rowClicked="go($event.id)"
            @iconClicked="
              switchOperacao($event.operacao.descricao, props.item.id)
            "
          />
          <tr v-else-if="tipo == 'RADA/CLAV'">
            <td>{{ props.item.dataAprovacao }}</td>
            <td>{{ props.item.titulo }}</td>
            <td>
              <ul>
                <li v-for="(entidade, i) in props.item.entResp" :key="i">
                  <a :href="'/entidades/ent_' + entidade.sigla">{{
                    entidade.sigla + " - " + entidade.designacao
                  }}</a>
                </li>
              </ul>
            </td>
            <td>{{ props.item.estado }}</td>
            <td>
              <v-btn text @click="$emit('ver', props.item.codigo)"
                ><v-icon>remove_red_eye</v-icon></v-btn
              >
              <v-btn text @click="$emit('download', props.item.codigo)"
                ><v-icon color="#c62828">picture_as_pdf</v-icon></v-btn
              >
            </td>
            <!-- <td v-for="(campo, index) in props.item" v-bind:key="index">
              <div v-if="props.item">
                <div v-if="index === 'entidade'">
                  <a :href="'/entidades/ent_' + campo">{{ campo }}</a>
                </div>
                <div v-else>{{ campo }}</div>
              </div>
            </td> -->
          </tr>

          <tr
            v-else-if="tipo == 'Autos de Eliminação'"
            @click="go(props.item.id.replace(/\//g, '_'))"
          >
            <td v-for="(campo, index) in props.item" v-bind:key="index">
              <div v-if="props.item">
                <div v-if="index === 'entidade'">
                  <a :href="'/entidades/ent_' + campo">{{ campo }}</a>
                </div>
                <div v-else>{{ campo }}</div>
              </div>
            </td>
          </tr>

          <tr v-else @click="go(props.item.id)">
            <td v-for="(campo, index) in props.item" v-bind:key="index">
              <div>{{ campo }}</div>
            </td>
          </tr>
        </template>
        <template v-slot:[`item.entidades`]="{ item }">
          <span v-for="(ent, index) in item.entidades" :key="index">{{
            ent
          }}</span>
        </template>

        <template v-slot:pageText="props">
          Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
          {{ props.itemsLength }}
        </template>
      </v-data-table>
      <slot name="radatemp"></slot>
    </v-card-text>
  </v-card>
</template>

<script>
import ListagemTI from "@/components/generic/ListagemTI";
import ListagemTE from "@/components/generic/ListagemTE";
import ListagemE from "@/components/generic/ListagemE";
import ListagemLegislacao from "@/components/generic/ListagemLegislacao";
import ListagemNot from "@/components/generic/ListagemNot";

export default {
  props: ["lista", "tipo", "cabecalho", "campos", "ids"],
  components: {
    ListagemTI,
    ListagemTE,
    ListagemE,
    ListagemLegislacao,
    ListagemNot,
  },
  data: () => ({
    search: "",
    headers: [],
    dialog: false,
    footer_props: {
      "items-per-page-options": [10, 20, 100],
      "items-per-page-text": "Mostrar",
    },
  }),
  methods: {
    go(id) {
      let idLeg = "";
      switch (this.tipo) {
        case "Entidades":
          this.$router.push("/entidades/ent_" + id);
          break;
        case "Tipologias de Entidade":
          this.$router.push("/tipologias/tip_" + id);
          break;
        case "Legislação":
          for (let i = 0; i < this.ids.length; i++) {
            if (this.ids[i].numero === id) {
              idLeg = this.ids[i].id;
              break;
            }
          }
          this.$router.push("/legislacao/" + idLeg);
          break;
        case "Termos de Índice":
          this.$router.push("/classes/consultar/c" + id);
          break;
        case "Autos de Eliminação":
          this.$router.push("/autosEliminacao/ae_" + id);
          break;
        case "Notícias":
          this.$router.push("/noticias/" + id);
          break;
      }
    },

    goEditar(id) {
      switch (this.tipo) {
        case "Entidades":
          this.$router.push("/entidades/editar/ent_" + id);
          break;
        case "Tipologias de Entidade":
          this.$router.push("/tipologias/editar/tip_" + id);
          break;
        case "Legislação":
          this.$router.push("/legislacao/editar/" + id);
          break;
        case "Notícias":
          this.$router.push("/noticias/editar/" + id);
          break;
        // case "Termos de Índice":
        //   this.$router.push("/classes/consultar/c" + id);
        //   break;
        // case "Autos de Eliminação":
        //   this.$router.push("/autosEliminacao/ae_" + id);
        //   break;
        default:
          this.$router.push("/");
          break;
      }
    },

    switchOperacao(op, id) {
      switch (op) {
        case "Alteração":
          this.goEditar(id);
          break;

        case "Remoção":
          break;

        default:
          break;
      }
    },
  },
  created: function () {
    try {
      for (let i = 0; i < this.cabecalho.length; i++) {
        if (this.campos[i] === "operacoes")
          this.headers[i] = {
            text: this.cabecalho[i],
            value: this.campos[i],
            width: "auto",
            sortable: false,
            class: "subtitle-3",
          };
        else if (this.campos[i] === "sumario")
          this.headers[i] = {
            text: this.cabecalho[i],
            value: this.campos[i],

            sortable: false,
            width: "auto",
            class: "subtitle-3",
          };
        else if (this.campos[i] === "entidades")
          this.headers[i] = {
            text: this.cabecalho[i],
            value: this.campos[i],

            sortable: true,
            width: "auto",
            class: "subtitle-3",
          };
        else if (this.campos[i] === "data" || this.campos[i] === "numero")
          this.headers[i] = {
            text: this.cabecalho[i],
            value: this.campos[i],

            sortable: true,
            width: "auto",
            class: "subtitle-3",
          };
        else if (
          this.campos[i] === "sigla" ||
          this.campos[i] === "estado" ||
          this.campos[i] === "internacional"
        )
          this.headers[i] = {
            text: this.cabecalho[i],
            value: this.campos[i],
            sortable: true,
            width: "auto",
            class: "subtitle-3",
          };
        else if (this.campos[i] === "designacao")
          this.headers[i] = {
            text: this.cabecalho[i],
            value: this.campos[i],
            sortable: true,
            width: "auto",
            class: "subtitle-3",
          };
        else if (this.campos[i] === "tipo")
          this.headers[i] = {
            text: this.cabecalho[i],
            value: this.campos[i],
            sortable: true,
            width: "auto",
            class: "subtitle-3",
          };
        else
          this.headers[i] = {
            text: this.cabecalho[i],
            value: this.campos[i],
            sortable: true,
            width: "auto",
            class: "subtitle-3",
          };
      }
    } catch (e) {
      return e;
    }
  },
};
</script>

<style scoped>
.content-table {
  background-color: #f1f6f8 !important;
  border-radius: 10px;
}

.info-content {
  padding: 5px;
  width: 100%;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px 10px 0 0;
}
</style>
