<template>
    <v-expansion-panel popout focusable>
        <v-expansion-panel-header class="expansion-panel-heading">
            <div>Adicionar Zona de Controlo</div>
        </v-expansion-panel-header>

        <v-expansion-panel-content>
            <v-row>
            <v-col cols="2">
                <div class="info-label">Codigo da Classe:</div>
            </v-col>
            <v-col>
                <v-autocomplete
                label="Selecione a classe"
                :items="classes"
                v-model="classe"
                solo
                dense
                ></v-autocomplete>
            </v-col>
            </v-row>
            <v-row>
            <v-col cols="2">
                <div class="info-label">Natureza de Intervenção:</div>
            </v-col>
            <v-col>
                <v-select
                label="Selecione a classe"
                :items="natureza"
                v-model="ni"
                solo
                dense
                ></v-select>
            </v-col>
            </v-row>
            <v-row>
            <v-col cols="2">
                <div class="info-label">Dono PN:</div>
            </v-col>
            <v-col>
                <v-autocomplete
                label="Selecione a entidade dona do processo"
                :items="entidades"
                v-model="dono"
                solo
                dense
                ></v-autocomplete>
            </v-col>
            </v-row>
            <v-row>
            <v-col cols="2">
                <div class="info-label">Data de Início:</div>
            </v-col>
            <v-col>
                <v-text-field 
                hint="Exemplo: 1995" 
                :rules="rulesDate"
                v-model="dataInicio"
                >
                Insira um ano
                </v-text-field>
            </v-col>
            </v-row>
            <v-row>
            <v-col cols="2">
                <div class="info-label">Data de Fim:</div>
            </v-col>
            <v-col>
                <v-text-field 
                hint="Exemplo: 1995" 
                :rules="rulesDate"
                v-model="dataFim"
                >
                Insira um ano
                </v-text-field>
            </v-col>
            </v-row>
            <v-row>
            <v-col cols="2">
                <div class="info-label">Medição de UI em Papel:</div>
            </v-col>
            <v-col>
                <v-text-field 
                hint="Exemplo: 11.50" 
                :rules="rulesUI"
                v-model="uiPapel"
                >
                Insira um ano
                </v-text-field>
            </v-col>
            </v-row>
            <v-row>
            <v-col cols="2">
                <div class="info-label">Medição de UI Digital:</div>
            </v-col>
            <v-col>
                <v-text-field 
                hint="Exemplo: 16.00" 
                :rules="rulesUI"
                v-model="uiDigital"
                >
                Insira um ano
                </v-text-field>
            </v-col>
            </v-row>
            <v-row>
            <v-col cols="2">
                <div class="info-label">Medição de UI noutro Suporte:</div>
            </v-col>
            <v-col>
                <v-text-field 
                hint="Exemplo: 150.75" 
                :rules="rulesUI"
                v-model="uiOutros"
                >
                Insira um ano
                </v-text-field>
            </v-col>
            </v-row>
            <v-row justify="end">
            <v-btn color="red darken-4" dark text>Limpar</v-btn>
            <v-btn color="green darken-4" dark text @click="adicionarZC">Adicionar</v-btn>
            </v-row>
        </v-expansion-panel-content>
        </v-expansion-panel>
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
        rulesDate: [
            value => !!value || 'Data Obrigatória',
            value => {
                const pattern = /[0-9]{4}/
                return pattern.test(value) || 'Valor numérico com 4 dígitos'
            }
        ],
        rulesUI: [
            value => {
                const pattern = /[0-9.]*/
                return pattern.test(value) || 'Input numérico com 2 casas decimais'
            }
        ],
    }),
    methods: {
        adicionarZC: async function() {
            if(!this.classe || !this.dataInicio || !this.dataFim)
                console.log("Erro"+this.classe+" - "+this.dataInicio)
            else {
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
                else var uiPapel = this.uiPapel
                if(!this.uiDigital || this.uiDigital=='0') var uiDigital = ''
                else var uiDigital = this.uiDigital
                if(!this.uiOutros || this.uiOutros=='0') var uiOutros = ''
                else var uiOutros = this.uiOutros

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
                })
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