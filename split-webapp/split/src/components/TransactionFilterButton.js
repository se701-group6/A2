import React, { Component } from "react";
import SearchIcon from "@material-ui/icons/Search";
import Modal from "@material-ui/core/Modal";
import Checkbox from "@material-ui/core/Checkbox";
import "../App.css";

class TransactionFilterButton extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
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
      background: "red",
      "background-color": "red"
    };

    const handleOpen = () => {
      this.setState({ open: true });
    };

    const handleClose = () => {
      this.setState({ open: false });
    };
    const { open } = this.state;
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
              <select>
                <option selected value="name">
                  Bill Name
                </option>
                <option value="amount">Total Amount</option>
                <option value="created_time">Create Time</option>
              </select>
              <select>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
              <Checkbox />
              <input type="text" name="Payer" />
              Payee:
              <input type="text" name="Payee" />
            </form>
            <SearchIcon onClick={handleClose}>search</SearchIcon>
          </div>
        </Modal>
      </div>
    );
  }
}

export default TransactionFilterButton;
