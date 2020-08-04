<template>
<b-container id="WAS_overview_container" fluid class="mt-3">
    <b-card-group columns>
        <b-card header="Läufer" class="WAS_overview_card">
            <h3>{{ count_walker.total }}</h3>
            <div class="total_walker_small">
                <dl class="row">
                    <dt class="col-sm-8">Ja</dt>
                    <dd class="col-sm-4">{{ count_walker.part }}</dd>
                    <dt class="col-sm-8">Nein</dt>
                    <dd class="col-sm-4">{{ count_walker.nonpart }}</dd>
                    <dt class="col-sm-8">Entschuldigt</dt>
                    <dd class="col-sm-4">{{ count_walker.excused }}</dd>
                </dl>
            </div>
        </b-card>

        <b-card header="Noch Unterwegs" class="WAS_overview_card">
            <h3>{{ count_walker.missing }}</h3>
        </b-card>

        <b-card header="Strecke" class="WAS_overview_card">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Meter</th>
                        <th scope="col">Läufer</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="d in distances">
                        <td>{{ d.distance_m }}m</td>
                        <td>{{ d.walkers }}</td>
                    </tr>
                </tbody>
            </table>
        </b-card>

        <b-card header="Spenden" class="WAS_overview_card">
            <h3>{{ donations.money }}€</h3>
            <div class="total_donations_small">
                <strong>{{ donations.total }}</strong> Spenden 
                von <strong>{{ donations.walker }}</strong> Läufern
            </div>
        </b-card>

        <b-card header="User im System">
            <h3>{{ user_count }}</h3>
        </b-card>

    </b-card-group>
</b-container>    
</template>


<script>


export default {
    data: function () {
        return {
            count_walker: {
                total: 0, 
                part: 0,
                nonpart: 0,
                excused: 0,
                missing: 1
            },
            distances: [
                {
                    distance_m: 2,
                    walkers: 2
                }
            ],
            donations: {
                money: 3.0,
                total: 3,
                walker: 3,
                topay: 3
            },
            user_count: "--"
        };
    },
    components: {
    },
    mounted() {
        this.$root.axios.get("/api/overview").then((res) => {
            if (res.status == 200) {
                this.count_walker = res.data.count_walker;
                this.distances = res.data.distances;
                this.donations = res.data.donations;
            } else {
                console.error(res.status);
            }
        }).catch(function(err) {
            console.error(err);
        });
        setTimeout(() => {
            this.$root.socket.on('user_count_changed', usercount => {
                this.user_count = usercount;
            });
        }, 1000);
    },
    methods: {
    }
};

</script>

<style scoped>
.total_walker_small {

}

.total_walker_small_heading {

}

.total_donations_small {

}

.WAS_overview_card {

}
</style>