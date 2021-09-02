<template>
  <v-dialog v-model="dialogState" persistent max-width="90%">
    <v-card>
      <v-card-title class="indigo darken-4 white--text">
        <b>Adicionar Classe Área Orgânico-Funcional</b>
      </v-card-title>
      <br />
      <v-card-text>
        <v-form ref="form" :lazy-validation="false">
          <!-- <h5>Identificação</h5>
          <v-divider></v-divider>-->
          <v-row>
            <v-col md="3" sm="3">
              <div class="info-label">Código</div>
            </v-col>
            <v-col sm="3" md="3">
              <v-text-field
                v-model="newOrgFunc.codigo"
                :rules="[v => verificaCodigo(v) || !!v || 'Campo obrigatório!']"
                label="Código"
                solo
                clearable
              ></v-text-field>
            </v-col>
            <v-col xs="3" sm="3">
              <div class="info-label">Título</div>
            </v-col>
            <v-col sm="3" md="3">
              <v-text-field
                v-model="newOrgFunc.titulo"
                :rules="[v => !!v || 'Campo obrigatório!']"
                label="Título"
                solo
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="3" sm="3">
              <div class="info-label">Descrição</div>
            </v-col>
            <v-col sm="9" md="9">
              <v-text-field
                v-model="newOrgFunc.descricao"
                :rules="[v => !!v || 'Campo obrigatório!']"
                label="Descrição"
                solo
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="3" sm="3">
              <div class="info-label">Classe pai</div>
            </v-col>
            <v-col sm="9" md="9">
              <v-autocomplete
                v-model="newOrgFunc.eFilhoDe"
                :items="classesHierarquia"
                item-value="codigo"
                item-text="searchField"
                solo
                clearable
                label="Classe pai"
                chips
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        <strong>Classe Área Orgânico-Funcional</strong> em questão não existe!
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        Este campo pode não ser preenchido. Se assim for, a classe será do tipo
                        <i>N1</i>.
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="indigo darken-4" dark @click="dialogState = false">Voltar</v-btn>
        <v-btn color="indigo darken-4" dark @click="save">Adicionar</v-btn>
        <v-btn color="red darken-4" dark @click="apagar">Limpar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["classes", "dialog"],
  data: () => ({
    classesHierarquia: [],
    newOrgFunc: {
      codigo: "",
      titulo: "",
      descricao: "",
      eFilhoDe: null,
      tipo: ""
    }
  }),
  computed: {
    dialogState: {
      get() {
        return this.dialog;
      },
      set(val) {
        this.$emit("fecharDialog", false);
      }
    }
  },
  methods: {
    apagar() {
      this.$refs.form.reset();
    },
    tipo() {
      if (this.newOrgFunc.eFilhoDe == null) {
        this.newOrgFunc.tipo = "N1";
      } else {
        let classe = this.classes.find(
          e => e.codigo == this.newOrgFunc.eFilhoDe
        );

        if (classe.tipo == "N1") {
          this.newOrgFunc.tipo = "N2";
        } else {
          this.newOrgFunc.tipo = "N3";
        }
      }
    },
    async save() {
      if (this.$refs.form.validate()) {
        await this.tipo();
        this.classes.push(Object.assign({}, this.newOrgFunc));
        this.dialogState = false;
        this.$refs.form.reset();
      }
    },
    verificaCodigo(v) {
      if (this.classes.some(e => e.codigo == v)) {
        return "Código já existente!";
      } else {
        return false;
      }
    }
  },
  created() {
    this.classesHierarquia = this.classes
      .filter(classe => classe.tipo == "N1" || classe.tipo == "N2")
      .sort((a, b) => a.codigo.localeCompare(b.codigo))
      .map(classe => {
        return {
          searchField: classe.codigo + " - " + classe.titulo,
          codigo: classe.codigo
        };
      });
  }
};
</script>
