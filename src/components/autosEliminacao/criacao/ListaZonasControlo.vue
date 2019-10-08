<template>
    <div>
    <v-expansion-panel 
        class="ma-1" 
        v-for="(item,index) of this.auto.zonaControlo"
        :key="index"
    >
        <v-expansion-panel-header>
            <v-row>
                <v-col :md="2">
                    <div class="info-label">Código da Classe:</div>
                </v-col>
                <v-col>
                    <div class="info-content">{{ item.codigo }}</div>
                </v-col>
            </v-row>
        </v-expansion-panel-header>

        <v-expansion-panel-content>
            <div>OLA</div>
            <v-row justify="end">
            <v-btn color="red darken-4" dark text @click="limparZC">Limpar</v-btn>
            <v-btn color="green darken-4" dark text @click="adicionarZC">Adicionar</v-btn>
            </v-row>
        </v-expansion-panel-content>
        <v-dialog v-model="erroDialog" width="700" persistent>
            <v-card outlined>
                <v-card-title class="red darken-4 title white--text" dark>
                Erro: Não foi possível adicionar a Zona de Controlo
                </v-card-title>

                <v-card-text>
                <span class="subtitle-1" style="white-space: pre-wrap" v-html="erro">
                </span>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                <v-btn color="red darken-4" text @click="erroDialog = false">
                    Fechar
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        </v-expansion-panel>
        </div>
</template>
<script>
export default {
    props: ["classes","entidades","auto"],

    data: () => ({
        classe: null,
        ni: "Vazio",
        dono: null,
        dataInicio: null,
        dataFim: null,
        uiPapel: null,
        uiDigital: null,
        uiOutros: null,

        natureza: ["Vazio","Dono","Paticipante"],
        
        erro: null,
        erroDialog: false,
    }),
    methods: {
        limparZC: function() {
            this.classe = null
            this.ni = "Vazio"
            this.dono = null
            this.dataInicio = null
            this.dataFim = null
            this.uiPapel = null
            this.uiDigital = null
            this.uiOutros = null
        },
        adicionarZC: async function() {
            const re = /\d{4}/
            const reUI = /^-?\d*(\.\d\d?)?$/
            if(!this.classe || !this.dataInicio || !this.dataFim) {
                this.erro = " Verifique se os campos <strong>Código da Classe,"+
                            " Data de Início e Data de Fim</strong> se encontram devidamente preenchidos."
                this.erroDialog = true
            } else if(!re.test(this.dataInicio) || !re.test(this.dataFim)) {
                this.erro = " Verifique se os campos <strong>"+
                            " Data de Início e Data de Fim</strong> se encontram devidamente preenchidos."
                this.erroDialog = true
            } else {
                var codigo = this.classe.split(" - ")[0]
                var classe = await this.$request("get","/api/classes/c"+codigo)
                var titulo = classe.data.titulo
                var prazoConservacao = classe.data.pca.valores
                var destino = classe.data.df.valor
                var dataInicio = this.dataInicio
                var dataFim = this.dataFim
                if(this.ni == 'Vazio') var ni = ''
                else var ni = this.ni
                if(!this.dono) var dono = ''
                else var dono = this.dono.split(' - ')[1]
                if(!this.uiPapel || this.uiPapel=='0') var uiPapel = ''
                else if(!reUI.test(this.uiPapel)) {
                    this.erro = " Verifique se o campo <strong>"+
                            "Medição de UI em Papel</strong> se encontra devidamente preenchidos."
                    this.erroDialog = true
                } else var uiPapel = this.uiPapel
                if(!this.uiDigital || this.uiDigital=='0') var uiDigital = ''
                else if(!reUI.test(this.uiDigital)) {
                    this.erro = " Verifique se o campo <strong>"+
                            "Medição de UI Digital</strong> se encontra devidamente preenchidos."
                    this.erroDialog = true
                } else var uiDigital = this.uiDigital
                if(!this.uiOutros || this.uiOutros=='0') var uiOutros = ''
                else if(!reUI.test(this.uiOutros)) {
                    this.erro = " Verifique se o campo <strong>"+
                            "Medição de UI noutro Suporte</strong> se encontra devidamente preenchidos."
                    this.erroDialog = true
                } else var uiOutros = this.uiOutros

                this.auto.zonaControlo.push({
                    codigo: codigo,
                    titulo: titulo,
                    prazoConservacao: prazoConservacao,
                    destino: destino,
                    ni: ni,
                    dono: dono,
                    dataInicio: dataInicio,
                    dataFim: dataFim,
                    uiPapel: uiPapel,
                    uiDigital: uiDigital,
                    uiOutros: uiOutros,
                    agregacoes: []
                })

                this.limparZC()
            }
        },
    }
}
</script>
<style>
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
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>