<template>



<div id="WAS_edit_walker_wrapper" :key="$route.params.id">
    <div v-if="error" class="WAS_walker_error row">
        <b-col>
            <b-alert show variant="danger">
                <h4 class="alert-heading">Error Loading Data!</h4>
                <p>
                    {{ error }}
                </p>
                <hr>
                <p class="mb-0">
                    Please contact an admin. This is properply due to this reasons:
                    <ol>
                        <li>Your network connection is bad or disconnected</li>
                        <li>The server shut down</li>
                        <li>The server has an error</li>
                        <li>Your browser is shit</li>
                    </ol>
                </p>
            </b-alert>
        </b-col>
    </div>
    <div v-if="loading" class="WAS_walker_loading d-flex justify-content-center mb-3 mt-5">
        <b-spinner variant="primary" style="width: 2rem; height: 2rem;">
            Loading data...
        </b-spinner>
    </div>
    <div v-if="walker" id="WAS_edit_walker" class="">
        <div id="WAS_edit_toolar">
            <b-button variant="outline-primary" size="sm" @click="save(fetchData)">
                <b-icon icon="file-earmark-text" v-if="saveing == 0"></b-icon>
                <b-icon icon="check" v-if="saveing == 2"></b-icon>
                <b-spinner small v-if="saveing == 1"></b-spinner>  
                 Save
            </b-button>
            <b-button variant="outline-danger" size="sm" @click="deleteBtn">
                <b-icon icon="Trash"></b-icon> Delete
            </b-button>
            <b-button variant="outline-info" size="sm" id="WAS_edit_new_donation" @click="addDonationBtn">
                <b-icon icon="plus"></b-icon>Neuer Spender
            </b-button>
        </div>
        <h1>{{ walker.firstname }}&nbsp;{{ walker.lastname }}</h1>
        <div id="WAS_edit_walker_form">
            <b-row>
                <b-col cols="6" xl="3">
                    <b-form-group
                        id="WAS_edit_walker_form_firstname_g"
                        label="Vorname"
                        label-for="WAS_edit_walker_form_firstname"
                        label-align="left"
                    >
                        <b-form-input 
                            id="WAS_edit_walker_form_firstname" 
                            v-model="walker.firstname" 
                            class="not-empty"
                            autocomplete="off"
                            @input="updateWalkerState('firstname')"
                        >  
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="6" xl="3">
                    <b-form-group
                        id="WAS_edit_walker_form_lastname_g"
                        label="Nachname"
                        label-for="WAS_edit_walker_form_lastname"
                        label-align="left"
                    >
                        <b-form-input 
                            id="WAS_edit_walker_form_lastname" 
                            v-model="walker.lastname" 
                            class="not-empty"
                            autocomplete="off"
                            @input="updateWalkerState('lastname')"
                        >  
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="6" xl="3">
                    <b-form-group
                        id="WAS_edit_walker_form_class_g"
                        label="Klasse"
                        label-for="WAS_edit_walker_form_class"
                        label-align="left"
                    >
                        <b-form-select
                            id="WAS_edit_walker_form_class" 
                            v-model="walker.class" 
                            class="not-empty"
                            @input="updateWalkerState('class')"
                        >  
                            <optgroup>
                                <option>5A</option>
                                <option>5B</option>
                                <option>5C</option>
                                <option>5D</option>
                            </optgroup>
                            <optgroup>
                                <option>6A</option>
                                <option>6B</option>
                                <option>6C</option>
                                <option>6D</option>
                            </optgroup>
                            <optgroup>
                                <option>7A</option>
                                <option>7B</option>
                                <option>7C</option>
                                <option>7D</option>
                            </optgroup>
                            <optgroup>
                                <option>8A</option>
                                <option>8B</option>
                                <option>8C</option>
                                <option>08D</option>
                            </optgroup>
                            <optgroup>
                                <option>9A</option>
                                <option>9B</option>
                                <option>9C</option>
                                <option>9D</option>
                            </optgroup>
                            <optgroup>
                                <option>EPH</option>
                                <option>Q1</option>
                                <option>Q2</option>
                            </optgroup>
                        </b-form-select>
                    </b-form-group>
                    <b-form-group
                        id="WAS_edit_walker_form_course_g"
                        label="Kurs"
                        label-for="WAS_edit_walker_form_course"
                        label-align="left"
                        v-if="walker.class == 'EPH' || walker.class == 'Q1' || walker.class == 'Q2'"
                    >
                        <b-form-select
                            id="WAS_edit_walker_form_course" 
                            v-model="walker.course" 
                            class="not-empty"
                            @input="updateWalkerState('course')"
                        >  
                            <option value="null">-</option>
                            <option value="DE">Deutsch</option>
                            <option value="MA">Mathe</option>
                            <option value="EN">English</option>
                            <option value="PA">Paedagogik</option>
                        </b-form-select>
                    </b-form-group>
                </b-col>
                <b-col cols="6" xl="3">
                    <b-form-group
                        id="WAS_edit_walker_form_participates_g"
                        label="Teilnahme"
                        label-for="WAS_edit_walker_form_participates"
                        label-align="left"
                    >
                        <b-form-radio-group
                            id="WAS_edit_walker_form_participates" 
                            v-model="walker.participates"
                            @input="updateWalkerState('participates')"
                            class="not-empty"
                            :options="[{text:'Ja',value:'1'},{text:'Nein',value:'0'},{text:'Entschuldigt',value:'2'}]"
                            buttons
                        >  
                        </b-form-radio-group>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form-group
                        id="WAS_edit_walker_form_distance_g"
                        label="Distanz gelaufen"
                        label-for="WAS_edit_walker_form_distance_m"
                        label-align="left"
                    >
                        <b-input-group
                            id="WAS_edit_walker_form_distance_g" 
                        >  
                            <b-form-input
                                id="WAS_edit_walker_form_distance_m"
                                type="number"
                                no-wheel="true"
                                autocomplete="off"
                                v-model="walker.distance_m"
                                @input="updateWalkerState('distance_m')"
                            ></b-form-input>
                            <template v-slot:append>
                                <b-input-group-text >m</b-input-group-text>
                                <b-button variant="outline-secondary" @click="applyDistance(0)">0m</b-button>
                                <b-button variant="outline-secondary" @click="applyDistance(1000)">1000m</b-button>
                                <b-button variant="outline-secondary" @click="applyDistance(3200)">3200m</b-button>
                                <b-button variant="outline-secondary" @click="applyDistance(4578)">4578m</b-button>
                            </template>
                        </b-input-group>
                    </b-form-group>
                </b-col>
            </b-row>
        </div>
        <div id="WAS_edit_walker_donations">
            <was-donation 
                v-for="(d, d_index) in donations"
                :key="d.rec_id"
                fetch="false"
                :donation.sync="donations[d_index]"
                :donation_state.sync="state_donations[d_index]" 
                :walker_id="walker.rec_id"
                :donation_index="d_index"
                :isNew="false"
                @deleteDonation="deleteDonation"
                ref="donations"
            >
            </was-donation>
            <was-donation 
                v-for="(d, d_index) in new_donations"
                :key="d.rec_id"
                fetch="false"
                :donation.sync="new_donations[d_index]"
                :walker_id="walker.rec_id"
                :donation_index="d_index+(donations.length)"
                :isNew="true"
                @deleteDonation="deleteDonation"
                ref="donations"
            >
            </was-donation>
        </div>
    </div>

    <b-modal
    id="save-modal"
    ref="save-modal"
    centered
    no-close-on-backdrop
    no-close-on-esc
    hide-header-close
    title="Manche Änderungen wurden nicht gespeichert. Fortfahren ?"
