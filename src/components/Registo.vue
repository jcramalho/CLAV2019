<template>
	<v-container fluid fill-height>
		<v-layout align-center justify-center>
			<v-flex xs12 sm8 md4>
				<v-card class="elevation-12">
					<v-toolbar dark color="primary">
						<v-toolbar-title>Registo de utilizador</v-toolbar-title>
					</v-toolbar>
					<v-card-text>
						<v-form>
							<v-text-field prepend-icon="person" name="name" v-model="form.name" label="Nome" type="text"/>
							<v-text-field prepend-icon="email" name="email" v-model="form.email" label="Email" type="email"/>
							<v-flex>
								<v-select
									:items="this.ent_list"
									prepend-icon="account_balance"
									v-model="form.entidade"
									label="Entidade">
								</v-select>
							</v-flex>
							<v-flex>
								<v-select
									:items="['Administrador de Perfil Tecnológico','Administrador de Perfil Funcional','Utilizador Validador','Utilizador Avançado','Utilizador Decisor','Utilizador Simples','Representante Entidade']"
									prepend-icon="info"
									v-model="form.type"
									label="Nível de utilizador">
								</v-select>
							</v-flex>
							<v-text-field id="password" prepend-icon="lock" name="password"  v-model="form.password" label="Password" type="password"/>
						</v-form>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" type="submit" @click="registarUtilizador">Registar</v-btn>
					</v-card-actions>
				</v-card>
			</v-flex>
    	</v-layout>
    </v-container>
</template>

<script>
	import axios from 'axios'

	export default {
		name: "signup",
		async created () {
			await this.getEntidades();
		},
		data() {
			return {
				form: {
					name: "",
					email: "",
					entidade: "",
					type: "",
					password: ""
				},
				ent_list: {}
			};
		},
		methods: {
			async getEntidades () {
				await axios.get("http://localhost:7778/api/entidades").then(res => {
					this.ent_list = res.data.map((ent) => {return ent.sigla});
				}).catch(error => console.log(error))
			},
			registarUtilizador() {
				let data = {
					name: this.$data.form.name,
					email: this.$data.form.email,
					entidade: this.$data.form.entidade,
					type: this.$data.form.type,
					password: this.$data.form.password  
				}
				axios.post("http://localhost:7778/api/users/criarUser", data).then(res => {
					alert("RES: " +res)
				}).catch(function (err) {
					alert('ERRO: ' + err);
				});
			}
		}
	};
</script>