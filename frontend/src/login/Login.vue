<template>
<b-container id="WAS_login_container" class="shadow px-5 py-3 mb-5 mt-5 bg-light rounded">
    <b-row class="my-3">
        <b-col>
            <h2>WaS 2020 Login</h2>
        </b-col>
    </b-row>    
    <b-row>
        <b-col>
            <b-alert show variant="danger" v-if="loginRequired">
                <h4 class="alert-heading">Login Required!</h4>
                <p>
                    Login Credenials are required to access this site/api.
                </p>
                <hr>
                <p class="mb-0">
                    In case you were already logged in and still ended up here. Either
                    <ol>
                        <li>Your last login session expired and you just need to login again.</li>
                        <li>There is an error. If logging in still brings you here, please contact an admin</li>
                    </ol>
                </p>
            </b-alert>
        </b-col>
    </b-row>
    <b-row>
        <b-col>
            <b-alert show variant="danger" v-if="loginWrong">
                <h4 class="alert-heading">Wrong Password!</h4>
            </b-alert>
        </b-col>
    </b-row>
    <b-form action="/login" method="post" enctype="application/x-www-form-urlencoded" class="my-3">
        <b-form-group label-cols="4" label-cols-lg="2" label="Username" label-for="WAS_username_input">
            <b-form-input id="WAS_username_input" name="username"></b-form-input>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="2" label="Password" label-for="WAS_password_input">
            <b-form-input id="WAS_password_input" name="password" type="password"></b-form-input>
        </b-form-group>
        <b-row>
            <b-col cols="10" col-sm="6"></b-col>
            <b-col cols="2" col-sm="6">
                <b-button variant="primary" type="submit" name="was_login_submit" id="WAS_login_submit" @click="testf">Login</b-button>
            </b-col>
        </b-row>
    </b-form>
</b-container>    
</template>


<script lang="ts">


export default {
    data: function () {
        return {
            loginRequired : false,
            loginWrong : false
        };
    },
    //name: 'login',
    components: {

    },
    mounted() {
        let uri: string[] = window.location.href.split('?');
        if (uri.length == 2) {
            if (uri[1].substring(5,6) == "l") {
                //@ts-ignore
                this.loginRequired = true;
            } else if (uri[1].substring(5,6) == "w") {
                //@ts-ignore
                this.loginWrong = true;
            }
        }
    },
    methods: {
        testf() {
            let name: HTMLInputElement | null = <HTMLInputElement> document.getElementById("WAS_username_input");
            if (name)
                localStorage.setItem('login_name', name.value || '');
        }
    }
};

</script>

<style>
body {
    background-color: #E7E7E7;
}

#WAS_login_container {
    
}

#WAS_login_submit {
    width: 100%;
    max-width: 100%;
}
</style>