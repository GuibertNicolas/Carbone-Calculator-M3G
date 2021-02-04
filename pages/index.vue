<template>
  <v-row class="mb-12" justify="center">
    <v-col class="test-center" lg="7">
      <v-card style="margin-bottom: 10px" elevation="2" @click="redirectTo('transport')">
        <v-card-title style="background-color: #006a9e; color: white">
          <v-row>
            <v-col class="text-left">
              Transports
            </v-col>
            <v-col class="text-right">
              {{ $store.state.resultTransport }} kg
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="text-left">
          Calcul de votre empreinte carbone anuelle par rapport à vos
          transports
        </v-card-text>
      </v-card>
      <v-card style="margin-bottom: 10px" elevation="2" @click="redirectTo('energies')">
        <v-card-title style="background-color: #dd0061; color: white">
          <v-row>
            <v-col class="text-left">
              Énergies
            </v-col>
            <v-col class="text-right">
              {{ $store.state.resultEnergie }} kg
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="text-left">
          Calcul de votre empreinte carbone anuelle par rapport à votre
          consomation de gaz et d'électricité
        </v-card-text>
      </v-card>
      <v-card style="margin-bottom: 10px" elevation="2" @click="redirectTo('alimentations')">
        <v-card-title style="background-color: #ff4814; color: white">
          <v-row>
            <v-col class="text-left">
              Alimentations
            </v-col>
            <v-col class="text-right">
              {{ $store.state.resultAlimentation }} kg
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="text-left">
          Calcul de votre empreinte carbone anuelle par rapport à votre
          alimentation
        </v-card-text>
      </v-card>
      <v-card style="margin-bottom: 10px" elevation="2" @click="redirectTo('objetsduquotidien')">
        <v-card-title style="background-color: #fecd33; color: white">
          <v-row>
            <v-col class="text-left">
              Objets du quotidien
            </v-col>
            <v-col class="text-right">
              {{ $store.state.resultDivers }} kg
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="text-left">
          Calcul de votre empreinte carbone anuelle par rapport à vos objets du quotidien
        </v-card-text>
      </v-card>
      <v-btn
        @click="coucou()"
      >
        <v-icon>
          mdi-delete
        </v-icon>
        Effacer
      </v-btn>
    </v-col>
    <v-col lg="5">
      <FinalPieChart />
    </v-col>
  </v-row>
</template>
<script>
import FinalPieChart from '@/components/FinalPieChart.js'
export default {
  components: {
    FinalPieChart
  },

  data () {
    return {
      scoreEnergie: 0
    }
  },
  methods: {
    redirectTo (link) {
      this.$router.push(link)
    },
    coucou () {
      localStorage.clear()
      window.location.reload()
    }
  }
}
</script>
