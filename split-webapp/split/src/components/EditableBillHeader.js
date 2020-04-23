import React from "react";
import PropTypes from "prop-types";

import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";

import CurrencyTextField from "@unicef/material-ui-currency-textfield";

import FluidInput from "./FluidInput";

import styles from "./EditableBillHeader.module.css";

const EditableBillHeader = ({ title, cost, onTitleChange, onCostChange }) => (
  <div className={styles.header}>
    <label className={styles.titleLabel} htmlFor="title">
      <TextField
        required
        id="title"
        className={styles.titleTextField}
        placeholder="Untitled Bill"
        InputProps={{
          inputComponent: FluidInput
        }}
        value={title}
        onChange={onTitleChange}
      />
      <EditIcon className={styles.titleEditIcon} />
    </label>

    <label className={styles.totalLabel} htmlFor="cost">
      <span>Total $</span>
      <CurrencyTextField
        required
        id="cost"
        minimum={0.01}
        value={cost}
        placeholder="0.00"
        onChange={onCostChange}
        currencySymbol=""
        InputProps={{
          inputComponent: FluidInput,

          // We're putting the '$' outside, not inside the textfield.
          startAdornment: undefined
        }}
        className={styles.totalTextField}
      />
      <EditIcon className={styles.totalEditIcon} />
    </label>
  </div>
);

EditableBillHeader.propTypes = {
  title: PropTypes.string.isRequired,
  cost: PropTypes.number.isRequired,
  onTitleChange: PropTypes.func.isRequired,
  onCostChange: PropTypes.func.isRequired
};

export default EditableBillHeader;
