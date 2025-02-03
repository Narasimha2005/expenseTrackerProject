import {Component} from 'react'
import {v4 as uuidv4} from 'uuid'
import Cookies from 'js-cookie'
import './index.css'
import MoneyDetails from '../MoneyDetails'
import TrasactionItem from '../TransactionItem'

const transactionTypeOptions = [
  {
    optionId: 'INCOME',
    displayText: 'Income',
  },
  {
    optionId: 'EXPENSES',
    displayText: 'Expenses',
  },
]

class MoneyManager extends Component {
  state = {
    titleInput: '',
    amountInput: '',
    typeInput: 'Income',
    historyList: [],
  }

  componentDidMount(){
    this.getData()
  }

  getData = async ()=>{
    const apiUrl = "http://localhost:3000/"
    const jwtToken = Cookies.get("jwt_token")
    const options={
      headers:{
        "Content-Type": "application/json",
        Authorization:`Bearer ${jwtToken}`,
      },
      method:"GET",
      credentials: "include"
      
    }
    const response = await fetch(apiUrl,options)
    const data = await response.json()
    this.setState({historyList:data.transactions})
    console.log(data)
  }

  onChangeTitle = event => {
    this.setState({titleInput: event.target.value})
  }

  onChangeAmount = event => {
    this.setState({amountInput: event.target.value})
  }

  onChangeType = event => {
    let type
    if (event.target.value === 'INCOME') {
      type = 'Income'
    } else {
      type = 'Expenses'
    }
    this.setState({typeInput: type})
  }

  onLogout = ()=>{
    Cookies.remove("jwt_token")
  }

  updateTransactionToDb=async (newTransactionList)=>{
    const apiUrl = `http://localhost:3000/update-transaction`
    const jwtToken = Cookies.get("jwt_token")
    const options={
      headers:{
        "Content-Type": "application/json",
        Authorization:`Bearer ${jwtToken}`,
      },
      method:"POST",
      body:JSON.stringify(newTransactionList),
      credentials: "include"
    }
    const response = await fetch(apiUrl,options)
    const data = await response.json()
    console.log(data)
  }

  onAddTransaction = event => {
    event.preventDefault()
    const {titleInput, amountInput, typeInput,historyList} = this.state
    const newTransaction = {
      id: uuidv4(),
      title: titleInput,
      amount: amountInput,
      type: typeInput,
    }
    this.updateTransactionToDb([...historyList, newTransaction])
    this.setState(prevState => ({
      historyList: [...prevState.historyList, newTransaction],
      titleInput: '',
      amountInput: '',
      typeInput: 'Income',
    }))
  }

  onDeleteTransaction = id => {
    const {historyList} = this.state
    
    const newList = historyList.filter(eachItem => {
      if (eachItem.id === id) {
        return false
      }
      return true
    })
    this.updateTransactionToDb(newList)
    this.setState({historyList: newList})
  }

  render() {
    const {titleInput, typeInput, amountInput, historyList} = this.state
    let totalIncome = 0
    let totalExpenses = 0
    historyList.map(eachItem => {
      if (eachItem.type === 'Income') {
        totalIncome += parseInt(eachItem.amount)
      } else {
        totalExpenses += parseInt(eachItem.amount)
      }
      return ''
    })

    return (
      <div className="main-container">
        <button className='btn btn-primary logout-button' onClick={this.onLogout}>Logout</button>
        <div className="welcome-container">
          <h1 className="name-heading">HI, Richard</h1>
          <p className="message">
            Welcome back to your{' '}
            <span className="color-blue">Money Manager</span>
          </p>
        </div>
        <MoneyDetails income={totalIncome} expenses={totalExpenses} />
        <div className="lower-section">
          <form className="form-container" onSubmit={this.onAddTransaction}>
            <h1 className="heading">Add transaction</h1>
            <label className="label-item" htmlFor="title">
              TITLE
            </label>
            <input
              className="input"
              placeholder="Title"
              type="text"
              id="title"
              value={titleInput}
              onChange={this.onChangeTitle}
            />
            <label className="label-item" htmlFor="amount">
              AMOUNT
            </label>
            <input
              className="input"
              placeholder="Amount"
              type="text"
              id="amount"
              value={amountInput}
              onChange={this.onChangeAmount}
            />
            <label className="label-item" htmlFor="type">
              TYPE
            </label>
            <select
              className="input"
              onChange={this.onChangeType}
              value={typeInput}
            >
              {transactionTypeOptions.map(eachOption => (
                <option value={eachOption.optionId} key={eachOption.optionId}>
                  {eachOption.displayText}
                </option>
              ))}
            </select>
            <button type="submit" className="add-button">
              Add
            </button>
          </form>
          <div className="history-container">
            <h1 className="heading">History</h1>
            <div className="list-first-row">
              <p className="list-heading">Title</p>
              <p className="list-heading">Amount</p>
              <p className="list-heading">Type</p>
            </div>
            <ul className="list-container">
              {historyList.map(eachItem => (
                <TrasactionItem
                  transactionDetails={eachItem}
                  key={eachItem.id}
                  onDeleteTransaction={this.onDeleteTransaction}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
export default MoneyManager
