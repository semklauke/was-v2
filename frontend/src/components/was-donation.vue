<template>
<div class="WAS_donation">
    <div class="WAS_donation_box_name">Spender {{ donation_index }}</div>
    <div class="WAS_donation_box" :id="donation_identifier">
        <div class="WAS_donation_box_form">
            <b-row class="WAS_donation_box_row">
                <b-col cols="6">
                    <b-form-group
                        :id="formid('WAS_donation_form_firstname_g')"
                        label="Vorname"
                        :label-for="formid('WAS_donation_form_firstname')"
                        label-align="left"
                    >
                        <b-form-input 
                            :id="formid('WAS_donation_form_firstname')" 
                            v-model="donation.firstname" 
                            class="not-empty WAS_donation_form_input WAS_donation_form_firstname"
                            autocomplete="off"
                            placeholder=""
                            @input="updateState('firstname')"
                        >  
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="6">
                    <b-form-group
                        :id="formid('WAS_donation_form_lastname_g')"
                        label="Nachname"
                        :label-for="formid('WAS_donation_form_lastname')"
                        label-align="left"
                    >
                        <b-form-input 
                            :id="formid('WAS_donation_form_lastname')" 
                            v-model="donation.lastname" 
                            class="not-empty WAS_donation_form_input WAS_donation_form_lastname"
                            autocomplete="off"
                            placeholder=""
                            @input="updateState('lastname')"
                        >  
                        </b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row class="WAS_donation_box_row">
                <b-col cols="2" xl="3">
                    <b-form-group
                        :id="formid('WAS_donation_form_zipcode_g')"
                        label="PLZ"
                        :label-for="formid('WAS_donation_form_zipcode')"
                        label-align="left"
                    >
                        <b-form-input 
                            :id="formid('WAS_donation_form_zipcode')" 
                            v-model="donation.zipcode" 
                            class="not-empty WAS_donation_form_input WAS_donation_form_zipcode"
                            type="number"
                            no-wheel="true"
                            autocomplete="off"
                            placeholder=""
                            @input="updateState('zipcode')"
                        >  
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="4" xl="3">
                    <b-form-group
                        :id="formid('WAS_donation_form_city_g')"
                        label="Stadt"
                        :label-for="formid('WAS_donation_form_city')"
                        label-align="left"
                    >
                        <b-form-input 
                            :id="formid('WAS_donation_form_city')" 
                            v-model="donation.city" 
                            class="not-empty WAS_donation_form_input WAS_donation_form_city"
                            autocomplete="off"
                            placeholder=""
                            @input="updateState('city')"
                        >  
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="6" xl="6">
                    <b-form-group
                        :id="formid('WAS_donation_form_address_g')"
                        label="Adresse"
                        :label-for="formid('WAS_donation_form_address')"
                        label-align="left"
                    >
                        <b-form-input 
                            :id="formid('WAS_donation_form_address')" 
                            v-model="donation.address" 
                            class="not-empty WAS_donation_form_input WAS_donation_form_address"
                            autocomplete="off"
                            placeholder=""
                            @input="updateState('address')"
                        >  
                        </b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row class="WAS_donation_box_row">
                <b-col cols="6" xl="4">
                    <b-form-group
                        :id="formid('WAS_donation_form_donation_each_km_g')"
                        label="Spende pro km"
                        :label-for="formid('WAS_donation_form_donation_each_km')"
                        label-align="left"
                    >
                        <b-input-group append="€">
                        <b-form-input 
                            :id="formid('WAS_donation_form_donation_each_km')" 
                            v-model="donation.donation_each_km" 
                            class="not-empty WAS_donation_form_input WAS_donation_form_donation_each_km"
                            type="number"
                            no-wheel="true"
                            autocomplete="off"
                            placeholder=""
                            @input="updateState('donation_each_km')"
                        >
                        </b-form-input>
                        </b-input-group>
                    </b-form-group>
                </b-col>
                <b-col cols="6" xl="2">
                    <b-form-group
                        :id="formid('WAS_donation_form_topay')"
                        label="Zu Spenden"
                        :label-for="formid('WAS_donation_form_topay')"
                        label-align="left"
                    >
                        <b-input-group append="€">
                        <b-form-input 
                            :id="formid('WAS_donation_form_topay')" 
                            v-model="topay" 
                            class="not-empty WAS_donation_form_input WAS_donation_form_topay"
                            type="number"
                            no-wheel="true"
                            autocomplete="off"
                            placeholder=""
                            disabled
                        >
                        </b-form-input>
                        </b-input-group>
                    </b-form-group>
                </b-col>
                <b-col cols="6" xl="4">
                    <b-form-group
                        :id="formid('WAS_donation_form_donation_amount_received_g')"
                        label="Erhaltener Betrag"
                        :label-for="formid('WAS_donation_form_donation_amount_received')"
                        label-align="left"
                    >
                        <b-input-group>
                            <b-form-input 
                                :id="formid('WAS_donation_form_donation_amount_received')" 
                                v-model="donation.donation_amount_received" 
                                class="not-empty WAS_donation_form_input WAS_donation_form_donation_amount_received"
                                type="number"
                                no-wheel="true"
                                autocomplete="off"
                                placeholder=""
                                @input="updateState('donation_amount_received')"
                            >
                            </b-form-input>
                            <template v-slot:append>
                                <b-input-group-text >€</b-input-group-text>
                                <b-button variant="outline-secondary" @click="applyToPay()">{{ topay }}€</b-button>
                            </template>
                            
                        </b-input-group>
                    </b-form-group>
                </b-col>
                <!--b-col>
                    <b-form-group
                        :id="formid('WAS_donation_form_donation_recived_g')"
                        label="Spende Erhalte"
                        :label-for="formid('WAS_edit_walker_form_donation_received')"
                        label-align="left"
                    >
                        <b-form-radio-group
                            :id="formid('WAS_edit_walker_form_donation_recived')" 
                            v-model="donation.needs_donation_receipt" 
                            class="not-empty"
                            :options="[{text:'Ja',value:'1'},{text:'Nein',value:'0'}]"
                            buttons
                        >  
                        </b-form-radio-group>
                    </b-form-group>
                </b-col-->
                <b-col cols="6" xl="2">
                    <b-form-group
                        :id="formid('WAS_donation_form_needs_donation_receipt_g')"
                        label="Quittung"
                        :label-for="formid('WAS_edit_walker_form_needs_donation_receipt')"
                        label-align="left"
                    >
                        <b-form-radio-group
                            :id="formid('WAS_edit_walker_form_needs_donation_receipt')" 
                            v-model="donation.needs_donation_receipt" 
                            class="not-empty WAS_donation_form_input WAS_edit_walker_form_needs_donation_receipt"
                            :options="[{text:'Ja',value:'1'},{text:'Nein',value:'0'}]"
                            buttons
                            @input="updateState('needs_donation_receipt')"
                        >  
                        </b-form-radio-group>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row class="WAS_donation_box_row">
                <b-col cols="6" xl="3">
                    <b-button pill variant="danger" size="sm" @click="$emit('deleteDonation', { isNew: isNew, i: donation_index})">
                        <b-icon icon="trash-fill"></b-icon>  Delete
                    </b-button>
                </b-col>
            </b-row>
        </div>
    </div>
