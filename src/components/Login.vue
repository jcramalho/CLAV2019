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
						:top="true">
						{{ text }}
						<v-btn color="blue" flat @click="snackbar = false">Close</v-btn>
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
						this.snackbar = true;
						this.$store.state.user.id = res.data._id;
						this.$store.state.user.name = res.data.name;
						// this.$router.push('/');
					}else{
						this.text = 'Ocorreu um erro ao realizar o login, por favor verifique as suas credenciais!';
						this.snackbar = true;
					}
				}).catch(function (err) {
					this.text = err;
					this.snackbar = true;
				});
            }
		}
	};
</script>