<template>
  <div>
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Relação com Série/Subsérie</div>
      </v-col>
      <v-col cols="12" xs="12" sm="9">
        <v-row>
          <!-- {{newSerie.relacoes}} -->
          <v-col sm="12" xs="12" v-if="newSerie.relacoes[0]">
            <v-data-table :headers="headers" :items="newSerie.relacoes" hide-default-footer>
              <template v-slot:item.relacao="props">
                {{
                props.item.relacao
                }}
              </template>
              <template v-slot:item.tipo="props">
                {{
                props.item.serieRelacionada.tipo
                }}
              </template>
              <template v-slot:item.edicao="props">
                <td>
                  <v-icon color="red darken-2" dark @click="remove(props.item)">remove_circle</v-icon>
                </td>
              </template>
              <template v-slot:item.serieRelacionada="props">
                {{
                props.item.serieRelacionada.codigo +
                " - " +
                props.item.serieRelacionada.titulo
                }}
              </template>
            </v-data-table>
            <hr style="border: 3px solid indigo; border-radius: 2px;" />
          </v-col>
        </v-row>
        <!-- Novo form para adicionar relação -->
        <v-form ref="addRel" :lazy-validation="false">
          <v-row>
            <v-col sm="3" xs="12">
              <v-autocomplete
                :rules="[v => !!v || 'Campo obrigatório!']"
                v-model="rel"
                :items="listaRelacoes"
                label="Relação"
                solo
                clearable
              ></v-autocomplete>
            </v-col>
            <v-col sm="4" xs="12">
              <v-combobox
                :rules="[v => !!v || 'Campo obrigatório!']"
                v-model="codrel"
                :items="getCodigos"
                label="Código"
                solo
                clearable
              >
                <!-- <template v-slot:item="{ item }">{{ item.codigo + ' - ' + item.titulo}}</template>
                <template v-slot:selection="{ item }">{{ item.codigo + ' - ' + item.titulo}}</template>-->
              </v-combobox>
            </v-col>
            <v-col sm="4" xs="12">
              <v-select
                :disabled="iscodvalido"
                :rules="[v => !!v || 'Campo obrigatório!']"
                label="Tipo de Classe"
                v-model="tipoClasse"
                :items="['Série', 'Subsérie']"
                chips
                solo
                clearable
              >
                <template v-slot:selection="data">
                  <v-chip>
                    <v-avatar left color="amber accent-3">{{ data.item[0] }}</v-avatar>
                    {{ data.item }}
                  </v-chip>
                </template>
              </v-select>
            </v-col>
            <v-col sm="1" xs="12">
              <v-btn icon text rounded @click="add()">
                <v-icon color="green lighten-1">add_circle</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col sm="12" xs="12">
              <v-text-field
                :disabled="iscodvalido"
                :rules="[v => !!v || 'Campo obrigatório!']"
                v-model="titrel"
                label="Título"
                solo
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="!!alertOn">
            <v-col>
              <v-alert dismissible dense text type="error">Relação já existente!</v-alert>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "RelacoesClasse",
  props: ["newSerie", "classes"],
  data() {
    return {
      tipoClasse: null,
      eSerie: false,
      eSubserie: false,
      iscodvalido: false,
      alertOn: false,
      rel: "",
      classerel: "",
      codrel: "",
      titrel: "",
      listaRelacoes: [
        "Antecessora de",
        "Sucessora de",
        "Complementar de",
        "Sintetizado por",
        "Síntese de",
        "Suplemento de",
        "Suplemento para"
      ],
      headers: [
        {
          text: "Relação",
          align: "center",
          value: "relacao",
          width: "20%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Classe Relacionada",
          align: "center",
          value: "serieRelacionada",
          width: "65%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Tipo",
          align: "center",
          value: "tipo",
          width: "10%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          value: "edicao",
          sortable: false,
          width: "5%",
          class: ["table-header", "body-2", "font-weight-bold"]
        }
      ]
    };
  },
  computed: {
    getCodigos() {
      return this.classes.map(e => e.codigo);
    }
  },
  watch: {
    codrel: function(novo, old) {
      let c = this.classes.find(e => e.codigo == novo);

      if (c != undefined) {
        this.iscodvalido = true;
        this.titrel = c.titulo;
        this.tipoClasse = c.tipo;
      } else {
        this.iscodvalido = false;
      }
    }
  },
  methods: {
    remove: function(item) {
      this.newSerie.relacoes = this.newSerie.relacoes.filter(e => {
        return (
          e.relacao != item.relacao ||
          e.serieRelacionada.codigo != item.serieRelacionada.codigo
        );
      });
    },
    // add2: async function() {
    //   this.alertOn = false;

    //   if (this.$refs.addRel.validate()) {
    //     if (!(await this.validateRelacao())) {
    //       this.newSerie.relacoes.push({
    //         relacao: this.rel,
    //         serieRelacionada: {
    //           codigo: this.classerel.codigo,
    //           titulo: this.classerel.titulo
    //         }
    //       });
    //       this.$refs.addRel.reset();
    //     } else {
    //       this.alertOn = true;
    //     }
    //   }
    // },
    add: async function() {
      this.alertOn = false;

      if (this.$refs.addRel.validate()) {
        if (!(await this.validateRelacao())) {
          this.newSerie.relacoes.push({
            relacao: this.rel,
            serieRelacionada: {
              codigo: this.codrel,
              titulo: this.titrel,
              tipo: this.tipoClasse
            }
          });
          this.$refs.addRel.reset();
        } else {
          this.alertOn = true;
        }
      }
    },
    validateRelacao: function() {
      return this.newSerie.relacoes.some(el => {
        return (
          el.relacao == this.rel &&
          el.serieRelacionada.codigo == this.classerel.codigo
        );
      });
    }
  }
};
</script>
