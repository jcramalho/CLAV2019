<template>
	<v-container fluid fill-height>
		<v-layout align-center justify-center>
			<v-flex xs12 sm8 md4>
				<v-card class="elevation-12">
					<v-toolbar dark color="primary">
						<v-toolbar-title>Login</v-toolbar-title>
					</v-toolbar>
					<v-card-text>
						<v-form>
                            <v-text-field prepend-icon="email" name="email" v-model="form.email" label="Email" type="email"/>
							<v-text-field id="password" prepend-icon="lock" name="password"  v-model="form.password" label="Password" type="password"/>
						</v-form>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" type="submit" @click="loginUtilizador">Login</v-btn>
					</v-card-actions>
					<v-snackbar
						v-model="snackbar"
						:timeout="timeout"
						:color="color"
						:top="true">
						{{ text }}
						<v-btn flat @click="fecharSnackbar">Fechar</v-btn>
					</v-snackbar>
				</v-card>
			</v-flex>
    	</v-layout>
    </v-container>
</template>

<script>
	const lhost = require('@/config/global').host
	import axios from 'axios'

	export default {
		name: "login",
		data() {
			return {
				form: {
					email: "",
					password: ""
                },
				snackbar: false,
				color: '',
				timeout: 4000,
				text: ''
			};
		},
		methods: {
			loginUtilizador() {
				axios.post(lhost + "/api/users/login", {
					username: this.$data.form.email,
					password: this.$data.form.password
				}).then(res => {
					if(res.data._id!=undefined){
						this.text = 'Login efetuado com sucesso!';
						this.color = 'success';
						this.snackbar = true;
						this.$store.state.user.id = res.data._id;
						this.$store.state.user.name = res.data.name;
					}else{
						this.text = 'Ocorreu um erro ao realizar o login, por favor verifique as suas credenciais!';
						this.color = 'error';
						this.snackbar = true;
					}
				}).catch(function (err) {
					this.text = err;
					this.color = 'error';
					this.snackbar = true;
				});
			},
			fecharSnackbar(){
				this.snackbar = false;
				this.$router.push('/');
			}
		}
	};
</script>