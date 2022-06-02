<template>

<div>
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
                        <option>8D</option>
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
                @click="saveNew"
            >
                <b-icon icon="file-earmark-plus" v-if="saveing_new == 0"></b-icon>
                <b-icon icon="check" v-if="saveing_new == 2"></b-icon>
                <b-spinner small v-if="saveing_new == 1"></b-spinner>
                Fertig
            </b-button>
        </b-col>
    </b-row>
</b-container>
<b-container id="WAS_bulkimport_container" class="shadow px-5 py-3 mb-5 mt-5 bg-light rounded">
    <b-row class="my-3">
        <b-col>
            <h2>Bulk Import mit CSV:</h2>
        </b-col>
    </b-row>
    <b-row class="my-3">
        <b-col>
            <div>
                Hier können viele Schüler:innen auf einmal importiert werden.
                Dafür einfach die Daten in dem Format
                <div id="WAS_bulk_format">
                    vorname,nachname,klasse,kurs
                </div>
                in das textfelt kopieren.
                Dabei ist eine Zeile eine Person.
                Das Felt <b>kurs</b> kann auch weggelassen werden, dann aber auch bitte das Komma mit weglassen.<br />
                Um diese CSV liste einfach zu erstellen, kann man eine Excel liste machen, die diesem Format entspricht.
                Also erste Spalte alle Vornamen, zweite Spalte die Nachnamen, dritte Spalte die Klassen und vierte Spalte, falls nötig, der Kurs.
                Die Klassen und Kurse dabei bitte mit Großbuchstaben. Ein Bsp:
                <p><b>Max,Mustermann,8C<br />Analena,Löwenbock,Q1,MA</b></p>
            </div>
        </b-col>
    </b-row>
    <b-row>
        <b-col cols="12">
        <b-form-textarea
            id="WAS_bulk_textarea"
            placeholder="vorname,nachname,klasse[,kurs]"
            rows="10"
            @input="updateCheckBulk"
        ></b-form-textarea>
        </b-col>
    </b-row>
    <b-row>
        <b-col cols="7" col-sm="12">
            <div id="WAS_bulk_error" v-text="bulk_error">
            </div>
        </b-col>
        <b-col cols="3" col-sm="6">
            <b-button
                :variant="bulk_check_variant"
                type="button"
                name="was_bulk_check" 
                id="WAS_bulk_check"
                @click="checkBulk"
            >
                <b-icon icon="file-earmark-check"></b-icon>
                <b-icon icon="check" v-if="check_bulk == 2"></b-icon>
                <b-icon icon="x" v-if="check_bulk == 3"></b-icon>
                <b-spinner small v-if="check_bulk == 1"></b-spinner>
                 <span v-if="check_bulk < 2"> Eingabe überprüfen</span>
            </b-button>
        </b-col>
        <b-col cols="2" col-sm="6">
            <b-button
                :variant="bulk_submit_variant"
                type="button"
                name="was_bulk_submit" 
                id="WAS_bulk_submit"
                :disabled="check_bulk != 2"
                @click="saveBulk"
            >
                <b-icon icon="file-earmark-plus" v-if="saveing_bulk == 0"></b-icon>
                <b-icon icon="check" v-if="saveing_bulk == 2"></b-icon>
                <b-spinner small v-if="saveing_bulk == 1"></b-spinner>
                Einfügen
            </b-button>
        </b-col>
    </b-row>
