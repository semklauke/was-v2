<template>
<b-container id="WAS_post_container" class="shadow px-5 py-3 mb-5 mt-5 bg-light rounded">
    <div id="scroll-container">
        <h3>Klassen formular (zu zahlen)</h3>
        <div class="ml-10">
            <b-link v-for="c in classes" :key="'class'+c" :href="'/post/class/'+c">{{ c }}</b-link>
            <b-link v-for="o in oberstufe" :key="'class'+o" :href="'/post/class/'+o">{{ o }}</b-link>
        </div>
        <br />
        <h3>Zusammenfassung (was gezahlt wurde)</h3>
        <div class="ml-10">
            <b-link v-for="c in classes" :key="'final'+c" :href="'/post/final/'+c">{{ c }}</b-link>
            <b-link v-for="o in oberstufe" :key="'final'+o" :href="'/post/final/'+o">{{ o }}</b-link>
        </div>
        <br />
        <h3>Spendenformulare</h3>
        <div class="ml-10">
            <b-link v-for="c in classes" :key="'form'+c" :href="'/post/form/'+c">{{ c }}</b-link>
            <b-link v-for="o in oberstufe" :key="'from'+o" :href="'/post/from/'+o">{{ o }}</b-link>
        </div>

        <br />
        <br />
        <br />
        <br />
        <br />
    </div>
</b-container>    
</template>


<script>


export default {
    data: function () {
        return {
            classes: [],
            oberstufe: ["EPH/MA", "EPH/DE", "EPH/PA", "EPH/EN", "Q1/MA", "Q1/DE", "Q1/PA", "Q1/EN", "Q2/MA", "Q2/DE", "Q2/PA", "Q2/EN"]
        };
    },
    components: {
    },
    mounted() {
        let letters = ['A', 'B', 'C', 'D']
        for (let i = 5; i < 10; i++) {
            for (let l of letters)
                this.classes.push(""+i+l);
        }
        this.classes.push("EPH");
        this.classes.push("Q1");
        this.classes.push("Q2");
    },
    methods: {
        
    }
};

</script>

<style scoped>

#WAS_post_container a {
    display: block;
}
body {
    background-color: #E7E7E7;
}

#WAS_post_container::-webkit-scrollbar { 
    display: none;
}

#WAS_post_container {
    overflow-y: scroll;
    height: calc(100vh - 100px);
    -moz-overflow-y: -moz-scrollbars-none;
    -ms-overflow-style: none;
} 
</style>