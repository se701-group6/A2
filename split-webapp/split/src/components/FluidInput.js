import React, { useState } from "react";
import PropTypes from "prop-types";

import styles from "./FluidInput.module.css";

/**
 * Intended to be used as the internal input component
 * for material-ui text-fields when you want to
 * make the text-field automatically adjust its
 * width based on its contents, rather than having
 * a fixed width.
 *
 * Example usage:
 *
 * ```js
 * <TextField
 *   className={styles.myTextField}
 *   InputProps={{
 *     inputComponent: FluidInput
 *   }}
 * />
 * ```
 *
 * ```css
 * .myTextField {
 *   width: auto;
 * }
 * ```
 */
const FluidInput = ({ inputRef, className, placeholder, ...other }) => {
  const [value, setValue] = useState("");

  // This component uses props spreading so material-ui's
  // TextField component can pass whatever attribute it needs
  // to the raw input element.
  /* eslint-disable react/jsx-props-no-spreading */

  return (
    <>
      <input
        ref={ref => {
          // Let material-ui know which element is the real input element.
          inputRef(ref);

          if (ref) {
            // Initialise any initial value to our fake input span.
            setValue(ref.value);
          }
        }}
        onInput={event => {
          // Sync the real input with the fake input span.
          setValue(event.target.value);
        }}
        style={{
          position: "absolute"
        }}
        className={className}
        placeholder={placeholder}
        {...other}
      />
      {
        // The following outer span wrapper is to emulate the same
        // style as the input element so that the size calculation
        // is accurate.
      }
      <span className={[className, styles.hidden].join(" ")}>
        {value.toString().length ? value : placeholder}
      </span>
    </>
  );

  /* eslint-enable react/jsx-props-no-spreading */
};

FluidInput.propTypes = {
  inputRef: PropTypes.func.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string
};

FluidInput.defaultProps = {
  className: "",
  placeholder: ""
};

export default FluidInput;
