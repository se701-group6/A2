import React from "react";
import PropTypes from "prop-types";

import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";

import { Flipped } from "react-flip-toolkit";
import CurrencyTextField from "@unicef/material-ui-currency-textfield";

import FluidInput from "../../components/FluidInput";
import { ErrorBubble, ErrorBubbleAnchor } from "../../components/ErrorBubble";

import styles from "./Header.module.css";

const Header = ({
  className,
  title,
  titlePlaceholder,
  cost,
  costError,
  showErrors,
  onTitleChange,
  onCostChange,
  onInputBlur
}) => (
  <Flipped flipId="Header-header" translate>
    <div className={[styles.header, className].join(" ")}>
      <label className={styles.titleLabel} htmlFor="title">
        <TextField
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
          onBlur={onInputBlur}
        />
        <EditIcon className={styles.titleEditIcon} />
      </label>

      <label className={styles.totalLabel} htmlFor="cost">
        <span>Total $</span>
        <ErrorBubbleAnchor>
          <CurrencyTextField
            required
            id="cost"
            minimum={0.01}
            value={cost}
            placeholder="0.00"
            onChange={onCostChange}
            onBlur={onInputBlur}
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
          <ErrorBubble center arrowTop show={showErrors} message={costError} />
        </ErrorBubbleAnchor>
        <EditIcon className={styles.totalEditIcon} />
      </label>
    </div>
  </Flipped>
);

Header.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  titlePlaceholder: PropTypes.string.isRequired,
  cost: PropTypes.number.isRequired,
  costError: PropTypes.string,
  showErrors: PropTypes.bool.isRequired,
  onTitleChange: PropTypes.func.isRequired,
  onCostChange: PropTypes.func.isRequired,
  onInputBlur: PropTypes.func.isRequired
};

Header.defaultProps = {
  className: "",
  costError: ""
};

export default Header;
