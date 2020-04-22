import React from "react";
import PropTypes from "prop-types";

import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";

import CurrencyTextField from "@unicef/material-ui-currency-textfield";

import FluidInput from "./FluidInput";

import styles from "./EditableBillHeader.module.css";

const EditableBillHeader = ({
  title,
  titlePlaceholder,
  cost,
  onTitleChange,
  onCostChange
}) => (
  <div className={styles.header}>
    <label className={styles.titleLabel} htmlFor="title">
      <TextField
        required
        id="title"
        className={styles.titleTextField}
        placeholder={titlePlaceholder}
        InputProps={{
          // Note: We need this InputBase component to be
          // styled with the same font settings as the actual
          // inner <input> element in order to get the
          // alignment settings correct.
          className: styles.titleInputBase,

          inputComponent: FluidInput,

          // We don't want their fancy rippled underline as
          // it is hard to customize.
          disableUnderline: true,

          inputProps: {
            className: styles.titleInput
          }
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
          // Note: We need this InputBase component to be
          // styled with the same font settings as the actual
          // inner <input> element in order to get the
          // alignment settings correct.
          className: styles.totalInputBase,

          inputComponent: FluidInput,

          // We're putting the '$' outside, not inside the textfield.
          startAdornment: undefined,

          // We don't want their fancy rippled underline as
          // it is hard to customize.
          disableUnderline: true,

          inputProps: {
            className: styles.totalInput
          }
        }}
        className={styles.totalTextField}
      />
      <EditIcon className={styles.totalEditIcon} />
    </label>
  </div>
);

EditableBillHeader.propTypes = {
  title: PropTypes.string.isRequired,
  titlePlaceholder: PropTypes.string.isRequired,
  cost: PropTypes.number.isRequired,
  onTitleChange: PropTypes.func.isRequired,
  onCostChange: PropTypes.func.isRequired
};

export default EditableBillHeader;
