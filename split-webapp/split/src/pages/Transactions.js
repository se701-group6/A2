import React, {Component} from "react";
import TransactionList from "../components/TransactionList";
import SearchIcon from '@material-ui/icons/Search';
import '../App.css';

class Transactions extends Component {
    render() {
        return (
            <div className="Transactions">
            <div className="TransactionsTitle">
                <h1 className="TransactionsText">Transactions </h1>
                <SearchIcon className="SearchTransactions" />
                </div>
                <TransactionList />
            </div>
        );
    }
}

export default Transactions;