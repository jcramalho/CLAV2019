<template>
  <v-container>
    <v-row>
      <v-dialog v-model="dialog" width="95%" persistent>
        <v-card>
          <v-card-title class="headline">
            {{ p.codigo }} - {{ p.titulo }}
          </v-card-title>
          <v-card-text>
            <v-row justify="end">
              <v-col :cols="p.procTrans === 'S' ? 2 : 2">
                <span class="table-header subtitle-2 font-weight-bold"
                  >Aplica a todos</span
                >
              </v-col>
              <v-col :cols="p.procTrans === 'S' ? 1 : 7">
                <span class="table-header subtitle-2 font-weight-bold"
                  >Dono</span
                >
                <v-checkbox
                  color="indigo darken-4"
                  v-model="todosDonos"
                ></v-checkbox>
              </v-col>
              <v-col v-if="p.procTrans === 'S'" cols="6">
                <span class="table-header subtitle-2 font-weight-bold"
                  >Participante</span
                >
                <v-radio-group row v-model="todosParticipantes">
                  <v-radio
                    color="indigo darken-4"
                    label="Não part."
                    value="NP"
                  ></v-radio>
                  <v-radio
                    color="indigo darken-4"
                    v-for="p in participacao"
                    :key="p.idtermo"
                    :label="p.termo.substring(0, 3)"
                    :value="p.termo"
                    class="caption"
                  ></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>

            <v-data-table
              :items="p.entidades"
              :headers="headers"
              class="ma-1"
              :footer-props="footerConfig"
            >
              <template v-slot:item="props">
                <tr>
                  <td>
                    {{ props.item.label }}
                  </td>
                  <td>
                    <v-checkbox
                      color="indigo darken-4"
                      v-model="props.item.dono"
                    ></v-checkbox>
                  </td>
                  <td v-if="p.procTrans === 'S'">
                    <v-radio-group v-model="props.item.participante" row>
                      <v-radio
                        color="indigo darken-4"
                        label="Não part."
                        value="NP"
                      ></v-radio>
                      <v-radio
                        color="indigo darken-4"
                        v-for="p in participacao"
                        :key="p.idtermo"
                        :label="p.termo.substring(0, 3)"
                        :value="p.termo"
                        class="caption"
                      ></v-radio>
                    </v-radio-group>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn rounded class="clav-linear-background white--text" @click="selecionar">
              Guardar
            </v-btn>

            <v-btn @click="cancelar" color="red darken-4" rounded class="white--text">
              Cancelar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ["p"],

  data: function () {
    return {
      dialog: false,
      participacao: [],
      todosDonos: false,
      todosParticipantes: "NP",

      headers: [
        {
          text: "Entidade",
          value: "searchField",
          width: "40%",
          class: ["table-header", "subtitle-2", "font-weight-bold"],
          sortable: false,
        },
        {
          text: "Dono",
          value: "dono",
          class: ["table-header", "subtitle-2", "font-weight-bold"],
          sortable: false,
        },
        this.p.procTrans === "S"
          ? {
              text: "Participante",
              value: "participante",
              class: ["table-header", "subtitle-2", "font-weight-bold"],
              sortable: false,
            }
          : "",
      ],
      footerConfig: {
        "items-per-page-text": "Entidades por página",
        "items-per-page-options": [10, 20, 50, 100, -1],
        "items-per-page-all-text": "Todos",
      },
    };
  },

  watch: {
    todosDonos: function () {
      for (let i = 0; i < this.p.entidades.length; i++)
        this.p.entidades[i].dono = this.todosDonos;
    },
    todosParticipantes: function () {
      for (let i = 0; i < this.p.entidades.length; i++)
        this.p.entidades[i].participante = this.todosParticipantes;
    },
  },

  created: async function () {
    try {
      await this.tipoParticipacao();
    } catch (e) {
      console.log(
        "Erro no carregamento da travessia ou dos tipos de participação..."
      );
    }
  },

  mounted: function () {
    this.dialog = true;
  },

  methods: {
    // Lista com todos os tipos de intervenção possíveis
    tipoParticipacao: async function () {
      var resPar = await this.$request(
        "get",
        "/vocabularios/vc_processoTipoParticipacao"
      );

      this.participacao = resPar.data;
    },

    // Cancela sem alterar nada
    cancelar: function () {
      this.$emit("cancelada");
    },

    // Devolve a seleção para cima
    selecionar: function () {
      var contador = 0; // Controla se este proc entra ou não na contagem dos selecionados
      let i = 0,
        encontreiDono = false,
        encontreiParticipante = false;
      while (
        i < this.p.entidades.length &&
        (!encontreiDono || !encontreiParticipante)
      ) {
        if (this.p.entidades[i].dono) encontreiDono = true;
        if (this.p.entidades[i].participante != "NP")
          encontreiParticipante = true;
        i++;
      }
      if (encontreiDono) this.p.dono = true;
      else this.p.dono = false;
      if (encontreiParticipante) this.p.participante = true;
      else this.p.participante = false;

      if (encontreiDono || encontreiParticipante) {
        if (!this.p.edited) {
          this.p.edited = true;
          contador++;
        }
      } else {
        if (this.p.edited) {
          this.p.edited = false;
          contador = -1;
        }
      }

      this.p.inc = contador;
      this.$emit("selecionadas", this.p);
    },
  },
};
</script>
