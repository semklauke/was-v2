<template>
<b-container fluid="lg" id="WAS_post_container">
    <b-row class="mt-3">
        <b-col cols="12" md="6" lg="4"
            v-for="c in classes" 
            :key="'posttile-'+c"
        >
            <was-posttile
                :class_name="c" 
                :url="c" 
                :courses="false" 
                class="shadow px-3 py-3 ml-2 mr-2 mt-2 mb-2 bg-light-custom rounded" 
                :ref="c"
            >
            </was-posttile>
        </b-col>
    </b-row>
    <b-row>
        <b-col cols="12" md="6" lg="4" class="mb-3"
            v-for="o in oberstufe" 
            :key="'posttilec-'+o" 
            
        >
            <was-posttile
                :class_name="o.split('/')[0]+' - '+o.split('/')[1]" 
                :url="o" 
                :courses="true" 
                class="shadow px-3 py-3 ml-2 mr-2 mt-2 mb-2 bg-light-custom rounded" 
                :ref="o"
            >
            </was-posttile>
        </b-col>
    </b-row>
    <b-row>
        <b-col>
            <div class="shadow px-3 py-3 ml-2 mr-2 mt-2 mb-2 bg-light-custom rounded">
                <b-modal :id="'ptmd-all'" 
                       class="posttile_modal_all" 
                       centered 
                       title="Download Link" 
                       :cancel-disabled="true" 
                       :ok-disabled="true"
                >
                    <p class="my-4 loading_container">
                        <div v-if="loading" class="d-flex">
                            <b-spinner variant="primary" class="download_all_spinner">In progress...</b-spinner>
                            <b-progress :value="progress_value" :max="progress_max" show-progress
                            class="w-100"></b-progress>
                        </div>
                        <div v-else>
                            <b-link v-for="l in downloadlinks" class="posttile_a" :href="l" download>Download</b-link>
                        </div>
                        
                    </p>
                </b-modal>
                <h3>ALLE</h3>
                <h5>Liste (Leer)</h5>
                <b-button variant="primary" @click="download_all('/post/class/')" class="posttile_btn_alle mb-4">
                    Download
                </b-button>
                <br />
                <h5>Liste (ausgefüllt)</h5>

                <b-button variant="primary" @click="download_all('/post/final/')" class="posttile_btn_alle mb-4">
                    Download
                </b-button>
                <br />
                <h5>Spendenformulare</h5>
                <b-button variant="primary" @click="download_all('/post/form/')" class="posttile_btn_alle">
                    Download
                </b-button>
            </div>
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
            oberstufe: ["EPH/MA", "EPH/DE", "EPH/PA", "EPH/EN", "Q1/MA", "Q1/DE", "Q1/PA", "Q1/EN", "Q2/MA", "Q2/DE", "Q2/PA", "Q2/EN"],
            progress_value: 0,
            progress_max: 0,
            downloadlinks: [],
            loading: false
        };
    },
    components: {
        'was-posttile': WasPosttile
    },
    created() {
        this.$root.socket.on('post_progress_done', ref => {
            this.$refs[ref][0].done_loading();
            if (this.progress_value < this.progress_max) {
                this.progress_value++;
            }
            if (this.progress_max != 0 && this.progress_value == this.progress_max) {
                this.loading = false;
            }
        });
        this.$root.socket.on('post_progress_progress', index => {
            if (this.progress_value < this.progress_max) {
                this.progress_value++;
            }
            if (this.progress_max != 0 && this.progress_value == this.progress_max) {
                this.loading = false;
            }
        });
        
    },
    mounted() {
        this.$root.$on('bv::modal::hidden', (bvEvent, modalId) => {
            if (modalId == 'ptmd-all') {
                this.downloadlinks = [];
                this.loading = false;
                this.progress_value = 0;
                this.progress_max = 0;
            }
        });
        this.progress_value = 0;
        this.progress_max = 0;
        this.classes = [];
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
        download_all(baseurl) {
            this.loading = true;
            this.progress_value = 0;
            this.progress_max = this.classes.length + this.oberstufe.length;
            this.downloadlinks = [];

            let urls_toSend = [];
            for (let c of this.classes.concat(this.oberstufe)) {
                urls_toSend.push(baseurl+c);
            }

            this.$root.axios.post("/post/download/all", {
                urls: urls_toSend,
                soiid: this.$root.socket.id,
            }).then(res => {
                if (res.status != 200) {
                    alert("Download Error occured. check with admin pls");
                    console.error(res.status);
                } else {
                    if (!res.data.pdfurls) {
                        console.error("no pdf url in response");
                    } else {
                        this.downloadlinks = res.data.pdfurls.map(
                            x => window.location.protocol + "//" + window.location.hostname + x
                        );
                    }
                }
            }).catch(e => {
                console.error(e);
                alert("Error. contact admin");
            })
            this.$bvModal.show('ptmd-all');
        }
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

.loading_container {
    text-align: center;
}
.download_all_spinner {
    display: block;
    text-align: center;
}
.posttile_btn_alle {
    width: 100%;
}

.posttile_a {
    display: block;
}
.bg-light-custom {
    background-color: #FFFFFF;
}
</style>