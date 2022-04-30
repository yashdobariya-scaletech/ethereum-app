import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: '', web3: null, accounts: null, contract: null, newValue:"" };

  componentDidMount = async () => {
    try {

      this.handleChange = this.handleChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log(networkId,'networkId');
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      console.log(deployedNetwork.address,'deployedNetwork');
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { contract } = this.state;
    
    try{
      const response = await contract.methods.get().call();
      this.setState({storageValue:response})
    }catch(error){
      console.log(error);
    }
  };

  handleChange(e){
    console.log(e.target.value,'value');
    this.setState({
      newValue:e.target.value
    })
  }

  async handleSubmit(e){
    e.preventDefault()

    const {accounts, contract,newValue} = this.state;
    await contract.methods.set(newValue).send({ from: accounts[0] });

    try{
      const response = await contract.methods.get().call();
      this.setState({storageValue:response})
    }catch(error){
      console.log(error);
    }
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
      <h1>Welcome To My First Dapp!</h1>
      <form onSubmit={this.handleSubmit}>
        <input type='text' value={this.state.newValue} onChange={this.handleChange.bind(this)} />
        <button type="submit" value='Submit'>Submit</button>
      </form>
        <div>Filip Likes {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
