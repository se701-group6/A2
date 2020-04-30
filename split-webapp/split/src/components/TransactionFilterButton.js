import React, { Component } from "react";
import FilterListIcon from "@material-ui/icons/FilterList";
import { Grid } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import PropTypes from "prop-types";
import styles from "./TransactionFilterButton.module.css";

/* eslint jsx-a11y/no-onchange: 0 */
class TransactionFilterButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      sortField: "created_time",
      sortOrder: "desc",
      isPaid: "either",
      payer: "",
      payee: ""
    };
  }

  render() {
    const handleOpen = () => {
      this.setState({ open: true });
    };
    const { sortField, sortOrder, isPaid, payer, payee } = this.state;

    const handleSubmit = () => {
      const { changeFilters } = this.props;
      changeFilters(sortField, sortOrder, isPaid, payer, payee);
      this.setState({ open: false });
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
    const handleChangeIsPaid = event => {
      this.setState({ isPaid: event.target.value });
    };
    const handleChangePayer = event => {
      this.setState({ payer: event.target.value });
    };
    const handleChangePayee = event => {
      this.setState({ payee: event.target.value });
    };
    const handleClear = () => {
      this.setState({
        sortField: "created_time",
        sortOrder: "desc",
        isPaid: "either",
        payer: "",
        payee: ""
      });
    };

    const modalStyles = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%) !important"
    };

    return (
      <div>
        <Grid container direction="row" alignItems="center">
          <Grid item>
            <FilterListIcon
              className={styles.FilterTransactions}
              onClick={handleOpen}
            />
          </Grid>
          <Grid item>
            <p className={styles.filterText}>Filter</p>
          </Grid>
        </Grid>
        <Modal
          open={open}
          onClose={handleSubmit}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          styles={modalStyles}
        >
          <div className={styles.modalDialog}>
            <form className={styles.form}>
              <h1>Filter Bills</h1>
              <button
                type="button"
                className={styles.resetButton}
                onClick={handleClear}
              >
                Clear
              </button>
              <label className={styles.label}>
                Sort By:
                <select
                  className={styles.select}
                  id="sortField"
                  value={sortField}
                  onChange={handleChangeSortField}
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
                  value={sortOrder}
                  onChange={handleChangeSortOrder}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </label>
              <label className={styles.label}>
                Paid :
                <select
                  className={styles.select}
                  id="isPaid"
                  value={isPaid}
                  onChange={handleChangeIsPaid}
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
                  value={payer}
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
                  value={payee}
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
