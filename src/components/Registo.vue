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
							<v-text-field prepend-icon="person" name="name" v-model="form.name" label="Nome" type="text" :rules="nameRules" required/>
							<v-text-field prepend-icon="email" name="email" v-model="form.email" label="Email" type="email" :rules="emailRules" required/>
							<v-flex>
								<v-select
									item-text="label"
									item-value="value"
									:items="ent_list"
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
	const lhost = require('@/config/global').host
	import axios from 'axios'

	export default {
		name: "signup",
		async mounted () {
			await this.getEntidades();
		},
		data() {
			return {
				form: {
					name: "",
					nameRules: [
						v => !!v || 'Name is required',
						v => (v && v.length <= 10) || 'Name must be less than 10 characters'
					],
					email: "",
					emailRules: [
						v => !!v || 'E-mail is required',
						v => /.+@.+/.test(v) || 'E-mail must be valid'
					],
					entidade: "",
					type: "",
					password: ""
				},
				ent_list: []
			};
		},
		methods: {
			async getEntidades () {
				await axios.get(lhost + "/api/entidades").then(res => {
					this.ent_list = res.data.map((ent) => {return {label: ent.sigla +' - '+ent.designacao, value: ent.sigla}});
				}).catch(error => console.log(error))
			},
			registarUtilizador() {
					var parsedType;
					switch(this.$data.form.type) {
						case 'Administrador de Perfil Tecnológico':
							parsedType = 7;
							break;
						case 'Administrador de Perfil Funcional':
							parsedType = 6;
							break;
						case 'Utilizador Validador':
							parsedType = 5;
							break;
						case 'Utilizador Avançado':
							parsedType = 4;
							break;
						case 'Utilizador Decisor':
							parsedType = 3;
							break;
						case 'Utilizador Simples':
							parsedType = 2;
							break;
						case 'Representante Entidade':
							parsedType = 1;
							break;
					}
					axios.post(lhost + "/api/users/registar", {
						name: this.$data.form.name,
						email: this.$data.form.email,
						entidade: this.$data.form.entidade,
						type: parsedType,
						password: this.$data.form.password  
					}).then(res => {
						alert(res.data)
					}).catch(function (err) {
						alert(err);
					});
				
			},
		}
	};
</script>