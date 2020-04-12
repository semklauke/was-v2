<template>
<b-container id="WAS_newwalker_container" class="shadow px-5 py-3 mb-5 mt-5 bg-light rounded">
    <b-row class="my-3">
        <b-col>
            <h2>Neuen Läufer erstellen:</h2>
        </b-col>
    </b-row>    


    <b-row>
        <b-col cols="6">
            <b-form-group
                id="WAS_new_walker_form_firstname_g"
                label="Vorname"
                label-for="WAS_new_walker_form_firstname"
                label-align="left"
            >
                <b-form-input 
                    id="WAS_new_walker_form_firstname" 
                    v-model="walker.firstname" 
                    class="not-empty"
                    autocomplete="off"
                >  
                </b-form-input>
            </b-form-group>
        </b-col>
        <b-col cols="6">
            <b-form-group
                id="WAS_new_walker_form_lastname_g"
                label="Nachname"
                label-for="WAS_new_walker_form_lastname"
                label-align="left"
            >
                <b-form-input 
                    id="WAS_new_walker_form_lastname" 
                    v-model="walker.lastname" 
                    class="not-empty"
                    autocomplete="off"
                >  
                </b-form-input>
            </b-form-group>
        </b-col>
    </b-row>    
    <b-row>
        <b-col cols="6">
            <b-form-group
                id="WAS_new_walker_form_class_g"
                label="Klasse"
                label-for="WAS_new_walker_form_class"
                label-align="left"
            >
                <b-form-select
                    id="WAS_new_walker_form_class" 
                    v-model="walker.class" 
                    class="not-empty"
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
        </b-col>
        <b-col cols="6" v-if="walker.class == 'EPH' || walker.class == 'Q1' || walker.class == 'Q2'">
            <b-form-group
                id="WAS_new_walker_form_course_g"
                label="Kurs"
                label-for="WAS_new_walker_form_course"
                label-align="left"
            >
                <b-form-select
                    id="WAS_edit_walker_form_course" 
                    v-model="walker.course" 
                >  
                    <option value="null">-</option>
                    <option value="DE">Deutsch</option>
                    <option value="MA">Mathe</option>
                    <option value="EN">English</option>
                    <option value="PA">Paedagogik</option>
                </b-form-select>
            </b-form-group>
        </b-col>
        <b-col cols="6">
            <b-form-group
                id="WAS_new_walker_form_participates_g"
                label="Teilnahme"
                label-for="WAS_new_walker_form_participates"
                label-align="left"
            >
                <b-form-radio-group
                    id="WAS_new_walker_form_participates" 
                    v-model="walker.participates"
                    class="not-empty"
                    :options="[{text:'Ja',value:'1'},{text:'Nein',value:'0'},{text:'Entschuldigt',value:'2'}]"
                    buttons
                >  
                </b-form-radio-group>
            </b-form-group>
        </b-col>
    </b-row>
    <b-row>
            <b-col cols="10" col-sm="6"></b-col>
            <b-col cols="2" col-sm="6">
                <b-button
                    variant="primary"
                    type="submit"
                    name="was_new_walker_submit" 
                    id="WAS_new_walker_submit"
                    @click="save"
                >
                    <b-icon icon="file-earmark-plus" v-if="saveing == 0"></b-icon>
                    <b-icon icon="check" v-if="saveing == 2"></b-icon>
                    <b-spinner small v-if="saveing == 1"></b-spinner>
                    Fertig
                </b-button>
            </b-col>
        </b-row>
</b-container>    
</template>


<script>


export default {
    data: function () {
        return {
            walker: {
                class: null,
                distance_m: 0,
                lastname: "",
                firstname: "",
                participates: 1,
                course: null
            },
            saveing: 0,
            force_duplicate: false,
        };
    },
    components: {
    },
    mounted() {
        this.clear();
    },
    methods: {
        save: function() {
            this.saveing = 1;

            // check valid
            
            for (let w in this.walker) {
                if (w != "course" && (this.walker[w] === null || this.walker[w] === "")) {
                    const node = document.getElementById("WAS_newwalker_container");
                    node.classList.add('animated', "shake")
                    function handleAnimationEnd() {
                        node.classList.remove('animated', "shake")
                        node.removeEventListener('animationend', handleAnimationEnd)
                    }
                    node.addEventListener('animationend', handleAnimationEnd);
                    this.saveing = 0;
                    return;
                }
            }

            // upload

            let data = {
                walker: this.walker
            }
            if (this.force_duplicate)
                data.force_duplicate = true;

            this.$root.axios.post("/api/walker/", data).then((res) => {
                if (res.status === 409 && res.data != null && res.data.errorid && parseInt(res.data.errorid) === 104) {
                    // duplicate
                    let name = this.walker.firstname + " " + this.walker.lastname;
                    if (window.confirm("Der Name "+name+" existiert bereits. Trozdem fohrtfahren?")) {
                        this.force_duplicate = true;
                        this.save();
                        return;
                    } else {
                        this.saveing = 0;
                        this.clear();
                        return;
                    }
                } else if (res.status === 400)
                    console.error("Bad Request at /api/walker/");
                else if (res.status === 200) {
                    this.saveing = 2;
                    this.force_duplicate = false;
                    setTimeout(() => {
                        this.clear();
                        this.saveing = 0;
                    }, 1100);
                }
            }).catch((err) => {
                console.error("Bad Request at /api/walker/. With Error: "+err.toString());
            })


        },

        clear: function() {
            this.walker = {
                class: null,
                distance_m: 0,
                lastname: "",
                firstname: "",
                participates: 1,
                course: null
            }
        }
    }
};

</script>

<style scoped>
body {
    background-color: #E7E7E7;
}

#WAS_edit_walker_form_participates {
    width: 100%;
}

#WAS_new_walker_submit {
    width: 100%;
    max-width: 100%;
}
</style>