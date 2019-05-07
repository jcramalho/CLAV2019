<template>
    <v-container grid-list-md fluid>
      <v-layout row wrap justify-center>
        <v-flex xs12 sm10>
          <v-card>
            <v-toolbar color="blue" dark>
              <v-toolbar-title>Pedido Submetido com sucesso</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-container>
                  <v-layout row wrap>
                    <v-flex xs12 sm10>
                      <v-text-field
                        :value="pedido.codigo"
                        label="Número do pedido"
                        readonly
                      ></v-text-field>
                      <v-text-field
                        v-if="pedido.objeto"
                        :value="pedido.objeto.acao + ' de ' + pedido.objeto.tipo"
                        label="Tipo de pedido"
                        readonly
                      ></v-text-field>
                      <v-text-field
                        value="O seu pedido foi submetido com sucesso"
                        label="Descrição"
                        readonly
                      ></v-text-field>
                      <v-text-field
                        :value="pedido.data"
                        label="Data de Submissão"
                        readonly
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm10>
                      <h3>Aguarde a notificação de resposta ao seu pedido</h3>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-form>
            </v-card-text>
          </v-card>
          <div style="text-align:center">
                <v-btn medium color="primary" @click="verPedido()">Ver Pedido</v-btn>
        </div>
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>
import axios from 'axios';
const lhost = require('@/config/global').host

export default {
    data: () => ({
        pedido: {},
    }),
    methods: {
        verPedido: function () {
            this.$router.push('/pedidos/' + this.pedido.codigo);
        }
    },
    mounted: async function (){
        try{
            var response = await axios.get(lhost + '/api/pedidos');
            this.pedido = response.data[response.data.length-1]
            this.pedido.data = this.pedido.data.split('T')[0]
        }
        catch(e){
            console.log(e);
        }
    },
}
</script>
