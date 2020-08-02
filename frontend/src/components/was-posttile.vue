<template>
<div class="WAS_posttile">
    <b-modal :id="'ptmd-'+class_name" 
           class="posttile_modal" 
           centered 
           title="Download Link" 
           :cancel-disabled="true" 
           :ok-disabled="true"
    >
        <p class="my-4">
            <span v-if="loading" class="d-flex">
                <b-spinner variant="primary"></b-spinner>
            </span>
            <a v-else class="posttile_a" :href="downloadlink" download>Download</a>
        </p>
    </b-modal>
    <h3>{{ class_name }}</h3>
    <div class="posttile_class">
        <h5>Liste (Leer)</h5>
        <b-button variant="primary" 
                    :href="'/post/class/'+url" 
                   target="_blank"
                   class="mr-3 posttile_btn mb-4"
        >Anzeigen</b-button>
        <span class="was_filler"></span>
        <b-button variant="primary" @click="download('/post/class/')" class="ml-3 posttile_btn mb-4">
            Download
        </b-button>
        <br />
        <h5>Liste (ausgefüllt)</h5>
        <b-button variant="primary" 
                    :href="'/post/final/'+url" 
                   target="_blank"
                   class="mr-3 posttile_btn mb-4"
        >Anzeigen</b-button>
        <span class="was_filler"></span>
        <b-button variant="primary" @click="download('/post/final/')" class="ml-3 posttile_btn mb-4">
            Download
        </b-button>
        <br />
        <h5>Spendenformulare</h5>
        <b-button variant="primary" 
                    :href="'/post/form/'+url" 
                   target="_blank"
                   class="mr-3 posttile_btn"
        >Anzeigen</b-button>
        <span class="was_filler"></span>
        <b-button variant="primary" @click="download('/post/form/')" class="ml-3 posttile_btn">
            Download
        </b-button>

    </div>
</div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
    name: 'was-posttile',
    props: {
        class_name: String,
        url: String,
        courses: Boolean
    },
    data: function() {
        return {
            loading: false,
            downloadlink: "ERROR"
        }
    },
    methods: {
        download(baseurl) {
            //this.$root.socket.connected
            this.loading = true;
            this.$root.axios.post("/post/download", {
                url: baseurl+this.url,
                ref: this.url,
                soiid: this.$root.socket.id
            }).then(res => {
                if (res.status != 200) {
                    alert("Download Error occured. check with admin pls");
                    console.error(res.status);
                } else {
                    if (!res.data.pdfurl) {
                        console.error("no pdf url in response");
                    } else {
                        this.downloadlink = 
                            window.location.protocol + "//" + window.location.hostname + res.data.pdfurl;
                        this.$bvModal.show('ptmd-'+this.class_name);
                    }
                }
            }).catch(e => {
                this.loading = false;
                console.error(e);
                this.downloadlink = "ERROR";
                alert("Error. contact admin");
            });
        },
        done_loading() {
            this.loading = false;
        }
    },
    computed: {

    },
    mounted() {
        this.$root.$on('bv::modal::hidden', (bvEvent, modalId) => {
            this.downloadlink = "ERROR";
            this.loading = false;
        });
    }
});
</script>


<style scoped>
.was_filler {
    width: 10px;
    display: inline-block;
}
.posttile_btn {
    width: calc(50% - 21px);
}
</style>
