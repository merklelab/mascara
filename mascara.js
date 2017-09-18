const setupProvider = require('./lib/setup-provider.js')
const setupDappAutoReloadForMetaMask = require('./lib/auto-reload.js')
const MASCARA_ORIGIN = process.env.MASCARA_ORIGIN || 'http://localhost:9001'

//
// setup web3
//

const provider = setupProvider({
  mascaraUrl: MASCARA_ORIGIN + '/proxy/',
})
instrumentForUserInteractionTriggers(provider)

// export metamask
global.metamask = setupDappAutoReloadForMetaMask(provider, provider.publicConfigStore)
//
// ui stuff
//

let shouldPop = false
window.addEventListener('click', maybeTriggerPopup)

//
// util
//

function maybeTriggerPopup(){
  if (!shouldPop || window.META_MASK) return
  shouldPop = false
  window.open(MASCARA_ORIGIN, '', 'width=360 height=500')
}

function instrumentForUserInteractionTriggers(provider){
  const _super = provider.sendAsync.bind(provider)
  provider.sendAsync = function (payload, cb) {
    if (payload.method === 'eth_sendTransaction') {
      shouldPop = true
    }
    _super(payload, cb)
  }
}

