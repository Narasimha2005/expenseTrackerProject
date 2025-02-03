import './index.css'

const TransactionItem = props => {
  const {transactionDetails, onDeleteTransaction} = props
  const {id, title, amount, type} = transactionDetails
  const onDelete = () => {
    onDeleteTransaction(id)
  }
  return (
    <li className="list-item">
      <p className="list-element">{title}</p>
      <p className="list-element">Rs {amount}</p>
      <p className="list-element">{type}</p>
      <button
        className="delete-button"
        onClick={onDelete}
        type="button"
        data-testid="delete"
      >
        <img
          src="https://assets.ccbp.in/frontend/react-js/money-manager/delete.png"
          alt="delete"
          className="delete-icon"
        />
      </button>
    </li>
  )
}
export default TransactionItem
