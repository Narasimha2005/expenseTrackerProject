
import './index.css'

const MyComponent = props => {
  const {color, imageUrl, title, amount, altName} = props
  return (
    <div className={`card ${color}`}>
      <img src={imageUrl} className="image" alt={altName} />
      <div className="text-container">
        <p className="card-title">Your {title}</p>
        <p className="card-amount" data-testid={`${altName}Amount`}>
          Rs {amount}
        </p>
      </div>
    </div>
  )
}
const MoneyDetails = props => {
  const {income, expenses} = props
  const balance = parseInt(income) - parseInt(expenses)
  return (
    <div className="cards-container">
      <MyComponent
        key="Balance"
        color="green"
        imageUrl="https://assets.ccbp.in/frontend/react-js/money-manager/balance-image.png"
        title="Balance"
        amount={balance}
        altName="balance"
      />
      <MyComponent
        key="Income"
        color="blue"
        imageUrl="https://assets.ccbp.in/frontend/react-js/money-manager/income-image.png"
        title="Income"
        amount={income}
        altName="income"
      />
      <MyComponent
        key="Expenses"
        color="purple"
        imageUrl="https://assets.ccbp.in/frontend/react-js/money-manager/expenses-image.png"
        title="Expenses"
        amount={expenses}
        altName="expenses"
      />
    </div>
  )
}
export default MoneyDetails
