<template>
<b-container fluid id="WAS_container">
    <b-row id="WAS_row">
        <b-col cols="4" id="WAS_search_col">
            <b-form-input placeholder="Search.." id="WAS_list_search_input" size="lg" autofocus type="search" v-model="search">
            </b-form-input>
            <b-icon icon="search" id="WAS_list_search_search" aria-hidden="true" v-show="search == ''">
            </b-icon>
                <ul id="WAS_walker_list">
                    <router-link 
                        v-for="w in filteredWalker" 
                        class="WAS_walker_list_item row" 
                        :key="w.rec_id"
                        tag="li"
                        exact 
                        exact-active-class="WAS_walker_list_item_active" 
                        active-class="nonesese" 
                        replace
                        :id="'WAS_WALKER_'+w.rec_id" 
                        :to="{ name: 'edit-walker', params: { id: w.rec_id } }"
                    >
                        <div class="col-8 col-xl-8 WAS_walker_list_name">{{ w.firstname }}&nbsp;{{ w.lastname }}</div>
                        <div class="col-md-2 WAS_walker_list_class">{{ w.class }}</div>
                        <!--div class="col-xl-2 d-none d-xl-block WAS_walker_list_distance">{{ w.distance_m }}m</div-->
                        <div class="col-md-2 WAS_walker_list_status">
                            <b-icon :icon="getIcon(w.distance_m, w.participates)" class="WAS_walker_list_status_icon" aria-hidden="true">
                            </b-icon>
                        </div>
                    </router-link>
                </ul>
            <!--div id="WAS_walker_list_shadow" aria-hidden="true"></div-->
        </b-col>
        <b-col cols="8" id="WAS_edit_col">
            <transition
                name="edit_walker_transition"
                enter-active-class="animated bounceInLeft faster edit_walker_transition"
                mode="in-out"
            >
            <router-view  @scrolldown="scrolldown" />
            </transition>
        </b-col>
    </b-row>
</b-container>
</template>

<script>
import helper from '@/includes/helper';
import smoothscroll from 'smoothscroll-polyfill';
// kick off the polyfill!
smoothscroll.polyfill();

export default {
    data: function () {
        return { 
            search: '',
            walker: null
        };
    },
    mounted() {
        this.$root.axios.get("/api/walker").then((res) => {
            if (res.status == 200) {
                this.walker = res.data.walker;
            } else {
                console.error(
                    res.status+": error "+(res.data.error?res.data.error:"")+(res.data.errorid?res.data.errorid:"")
                );
            }
        }).catch(function(err) {
            console.log(err);
        });
        setTimeout(() => {
            this.$root.socket.on('walker_lock', rec_id => {
                let walker_item = document.getElementById("WAS_WALKER_"+rec_id)
                if (walker_item)
                    walker_item.classList.add("WAS_WALKER_DISABLED");
            });
            this.$root.socket.on('walker_unlock', rec_id => {
                let walker_item = document.getElementById("WAS_WALKER_"+rec_id)
                if (walker_item)
                    walker_item.classList.remove("WAS_WALKER_DISABLED");
            });
            this.$root.socket.on('walker_added', w => {
                this.walker.push(w);
            });
            this.$root.socket.on('walker_deleted', rec_id => {
                for (var i = this.walker.length - 1; i >= 0; i--) {
                    if (this.walker[i].rec_id == rec_id)
                        this.walker.splice(i, 1);
                }
            });

        }, 1000);
    },
    methods: {
        getIcon(dist, part) {
            if (part == 1) {
                if (dist > 0) return "circle-fill";
                else return "circle";
            } else if (part == 2) {
                return "x-circle"
            } else if (part == 0) {
                return "exclamation-circle-fill"
            }
        },
        scrolldown() {
            setTimeout(() => {
                let edit_col = document.getElementById("WAS_edit_col");
                edit_col.scroll({ top: edit_col.scrollHeight, left: 0, behavior: 'smooth' });
            }, 500);
        }
    },
    computed: {
        filteredWalker: function() {
            let _walker = this.walker;
            let _search = this.search;
            return helper.filterWalker(_walker, _search);
        }
    }
};

