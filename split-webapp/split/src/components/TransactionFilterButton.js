import React, { Component } from "react";
import SearchIcon from "@material-ui/icons/Search";
import Modal from "@material-ui/core/Modal";
import PropTypes from "prop-types";
import styles from "./TransactionFilterButton.module.css";

class TransactionFilterButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      sortField: "created_time",
      sortOrder: "asc",
      complete: "either",
      payer: "",
      payee: ""
    };
  }

  render() {
    const handleOpen = () => {
      this.setState({ open: true });
    };

    const handleSubmit = () => {
      const { sortField, sortOrder, complete, payer, payee } = this.state;
      const { changeFilters } = this.props;
      changeFilters(sortField, sortOrder, complete, payer, payee);
      this.handleClose();
    };

    const handleClose = () => {
      this.setState({ open: false });
    };

    const { open } = this.state;

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

    const modalStyles = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%) !important"
    };

    return (
      <div>
        <SearchIcon
          className={styles.SearchTransactions}
          onClick={handleOpen}
        />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          styles={modalStyles}
        >
          <div className={styles.modalDialog}>
            <form className={styles.form}>
              <h1>Filter Bills</h1>
              <label className={styles.label}>
                Sort By:
                <select
                  className={styles.select}
                  id="sortField"
                  onBlur={handleChangeSortField}
                >
                  <option value="name">Bill Name</option>
                  <option value="amount">Total Amount</option>
                  <option selected value="created_time">
                    Create Time
                  </option>
                </select>
              </label>
              <label className={styles.label}>
                Sort Order:
                <select
                  className={styles.select}
                  id="sortOrder"
                  onBlur={handleChangeSortOrder}
                >
                  <option selected value="asc">
                    Ascending
                  </option>
                  <option value="desc">Descending</option>
                </select>
              </label>
              <label className={styles.label}>
                Paid :
                <select
                  className={styles.select}
                  id="complete"
                  onBlur={handleChangeComplete}
                >
                  <option selected value="either">
                    Either
                  </option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </label>
              <label className={styles.label}>
                Payer:
                <input
                  className={styles.input}
                  type="text"
                  name="Payer"
                  placeholder="Any if blank"
                  onChange={handleChangePayer}
                />
              </label>
              <label className={styles.label}>
                Payee:
                <input
                  className={styles.input}
                  type="text"
                  name="Payee"
                  placeholder="Any if blank"
                  onChange={handleChangePayee}
                />
              </label>

              <button
                type="submit"
                className={styles.submitButton}
                onClick={handleSubmit}
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={handleClose}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </form>
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
