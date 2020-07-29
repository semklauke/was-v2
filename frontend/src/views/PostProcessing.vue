<template>
<b-container fluid="lg" id="WAS_post_container">
    <b-row>
        <b-col cols="12" md="6" lg="4"
            v-for="c in classes" 
            :key="'posttile-'+c"
        >
            <was-posttile
                :class_name="c" 
                :url="c" 
                :courses="false" 
                class="shadow px-3 py-3 ml-2 mr-2 mt-2 mb-2 bg-light rounded"
            >
            </was-posttile>
        </b-col>
    </b-row>
    <b-row>
        <b-col cols="12" md="6" lg="4"
            v-for="o in oberstufe" 
            :key="'posttilec-'+o" 
            
        >
            <was-posttile
                :class_name="o.split('/')[0]+' - '+o.split('/')[1]" 
                :url="o" 
                :courses="true" 
                class="shadow px-3 py-3 ml-2 mr-2 mt-2 mb-2 bg-light rounded"
            >
            </was-posttile>
        </b-col>
    </b-row>
</b-container>    
</template>


<script>

import WasPosttile from '@/components/was-posttile';
export default {
    data: function () {
        return {
            classes: [],
            oberstufe: ["EPH/MA", "EPH/DE", "EPH/PA", "EPH/EN", "Q1/MA", "Q1/DE", "Q1/PA", "Q1/EN", "Q2/MA", "Q2/DE", "Q2/PA", "Q2/EN"]
        };
    },
    components: {
        'was-posttile': WasPosttile
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