>
        <template v-slot:modal-footer>
            <b-button variant="secondary" @click="dismissSaveModal">
                <b-icon icon="box-arrow-right"></b-icon> ABBRECHEN
            </b-button>
            
            <b-button variant="danger" @click="discardSaveModal">
                <b-icon icon="x-octagon"></b-icon> VERWERFEN
            </b-button>

            <b-button variant="primary" @click="saveSaveModal">
                <b-icon icon="file-earmark-text" v-if="saveing == 0"></b-icon>
                <b-icon icon="check" v-if="saveing == 2"></b-icon>
                <b-spinner small v-if="saveing == 1"></b-spinner>  
                 SPEICHERN
            </b-button>
        </template>

        <template v-slot:default>
            <h6 v-if="state_walker_computed.length != 0">Läufer:</h6>
            <ul>
                <li v-for="(w, w_index) in state_walker_computed" :key="w_index">
                    &ensp;{{ w }}
                </li>
            </ul>
            <div v-for="(d, d_index) in state_donations_computed" :key="d_index">
                <h6 v-if="d.length != 0">Spender {{ d_index }}</h6>
                <ul>
                        <li v-for="ds in d" :key="''+d_index+ds">
                            {{ ds }}
                        </li>
                </ul>
            </div>
        </template>
    </b-modal>
</div>



</template>

<script>

import WasDonation from '@/components/was-donation';
import config from '@/includes/config';

