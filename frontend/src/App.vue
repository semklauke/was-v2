<template>
<div id="app">
    <b-navbar variant="light" toggleable="md" type="light" sticky>
        <b-navbar-brand href="/">WaS 2020</b-navbar-brand>
        <b-collapse is-nav id="WAS_mainNaBarCollapseWrapper">
            <b-navbar-nav >
                <b-nav-item :to="{ name: 'edit' }">Edit</b-nav-item>
                <b-nav-item :to="{ name: 'new-walker' }">New</b-nav-item>
                <b-nav-item :to="{ name: 'overview' }">Overview</b-nav-item>
                <b-nav-item :to="{ name: 'walker' }">Walker</b-nav-item>
                <b-nav-item :to="{ name: 'admin' }">Admin</b-nav-item>
            </b-navbar-nav>
        </b-collapse>

        <b-navbar-toggle target="WAS_mainNaBarCollapseWrapper"></b-navbar-toggle>
    </b-navbar>
    <transition
        enter-active-class="animated fadeIn faster"
        leave-active-class="animated fadeOut faster"
        mode="out-in"
    >
        <router-view></router-view>
    </transition>
</div>
</template>


<style>

@import url("../node_modules/animate.css/animate.min.css");

.form-control:focus {
    box-shadow: none !important;
}

html, body {
    overflow: hidden;
}
#app {
    overflow: hidden;
}
body {
    background-color: white;
    /*background-color: #E7E7E7;*/
}
.navbar {
    box-shadow: 0px 3px 3px 0px rgba(50, 50, 50, 0.20) !important;
}

nav {

    padding-top: 0px !important;
    padding-bottom: 0px !important;
    height: 50px !important;
    max-height: 50px !important;

}
.navbar-nav, .nav-item, .nav-item a{
    height: 50px !important;
    max-height: 50px !important;
}
.nav-item a {
    text-align: center !important;
    line-height: 2.1rem !important;
    font-size: 1.2rem !important;
}

.nav-item a {
    transition: background-position .2s, box-shadow .4s, color 0.2s ease-out;    
    background: var(--light);
    background-size: 100% 200%;
    background-image: linear-gradient(var(--light) 50%, var(--primary) 50%);

}
.nav-item a:not(.router-link-active):hover {
    background-position: 0 100%;
    color: white !important;
}

.router-link-active, .nav-item a:active, .nav-item a:focus {
    background-position: 0 100% !important;
    /*box-shadow: inset 1px 1px 8px 1px rgba(0,65,134,0.50);*/
    color: white !important;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance:textfield;
}

</style>