</script>

<style scoped>
body {
    overflow: hidden;
}
#WAS_row {
    height: calc(100vh - 50px);
    overflow: hidden;
}
#WAS_container {
    padding-top: 0px;
    height: calc(100vh - 50px);
    --sidebar_color: #EFEFEF;
    overflow: hidden;
}

#WAS_list_search_search, #WAS_list_search_x {
    position: absolute;
    font-size: 1.3rem;
    left: calc(33.33vw - 65px);
    top: 24px;
    z-index: 120;
}

#WAS_walker_list {
    font-size: 1.2rem;
    padding: 0px;
    margin: 0px;
    width: 100%;
    position: relative;
    z-index: 140;
    overflow-y: scroll;
    -moz-overflow-y: -moz-scrollbars-none;
    -ms-overflow-style: none;
    height: calc(100vh - 115px);
}

#WAS_walker_list::-webkit-scrollbar { 
    display: none;
}

#WAS_search_col {
    background-color: var(--sidebar_color);
    box-shadow: 1px 0px 3px 1px rgba(189, 189, 189, 1);
    height: calc(100vh - 50px);
    overflow: hidden;
    padding-top: 10px;
    z-index: 50;
    transition-duration: .2s !important;
}

#WAS_edit_col {
    overflow-y: scroll;
    height: calc(100vh - 50px);
    -moz-overflow-y: -moz-scrollbars-none;
    -ms-overflow-style: none;
}

#WAS_edit_col::-webkit-scrollbar { 
    display: none;
}

#WAS_walker_list_shadow {
    display: block;
    height: calc(100vh + 50px);
    position: absolute;
    overflow: hidden;
    bottom: 0px;
    left: 0px;
    background-color: rgba(0,0,0,0.0);
    /*box-shadow: -8px 13px 13px 4px inset rgba(231, 231, 231, 1.0);*/
    box-shadow: -8px 13px 13px 4px inset rgba(255, 255, 255, 1.0);
    z-index: 100;
    width: calc(100vw * 0.333333);
    pointer-events: none;
}

#WAS_list_search_input {
    border-radius: 0px;
    border: 0px;
    width: calc(33.33vw - 43px);
    margin-left: 10px;
    margin-bottom: 10px;
    position: relative;
    z-index: 110;
    outline: none !important;
    margin-right: 0px;
    border-bottom: #6D6D6D 2px solid;
    background-color: var(--sidebar_color);
}
#WAS_list_search_input:focus, #WAS_list_search_input:active, #WAS_list_search_input:hover, #WAS_list_search_input:selected {
    outline: none !important;
    box-shadow: none !important;
}

.WAS_walker_list_distance {
    font-size: 0.8em;
}

.WAS_WALKER_DISABLED {
    opacity: 0.3;
    pointer-events: none;
}

.WAS_walker_list_item {
    padding: 10px 5px 10px 5px;
    margin: 0px 10px 0px 10px;
    width: calc(100% - 20px);
    max-width: 100%;
    background-color: var(--sidebar_color);
    transition: background-color 0.11s ease-out;
    border-bottom: 1px solid #B6B6B6;
    position: relative;
    z-index: 121 !important;
}

.WAS_walker_list_item_active {
    background-color: rgba(0, 0, 0, 0.10) !important;
}

.WAS_walker_list_item:hover {
    background-color: rgba(0, 0, 0, 0.07) !important;
}

.WAS_walker_list_item div {
    text-align: center;
}
.WAS_walker_list_name {
    text-align: left !important;
}

.WAS_walker_list_status_icon {
    font-size: 1.4em;
}

.WAS_walker_list_distance {
    color: #9B9B9B;
}

.bi-circle,
.bi-x-circle {
    color: #555555;
}

.bi-circle-fill {
    color: var(--success);
}

.bi-exclamation-circle-fill {
    color: var(--danger);
}

.edit_walker_transition-enter-active {
    transition-duration: .2s !important;
}
</style>