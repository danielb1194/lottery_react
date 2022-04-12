import "./App.css"
import React, { Component } from "react"
import lottery from "./lottery"
import web3 from "./web3"
// import web3 from "./web3"

class App extends Component {
  state = { 
    manager: '...',
    players: [],
    balance: '',
    accounts: [],
    message: ''
  }  

  async componentDidMount () {
    const manager = await lottery.methods.manager().call()
    const players = await lottery.methods.getPlayers().call()
    const balance = await web3.eth.getBalance(lottery.options.address)
    const accounts = await web3.eth.getAccounts()

    this.setState({ manager, players, balance, accounts })
    // console.log(this.state)
  }

  onSubmit = async event => {
    event.preventDefault()

    // get the selected account and enter the lottery!
    this.setState({ message: 'Waiting on transaction approval...' })

    await lottery.methods.enter().send({
      from: this.state.accounts[0],
      value: web3.utils.toWei('0.001', 'ether')
    })

    this.setState({ message: 'You have entered the lottery!' })
  }

  pickWinner = async event => {
    event.preventDefault()

    this.setState({ message: 'Drums...' })
    // picks a winner out of the pool of participants
    await lottery.methods.pickWinner().send({
      from: this.state.accounts[0]
    })

    const winner = await lottery.methods.winner().call()
    
    this.setState({ message: `A winner has been picked! our winner is: ${winner}` })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          This is our lottery contract!
          <p>
            There are currently {this.state.players.length} people playing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
          </p>
          <form onSubmit={this.onSubmit}>
            <h4>Want to try your luck?</h4>
            <label>Enter the lottery using 0.001 ETH</label>
            <p> </p>
            <button onClick={this.onSubmit}>Enter Lottery</button>
          </form>

          <p/>

          <h1>{this.state.message}</h1>
        </header>
        <p>
          This contract is managed by {this.state.manager} {this.state.accounts[0] === this.state.manager && '(You)'}
        </p>
        {this.state.accounts[0] === this.state.manager && 
          <div>
            <p/>
            <div>Is it time to pick a winner?</div>
            <button onClick={this.pickWinner}>Pick a winner</button>
          </div> 
        }
        
      </div>
    )
  }
}
export default App
