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
                        <v-btn color="primary" type="submit" @click="getUser">get info</v-btn>
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
		name: "login",
		data() {
			return {
				form: {
					email: "",
					password: ""
                },
                user: null,
			};
		},
		methods: {
			loginUtilizador() {
				// alert("Email: " + this.$data.form.email
				// 	+ "\nPassword: " + this.$data.form.password
				// )
				axios.post(lhost + "/api/users/login", {
					username: this.$data.form.email,
					password: this.$data.form.password  
				}).then(res => {
                    alert(JSON.stringify(res.data))
				}).catch(function (err) {
					alert(err);
				});
            },
            getUser(){
                
            }
		}
	};
</script>