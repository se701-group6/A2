import React, { Component } from "react";
import SearchIcon from "@material-ui/icons/Search";
import Modal from "@material-ui/core/Modal";
import PropTypes from "prop-types";
import "../App.css";

class TransactionFilterButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      sortField: "created_time",
      sortOrder: "desc",
      complete: "all",
      payer: "",
      payee: ""
    };
  }

  render() {
    const innerPopup = {
      position: "fixed",
      left: "25%",
      right: "25%",
      top: "25%",
      bottom: "25%",
      margin: "auto",
      border: "10px solid green",
      "border-color": "black",
      "border-radius": "20px",
      background: "#fff",
      "background-color": "#fff"
    };

    const handleOpen = () => {
      this.setState({ open: true });
    };

    const handleClose = () => {
      const { sortField, sortOrder, complete, payer, payee } = this.state;
      const { changeFilters } = this.props;
      changeFilters(sortField, sortOrder, complete, payer, payee);
      this.setState({ open: false });
    };
    const { open, sortField, sortOrder, Complete, payer, payee } = this.state;

    const handleChangeSortField = event => {
      this.setState({ sortField: event.target.value });
    };
    const handleChangeSortOrder = event => {
      this.setState({ sortOrder: event.target.value });
    };
    const handleChangeComplete = event => {
      this.setState({ complete: event.target.value });
    };
    const handleChangePayer = event => {
      this.setState({ payer: event.target.value });
    };
    const handleChangePayee = event => {
      this.setState({ payee: event.target.value });
    };

    return (
      <div>
        <SearchIcon class="SearchTransactions" onClick={handleOpen} />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={innerPopup}>
            <header className="App-header">
              <p>This is page for create post.</p>
            </header>
            <form>
              <select value={sortField} onBlur={handleChangeSortField}>
                <option value="name">Bill Name</option>
                <option value="amount">Total Amount</option>
                <option selected value="created_time">
                  Create Time
                </option>
              </select>
              <select value={sortOrder} onBlur={handleChangeSortOrder}>
                <option value="asc">Ascending</option>
                <option selected value="desc">
                  Descending
                </option>
              </select>
              <select value={Complete} onBlur={handleChangeComplete}>
                <option selected value="all">
                  Both
                </option>
                <option value="paid">Paid</option>
                <option value="not_paid">Not Paid</option>
              </select>
              <input
                type="text"
                name="Payer"
                value={payer}
                onChange={handleChangePayer}
              />
              Payee:
              <input
                type="text"
                name="Payee"
                value={payee}
                onChange={handleChangePayee}
              />
            </form>
            <SearchIcon onClick={handleClose}>search</SearchIcon>
          </div>
        </Modal>
      </div>
    );
  }
}

TransactionFilterButton.propTypes = {
  changeFilters: PropTypes.func.isRequired
};

export default TransactionFilterButton;
