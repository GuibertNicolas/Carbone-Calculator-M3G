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
            color="#fecd33"
          >
            {{ n.name }}
          </v-stepper-step>
          <v-divider v-if="n.id !== steps.length" :key="n.id" />
        </template>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content v-for="n in steps" :key="`${n.id}-content`" :step="n.id">
          <div v-if="n.id === 1">
            <Vetement @vetEvent="getFinal" />
          </div>
          <div v-else-if="n.id === 2">
            <Multimedia @mediaEvent="getFinal" />
          </div>
          <div v-else-if="n.id === 3">
            <Electromenager @menagerEvent="getFinal" />
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
                      <DiversPieChart :resdata="res" :testprop="trigger" />
                      <v-btn
                        @click="saveAlimentation()"
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
import DiversPieChart from '@/components/divers/DiversPieChart'
import Vetement from '@/components/divers/vetement'
import Electromenager from '@/components/divers/electromenager'
import Multimedia from '@/components/divers/multimedia'
export default {
  name: 'ObjetsDuQuotidien',
  components: {
    Vetement,
    Multimedia,
    Electromenager,
    DiversPieChart
  },
  data () {
    return {
      e1: 1,
      finalResult: 0,
      res: {
        resVet: 0,
        resMedia: 0,
        resElectroMenager: 0
      },
      steps: [
        {
          name: 'Vêtements',
          id: 1,
          check: true
        },
        {
          name: 'Multimédias',
          id: 2,
          check: true
        },
        {
          name: 'Électroménagers',
          id: 3,
          check: true
        },
        {
          name: 'Résultat',
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
        case 'vet':
          this.res.resVet = parseInt(r)
          // this.data[0].value = this.res.resVoiture
          break
        case 'media':
          this.res.resMedia = parseInt(r)
          // this.data[1].value = this.res.resAvion
          break
        case 'menager':
          this.res.resElectroMenager = parseInt(r)
          // this.data[1].value = this.res.resAvion
          break
      }
      this.finalResult = parseInt(this.res.resVet + this.res.resMedia + this.res.resElectroMenager)
      this.trigger = !this.trigger
    },
    saveAlimentation () {
      this.$store.state.resultDivers = this.finalResult
      this.$router.push('/')
    }
  }
}
</script>
