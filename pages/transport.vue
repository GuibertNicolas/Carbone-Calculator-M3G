<template>
  <v-stepper v-model="e1" :vertical="true" :alt-labels="true">
    <template>
      <v-stepper-header>
        <template v-for="n in steps">
          <v-stepper-step
            :key="`${n.name}`"
            :complete="e1 > n.id"
            :step="n.id"
            :editable="editable"
            :rules="[() => n.check]"
            color="#006a9e"
          >
            {{ n.name }}
          </v-stepper-step>
          <v-divider v-if="n.id !== steps.length" :key="n.id" />
        </template>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content v-for="n in steps" :key="`${n.id}-content`" :step="n.id">
          <div v-if="n.id === 1">
            <Voitures @carEvent="getFinal" />
          </div>
          <div v-else-if="n.id === 2">
            <Avions @planeEvent="getFinal" />
            <Trains @trainEvent="getFinal" />
          </div>
          <div v-else-if="n.id === 3">
            <TransportsEnCommun @tecEvent="getFinal" />
          </div>
          <div v-else>
            <v-card class="mb-12">
              <v-row>
                <v-col class="text-center">
                  <div
                    label="test"
                    :class="`rounded`"
                    class="pa-4 text-center primary--text text-no-wrap outlined"
                    outlined
                  >
                    <div
                      class="text-center"
                      style="width: 600px; height:600px; margin-left: auto; margin-right: auto"
                    >
                      <TransportPieChart :resdata="res" :testprop="trigger" />
                      <v-btn
                        @click="saveTransport()"
                      >
                        Sauvegarder
                      </v-btn>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </div>
          <v-row>
            <v-col class="text-center">
              <div class="display-1 font-weight-medium">
                Total : {{ finalResult }} KgCO<sub>2</sub>
              </div>
            </v-col>
          </v-row>
        </v-stepper-content>
      </v-stepper-items>
    </template>
  </v-stepper>
</template>
<script>
import TransportPieChart from '@/components/transport/PieChart/TransportPieChart'
import Voitures from '@/components/transport/Voitures.vue'
import Avions from '@/components/transport/Avions.vue'
import Trains from '@/components/transport/Trains.vue'
import TransportsEnCommun from '@/components/transport/TransportsEnCommun.vue'
export default {
  name: 'Transport',
  components: {
    TransportPieChart,
    Voitures,
    Avions,
    Trains,
    TransportsEnCommun
  },
  data () {
    return {
      e1: 1,
      finalResult: 0,
      res: {
        resVoiture: 0,
        resAvion: 0,
        resTrain: 0,
        resTec: 0
      },
      steps: [
        {
          name: 'Voitures',
          id: 1,
          check: true
        },
        {
          name: 'Avions / Trains',
          id: 2,
          check: true
        },
        {
          name: 'Transports en commun',
          id: 3,
          check: true
        },
        {
          name: 'Résultats',
          id: 4,
          check: true
        }
      ],
      vertical: false,
      altLabels: true,
      editable: true,
      trigger: true
    }
  },

  watch: {
    steps (val) {
      if (this.e1 > val) {
        this.e1 = val
      }
    },
    vertical () {
      this.e1 = 4
    }
  },

  methods: {
    onInput (val) {
      this.steps = parseInt(val)
    },
    nextStep (n) {
      if (n === this.steps) {
        this.e1 = 1
      } else {
        this.e1 = n + 1
      }
    },
    getFinal (r, name) {
      switch (name) {
        case 'voiture':
          this.res.resVoiture = parseInt(r)
          // this.data[0].value = this.res.resVoiture
          break
        case 'avion':
          this.res.resAvion = parseInt(r)
          // this.data[1].value = this.res.resAvion
          break
        case 'train':
          this.res.resTrain = parseInt(r)
          // this.data[2].value = this.res.resTrain
          break
        case 'tec':
          this.res.resTec = parseInt(r)
          // this.data[3].value = this.res.resTec
          break
      }
      this.finalResult = parseInt(this.res.resVoiture + this.res.resAvion + this.res.resTrain + this.res.resTec)
      this.trigger = !this.trigger
    },
    saveTransport () {
      this.$store.state.resultTransport = this.finalResult
      this.$router.push('/')
    }
  }
}
</script>
