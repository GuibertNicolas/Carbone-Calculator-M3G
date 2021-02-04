export const state = () => ({
  resultEnergie: 0,
  resultTransport: 0,
  resultAlimentation: 0,
  resultDivers: 0
})

export const mutations = {
  SET_RESULT_ENERGIE (state, value) {
    // console.log('SET_RESULT_ENERGIE', value)
    state.resultEnergie = value
  },
  SET_RESULT_TRANSPORT (state, value) {
    // console.log('SET_RESULT_TRANSPORT', value)
    state.resultTransport = value
  },
  SET_RESULT_ALIMENTATION (state, value) {
    // console.log('SET_RESULT_ALIMENTATION', value)
    state.resultAlimentation = value
  },
  SET_RESULT_DIVERS (state, value) {
    // console.log('SET_RESULT_ALIMENTATION', value)
    state.resultDivers = value
  }
}