export default {
    data: function() {
        return {
            loading: true,
            error: null,
            saveing: 0,
            walker: null,
            state_walker: {
                class: false,
                distance_m: false,
                lastname: false,
                firstname: false,
                participates: false,
                course: false
            },
            donations: null,
            new_donations: [],
            state_donations: [],
            nextRoute: null,
            overwriteState: false
        };
    },
    components: {
        'was-donation': WasDonation
    },
    created() {
        this.fetchData(2);
    },
    watch: {
        '$route.params.id': 'fetchData'
    },
    beforeRouteUpdate(to, from, next) {
        if (this.overwriteState) {
            this.overwriteState = false;
            this.unlock_walker(from.params.id);
            next();
        } else if (this.checkState()) {
            this.nextRoute = to;
            this.displayState();
            this.$refs['save-modal'].show();
        } else {
            this.unlock_walker(from.params.id);
            next();
        } 
    },
    beforeRouteLeave(to, from, next) {
        if (this.overwriteState) {
            this.overwriteState = false;
            this.unlock_walker();
            next();
        } else if (this.checkState()) {
            this.nextRoute = to;
            this.displayState();
            this.$refs['save-modal'].show();
        } else {
            this.unlock_walker();
            next();
        }
    },
    computed: {
        donations_computed: function() {
            if (this.dontions === null) return this.new_donations;
            else return this.donations.concat(this.new_donations);
        },
        state_walker_computed: function() {
            let r = [];
            for (let w in this.state_walker) {
                if (this.state_walker[w] == true)
                    r.push(w)
            }
            return r;
        },
        state_donations_computed: function() {
            let r = [];
            for (let sd of this.state_donations) {
                let d = [];
                for (let s in sd) {
                    if (sd[s] == true)
                        d.push(s);
                }
                r.push(d);
            }
            return r;
        }
    },
    methods: {
        fetchData: function(callback) {
            this.error = null;
            this.walker = null;
            this.donations = null;
            this.new_donations = [];
            this.loading = true;

            let reqUrl = "/api/walker/" + parseInt(this.$route.params.id) + "?donations=true";
            this.$root.axios.get(reqUrl).then((res) => {
                if (res.status == 200) {
                    this.walker = res.data.walker;
                    this.donations = res.data.donations;

                } else if (res.status == 404)
                    this.error = "Walker with id '"+ this.$route.params.id+"'' does not exists.";
                else if (res.status == 400)
                    this.error = "Bad Request at "+reqUrl;

                if (this.error !== null) {
                    this.animateCSS("#WAS_edit_walker_wrapper", "shake");
                    console.error(this.error);
                }
                
                this.deleteState();
                for (let d in this.donations) {
                    this.state_donations.push({
                        donation_each_km: false,
                        donation_amount_received: false,
                        needs_donation_receipt: false,
                        donation_received: false,
                        zipcode: false,
                        city: false,
                        address: false,
                        firstname: false,
                        lastname: false,
                        new: false
                    });
                }
                
                this.loading = false;

                if (typeof callback === 'function') callback();
                
            }).catch(function(err) {
                this.error = "Bad Request at "+reqUrl+". With Error: "+err.toString();
                console.error(this.error);
                this.animateCSS("#WAS_edit_walker_wrapper", "shake");
                this.loading = false;
                if (typeof callback === 'function') callback();
            });
            this.lock_walker(this.$route.params.id);
        },
        applyDistance: function(dis) {
            //document.getElementById("WAS_edit_walker_form_distance_m").value = dis;
            this.walker.distance_m = dis;
            this.updateWalkerState('distance_m')
        },
        deleteState: function() {
            for (let w in this.state_walker) {
                this.state_walker[w] = false;
            }
            this.state_donations = [];
        },
        resetState: function() {
            for (let w in this.state_walker) {
                this.state_walker[w] = false;
            }
            for (let sd of this.state_donations) {
                for (let s in sd)
                    sd[s] = false;
            }
        },
        updateWalkerState: function(key) {
            var context = this;
            this.$nextTick(function () {
                context.state_walker[key] = true;
            });
        },
        displayState: function() {
            for (let w in this.state_walker) {
                if (this.state_walker[w] == true) {
                    let input = document.getElementById("WAS_edit_walker_form_"+w);
                    input.classList.add('border', 'border-warning');
                }
            }
            for (let d of this.$refs.donations) {
                d.displayState();
            }
            this.animateCSS("#WAS_edit_walker_wrapper", "shake");
        },
        checkState: function() {
            if (this.new_donations.length > 0)
                return true;

            for (let w in this.state_walker) {
                if (this.state_walker[w] === true) return true;
            }
            for (let i = 0; i < this.state_donations.length; i++) {
                let sd = this.state_donations[i];
                for (let d in sd) {
                    if (sd[d] === true) return true;
                }
            }
            return false;
        },
        dismissSaveModal: function() {
            this.$refs['save-modal'].hide();
            this.overwriteState = false;
            this.nextRoute = null;
        },
        saveSaveModal: function() {
            this.save(() => {
                this.$refs['save-modal'].hide();
                this.overwriteState = true;
                this.$router.push(this.nextRoute);
            });
        },
        discardSaveModal: function() {
            this.$refs['save-modal'].hide();
            this.overwriteState = true;
            this.$router.push(this.nextRoute);
        },
        save: function(onsuccess) {

            this.saveing = 1;
            let walkerDirty = false;
            let walkerUpdate = {};
            for (let w in this.state_walker) {
                if (this.state_walker[w] === true) {
                    walkerDirty = true;
                    walkerUpdate[w] = this.walker[w];
                }
            }

            let donationDirty = false;
            let donationUpdate = [];
            for (let i = 0; i < this.state_donations.length; i++) {
                let sd = this.state_donations[i];

                let donationUpdateObjDirty = false;
                let donationUpdateObj = {};
                for (let d in sd) {
                    if (sd[d] === true && d != 'new') {
                        donationUpdateObjDirty = true;
                        donationUpdateObj[d] = this.donations[i][d];
                    }
                }
                if (donationUpdateObjDirty) {
                    donationDirty = true;
                    donationUpdateObj.rec_id = this.donations[i].rec_id;
                    donationUpdate.push(donationUpdateObj);
                }
            }


            let promises = [];
            if (walkerDirty) {
                let reqUrl = "/api/walker/" + parseInt(this.$route.params.id);
                if (this.walker.class != "EPH" || this.walker.class != "Q1" || this.walker.class != "Q2") {
                    this.walker.course = null;
                    walkerUpdate.course = null;
                }
                let put_data = {
                    walker: walkerUpdate
                };
                promises.push( 
                    this.$root.axios.put(reqUrl, put_data).then((res) => {
                        if (res.status == 404) {
                            this.error = "Walker with id '"+ this.$route.params.id+"' does not exists. 404 at "+reqUrl;
                        } else if (res.status == 400)
                            this.error = "Bad Request at "+reqUrl;

                        if (this.error !== null) {
                            this.animateCSS("#WAS_edit_walker_wrapper", "shake");
                            console.error(this.error);
                        }
                        
                    }).catch(function(err) {
                        this.error = "Bad Request at "+reqUrl+". With Error: "+err.toString();
                        this.animateCSS("#WAS_edit_walker_wrapper", "shake");
                        console.error(this.error);
                    })
                );
            }    
            if (donationDirty) {
                for (let don of donationUpdate) {
                    let reqUrl = "/api/donation/" + don.rec_id; 
                    promises.push( 
                        this.$root.axios.put(reqUrl, { donation: don }).then((res) => {
                            if (res.status == 404)
                                this.error = "Walker with id '"+ this.$route.params.id+"' does not exists. 404 at "+reqUrl;
                            else if (res.status == 400)
                                this.error = "Bad Request at "+reqUrl;
                        }).catch((err) => {
                            this.error = "Bad Request at "+reqUrl+". With Error: "+err.toString();
                        })
                    );
                }
            }

            if (this.new_donations != null && this.new_donations.length > 0) {
                for (let don of this.new_donations) {
                    let reqUrl = "/api/donation/walker/" + this.walker.rec_id; 
                    promises.push( 
                        this.$root.axios.post(reqUrl, { donation: don }).then((res) => {
                            if (res.status == 404)
                                this.error = "Walker with id '"+ this.$route.params.id+"' does not exists. 404 at "+reqUrl;
                            else if (res.status == 400)
                                this.error = "Bad Request at "+reqUrl;
                        }).catch((err) => {
                            this.error = "Bad Request at "+reqUrl+". With Error: "+err.toString();
                        })
                    );
                }   
            }
            if (promises.length !== 0) {
                Promise.all(promises).then((res) => {
                    this.resetState();
                    if (this.error === null) {
                        setTimeout(() => {
                            this.saveing = 2;
                            if (typeof onsuccess === 'function') onsuccess();
                            setTimeout(() => {
                                this.saveing = 0;
                            }, 2200);  
                        }, 1000);
                    } else {
                        this.animateCSS("#WAS_edit_walker_wrapper", "shake");
                        console.error(this.error);
                        this.saveing = 0;
                    }
                }).catch((err) => {
                    this.animateCSS("#WAS_edit_walker_wrapper", "shake");
                    console.error(this.error);
                });
            } else {
                this.saveing = 0;
            }
        },
        deleteBtn: function() {
            let s = this.walker;
            this.$bvModal.msgBoxConfirm(
                "Läufer "+s.firstname+' '+s.lastname+' wirklich löschen?', {
                title: 'Löschen bestätigen',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'danger',
                okTitle: 'LÖSCHEN',
                cancelTitle: 'ABBRECHEN',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true
            })
            .then(value => {
                if (value === true) {
                    // confirmed delete
                    let reqUrl = "/api/walker/"+this.walker.rec_id+"?donations=true";
                    this.$root.axios.delete(reqUrl).then((res) => {
                        if (res.status == 200) {
                            this.$router.replace({ name: 'edit' });
                        } else if (res.status == 404)
                            this.error = "Walker with id '"+ this.$route.params.id+"' does not exists.";
                        else if (res.status == 400)
                            this.error = "Bad Request at "+reqUrl;
                    }).catch((err) => {
                        this.error = "Bad Request at "+reqUrl+". With Error: "+err.toString();
                    });

                    if (this.error !== null) {
                        this.animateCSS("#WAS_edit_walker_wrapper", "shake");
                        console.error(this.error);
                    }
                }
            })
            .catch(err => {
                console.error("should not happend I guess. Invastiagte more int vue boostrap modal presets");
            });
        },
        addDonationBtn: function() {
            this.new_donations.push({
                donation_each_km: null,
                donation_amount_received: 0,
                needs_donation_receipt: 0,
                donation_received: 0,
                zipcode: config.default_zipcode,
                city: config.default_city,
                address: '',
                firstname: '',
                lastname: '',
                rec_id: Math.random().toString()
            });
            this.$emit('scrolldown');
        },
        deleteDonation: function(info) {
            if (info.isNew) {
                this.new_donations.splice(info.i - this.donations.length, 1);
            } else {
                let d = this.donations[info.i];
                this.$bvModal.msgBoxConfirm(
                    "Spenden von "+d.firstname+' '+d.lastname+' wirklich löschen?', {
                    title: 'Löschen bestätigen',
                    size: 'sm',
                    buttonSize: 'sm',
                    okVariant: 'danger',
                    okTitle: 'LÖSCHEN',
                    cancelTitle: 'ABBRECHEN',
                    footerClass: 'p-2',
                    hideHeaderClose: false,
                    centered: true
                })
                .then(value => {
                    if (value === true) {
                        // confirmed delete
                        let reqUrl = "/api/donation/"+d.rec_id;
                        this.$root.axios.delete(reqUrl).then((res) => {
                            if (res.status == 200) {
                                this.donations.splice(info.i, 1);
                            } else if (res.status == 404)
                                this.error = "Donation with id '"+d.rec_id+"' does not exists.";
                            else if (res.status == 400)
                                this.error = "Bad Request at "+reqUrl;
                        }).catch((err) => {
                            this.error = "Bad Request at "+reqUrl+". With Error: "+err.toString();
                        });

                        if (this.error !== null) {
                            this.animateCSS("#WAS_edit_walker_wrapper", "shake");
                            console.error(this.error);
                        }
                    }
                })
                .catch(err => {
                    console.error("should not happend I guess. Invastiagte more into vue boostrap modal presets");
                });
            }
        },
        animateCSS: function(element, animationName, callback) {
            const node = document.querySelector(element)
            node.classList.add('animated', animationName)

            function handleAnimationEnd() {
                node.classList.remove('animated', animationName)
                node.removeEventListener('animationend', handleAnimationEnd)

                if (typeof callback === 'function') callback()
            }

            node.addEventListener('animationend', handleAnimationEnd)
        },
        lock_walker(w) {
            let tolock = w ? w : this.walker.rec_id;
            this.$root.socket.emit('walker_lock', tolock);
        },
        unlock_walker(w) {
            let tounlock = w ? w : this.walker.rec_id;
            this.$root.socket.emit('walker_unlock', tounlock);
        }
    }
};
</script>

<style scoped>
#WAS_edit_walker {
    padding-left: 10px;
}
#WAS_edit_toolar {
    margin: 15px 0px 5px 0px;
}
#WAS_edit_toolar button {
    margin-right: 10px;
}
h1 {
    margin: 15px 0px 10px 0px;
    font-size: 2.6rem;
}

#WAS_edit_walker_donations {
    padding-top: 20px;
}
#WAS_edit_walker_form_participates {
    width: 100%;
}
#WAS_edit_new_donation {
    float: right;
}
</style>

<style>

#WAS_edit_walker_form_participates_g label.btn {
    padding-left: 8px !important;
    padding-right: 8px !important;
}
</style>