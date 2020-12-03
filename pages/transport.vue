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
            <ResultTransports />
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
import Voitures from '~/components/Voitures.vue'
export default {
  name: 'Transport',
  components: {
    Voitures
  },
  data () {
    return {
      e1: 1,
      finalResult: 0,
      resVoiture: 0,
      resAvion: 0,
      resTrain: 0,
      resTec: 0,
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
      editable: true
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
          this.resVoiture = parseInt(r)
          break
        case 'avion':
          this.resAvion = parseInt(r)
          break
        case 'train':
          this.resTrain = parseInt(r)
          break
        case 'tec':
          this.resTec = parseInt(r)
          break
      }
      this.finalResult = parseInt(this.resVoiture + this.resAvion + this.resTrain + this.resTec)
    }
  }
}
</script>