</div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
    name: 'was-donation',
    props: {
        donation: Object,
        walker_id: Number,
        donation_index: Number,
        donation_state: Object,
        isNew: Boolean
    },
    data: function() {
        return {
            donation_identifier: 'donation_'+this.walker_id+'_'+this.donation_index,
            //cl: 'WAS_donation'+(this.new ? '' : '_new')
        }
    },
    methods: {
        formid: function(base_id) {
            return base_id + '__' + this.donation_identifier;
        },
        applyToPay: function() {
            this.donation.donation_amount_received = this.topay;
        },
        updateState: function(key) {
            if (this.isNew) 
                return;

            let context = this;
            this.$nextTick(function () {
                context.donation_state[key] = true;
            });
        },
        displayState: function() {
            for (let ds in this.donation_state) {
                if (ds != "new" && (this.isNew || this.donation_state[ds] == true)) {
                    let input = document.getElementById(this.formid("WAS_edit_walker_form_"+ds));
                    if (input != null) input.classList.add('border', 'border-warning');
                }
            }
        }
    },
    computed: {
        topay: function() {
            let f = parseFloat(this.donation.donation_each_km * (this.$parent.walker.distance_m/1000));
            if ((f - parseInt(f)) === 0.00) {
                return parseInt(f);
            } else {
                return f.toFixed(2);
            }
        }
    }
});
</script>


<style scoped>
.WAS_donation_box {
    border: 1px solid #D5D5D5;
    border-radius: 20px;
    padding: 20px !important;
}

.donation_row {
    
}

.WAS_donation_box_name {
    padding: 10px 20px 10px 20px;
    font-size: 1.4em;
    font-weight: bold;
    background-color: #fff;
    z-index: 20;
    position: relative;
    top: 22px;
    left: 50px;
    display: inline-block;
}

.WAS_edit_walker_form_needs_donation_receipt {
    width: 100%;
}

.WAS_donation_form_input.border {
    border-width: 3px;
}


</style>