</b-container>
</div>

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
            saveing_new: 0,
            saveing_bulk: 0,
            check_bulk: 0,
            bulk_error: '',
            force_duplicate: false,
            force_duplicate_bulk: false,
        };
    },
    components: {
    },
    mounted() {
        this.clear();
    },
    methods: {
        saveNew: function() {
            this.saveing_new = 1;

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
                    this.saveing_new = 0;
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
                        this.saveNew();
                        return;
                    } else {
                        this.saveing_new = 0;
                        this.clear();
                        return;
                    }
                } else if (res.status === 400)
                    console.error("Bad Request at /api/walker/");
                else if (res.status === 200) {
                    this.saveing_new = 2;
                    this.force_duplicate = false;
                    setTimeout(() => {
                        this.clear();
                        this.saveing_new = 0;
                    }, 1100);
                }
            }).catch((err) => {
                console.error("Bad Request at /api/walker/. With Error: "+err.toString());
            })


        },
        saveBulk: function() {
            this.saveing_bulk = 1;
            let walkers = [];

            // check valid and parse
            let bulk = document.getElementById("WAS_bulk_textarea").value.split("\n");
            let csv_line_regex = /^\w+,\w+,(EPH|Q1|Q2|[5-9][A-D]),?\w*$/;
            for (let line of bulk) {
                // check valid
                if (!csv_line_regex.test(line)) {
                    const node = document.getElementById("WAS_bulkimport_container");
                    node.classList.add('animated', "shake")
                    function handleAnimationEnd() {
                        node.classList.remove('animated', "shake")
                        node.removeEventListener('animationend', handleAnimationEnd)
                    }
                    node.addEventListener('animationend', handleAnimationEnd);
                    this.saveing_bulk = 0;
                    return;
                } else {
                    // parse valid line
                    let fields = line.split(",")
                    walkers.push({
                        firstname: fields[0],
                        lastname: fields[1],
                        class: fields[2],
                        course: fields.length === 4 ? fields[3] : undefined  
                    })
                }
            }

            // upload
            let data = { walkers }
            if (this.force_duplicate_bulk)
                data.force_duplicate = true;

            this.$root.axios.post("/api/walker/bulk", data).then((res) => {
                if (res.status === 409 && res.data != null && res.data.errorid && parseInt(res.data.errorid) === 122) {
                    // duplicate
                    if (!res.data.duplicates) 
                        res.data.duplicates = []
                    if (!Array.isArray(res.data.duplicates)) 
                        res.data.duplicates = [res.data.duplicates]
                    
                    this.duplicateConfirm(res.data.duplicates).then(answer => {
                        if (answer) {
                            // retransmit with forced duplicate
                            this.force_duplicate_bulk = true;
                            this.saveBulk();
                            return;
                        } else {
                            // cancle and just clear state
                            this.saveing_bulk = 0;
                            this.bulk_error = '';
                            this.updateCheckBulk()
                        }
                    })
                } else if (res.status === 400)
                    console.error("Bad Request at /api/walker/bulk");
                else if (res.status === 200) {
                    this.saveing_bulk = 2;
                    this.bulk_error = '';
                    this.force_duplicate_bulk = false;
                    setTimeout(() => {
                        this.check_bulk = 0;
                        this.saveing_bulk = 0;
                    }, 4500);
                }
            }).catch((err) => {
                console.error("Bad Request at /api/walker/bulk. With Error: "+err.toString());
            })


        },
        duplicateConfirm: function(duplicates) {
            const h = this.$createElement
            let walker_html_elements = []
            for (let dup of duplicates) {
                walker_html_elements.push(
                    h('li', {}, [`${dup.firstname} ${dup.lastname} (${dup.class})`])
                )
            }
            const message = h('div', { class: ['duplicate_modal'] }, [
                h('p', { class: ['duplicate_modal_info'] }, [
                    `Von den Läufer:innen sind ${duplicates.length} Läufer:innen bereits in der Datenbank.
                    Abbrechen oder überschreiben`
                ]),
                h('ul', {}, walker_html_elements),
            ])
            return new Promise((resolve, reject) => {
                this.$bvModal.msgBoxConfirm([message], {
                    title: 'Doppelte Einträge',
                    buttonSize: 'sm',
                    okVariant: 'danger',
                    okTitle: 'Überschreiben',
                    cancelTitle: 'Abbrechen',
                    hideHeaderClose: true,
                    centered: true
                }).then(result => {resolve(result)})
                  .catch(err => {reject(err)})
            })
        },
        checkBulk: function() {
            this.bulk_error = ''
            this.check_bulk = 1
            let bulk = document.getElementById("WAS_bulk_textarea").value;
            let csv_line_regex = /^\w+,\w+,(EPH|Q1|Q2|[5-9][A-D]),?\w*$/;
            let counter = 1;
            for (let line of bulk.split("\n")) {
                if (!csv_line_regex.test(line)) {
                    this.bulk_error = `Fehler in Zeile ${counter}: ${line}`
                    this.check_bulk = 3;
                    return;
                }
                counter++
            }
            this.check_bulk = 2;
        },
        updateCheckBulk: function() {
            if (this.check_bulk > 1) this.check_bulk = 0;
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
    },
    computed: {
        bulk_check_variant: function() {
            if (this.check_bulk === 0 || this.check_bulk === 1) 
                return "secondary";
            if (this.check_bulk === 2)
                return "success";
            if (this.check_bulk === 3)
                return "danger";
            return "secondary";
        },
        bulk_submit_variant: function() {
            if (this.saveing_bulk == 2) 
                return "success"
            else return "primary"
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

#WAS_new_walker_submit,
#WAS_bulk_check,
#WAS_bulk_submit {
    width: 100%;
    max-width: 100%;
}

#WAS_bulk_format {
    font-weight: bold;
    margin: 5px auto;
    text-align: center;
    font-size: 1.2rem;
}

#WAS_bulk_textarea {
    margin-bottom: 15px;
}

#WAS_bulk_error {
    font-style: italic;
}
</style>