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
            color="#ff4814"
          >
            {{ n.name }}
          </v-stepper-step>
          <v-divider v-if="n.id !== steps.length" :key="n.id" />
        </template>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content v-for="n in steps" :key="`${n.id}-content`" :step="n.id">
          <div v-if="n.id === 1">
            <Dejeuner @dejEvent="getFinal" />
          </div>
          <div v-else-if="n.id === 2">
            <Repas @repasEvent="getFinal" />
          </div>
          <div v-else-if="n.id === 3">
            <Boisson @boissonEvent="getFinal" />
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
                      <AlimentationPieChart :resdata="res" :testprop="trigger" />
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
import AlimentationPieChart from '@/components/alimentation/AlimentationPieChart'
import Dejeuner from '@/components/alimentation/dejeuner'
import Repas from '@/components/alimentation/repas'
import Boisson from '@/components/alimentation/boisson'
export default {
  name: 'Alimentations',
  components: {
    Dejeuner,
    Boisson,
    Repas,
    AlimentationPieChart
  },
  data () {
    return {
      e1: 1,
      finalResult: 0,
      res: {
        resDej: 0,
        resRepas: 0,
        resBoisson: 0
      },
      steps: [
        {
          name: 'Petit déjeuner',
          id: 1,
          check: true
        },
        {
          name: 'Repas',
          id: 2,
          check: true
        },
        {
          name: 'Boissons',
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
        case 'dej':
          this.res.resDej = parseInt(r)
          // this.data[0].value = this.res.resVoiture
          break
        case 'repas':
          this.res.resRepas = parseInt(r)
          // this.data[1].value = this.res.resAvion
          break
        case 'boisson':
          this.res.resBoisson = parseInt(r)
          // this.data[1].value = this.res.resAvion
          break
      }
      this.finalResult = parseInt(this.res.resDej + this.res.resRepas + this.res.resBoisson)
      this.trigger = !this.trigger
    },
    saveAlimentation () {
      this.$store.state.resultAlimentation = this.finalResult
      this.$router.push('/')
    }
  }
}
</script>
