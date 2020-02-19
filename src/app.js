App = {
    loading: false,
    contracts: {},

    load: async () => {
        //Load app
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },

// https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

    loadAccount: async () => {
        App.account = web3.eth.accounts[0]
        console.log(App.account)
    },

    loadContract: async () => {
        const todoList = await $.getJSON('TodoList.json')
        // console.log(todoList)

        // create javascript version of smart contracts
        App.contracts.TodoList = TruffleContract(todoList)
        App.contracts.TodoList.setProvider(App.web3Provider)
        console.log(todoList);

        //hydrate the smart contract with values from the blockchain
        App.todoList = await App.contracts.TodoList.deployed()
    },

    render: async () => {

        // prevent double render
        if(App.loading){
            return
        }
        //update app loading state
        App.setLoading(true)

        //render account
        $('#account').html(App.account) 

        // update loading state
        App.setLoading(false)
    },

    renderTasks: async () => {

        //load the total tasks count from the blockchain

        // render out each task with a new task  template

        //show the task
    },

    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
            loader.show()
            content.hide()
        } else{
            loader.hide()
            content.show()
        }
    }

}


$(() => {
    $(window).load(() => {
        App.load()
    })
})