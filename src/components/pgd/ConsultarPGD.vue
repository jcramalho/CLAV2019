<template>
  <div>
    <v-card class="ma-4">
    <v-card-title class="indigo darken-4 white--text">
      {{ titulo }}
    </v-card-title>

    <v-card-text>
      <v-row v-for="(item, index) in objeto" v-bind:key="index">
        <v-col cols="2" v-if="item.text">
          <div class="info-label">
            {{ item.campo }}

            <InfoBox
              v-if="item.tipo === 'Legislação'"
              :header="item.campo"
              :text="myhelp.Legislacao.Campos[item.campo]"
            />
          </div>
        </v-col>

        <v-col v-if="item.text">
          <div v-if="item.campo === 'Link'" class="info-content">
            <a :href="item.text" target="_blank">{{ item.text }}</a>
          </div>
          <div v-else>
            <div v-if="item.campo === 'Entidades'" class="info-content">
              <ul>
                <li v-for="(ent, i) in item.text" :key="i">
                  <a :href="'/entidades/ent_' + ent.sigla">{{ ent.sigla }}</a>
                </li>
              </ul>
            </div>
            <div v-else class="info-content">{{ item.text }}</div>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2">
          <div class="info-label">
            Tabela de Seleção
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-list>
            <v-list-group
              v-for="(classe, i) in classes"
              :key="i"
              multiple
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>
                    <span v-if="classe.codigo">{{classe.codigo}} <span class="ml-7">{{classe.titulo}}</span></span>
                    <span v-else class="ml-9">{{classe.titulo}}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </template>
                <ShowPGD :classe="classe"/>
            </v-list-group>
          </v-list>
          <!--v-data-table
            :headers="headers"
            :items="classes"
            :search="search"
            class="elevation-1"
            :footer-props="footer_props"
          >
            <template v-slot:pageText="props">
              Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
              {{ props.itemsLength }}
            </template>
          </v-data-table-->
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  </div>
</template>
<script>
import ShowPGD from "@/components/pgd/ShowPGD.vue"
export default {
  props: ["classes","objeto","titulo"],
  components: {
    ShowPGD
  },
  data: () => ({
    search: "",
    headers: [
      {text: "Código", value: "codigo"},
      {text: "Referência", value: "referencia"},
      {text: "Título", value: "titulo"},
      {text: "PCA", value: "pca"},
      {text: "Destino Final", value: "df"},
    ],
    footer_props: {
      "items-per-page-options": [10, 20, 100],
      "items-per-page-text": "Mostrar"
    }
  })
}
</script>
<style>

.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  padding: 8px;
  width: 100%;
  border: 1px solid #1a237e;
  border-radius: 3px;
}
</style>