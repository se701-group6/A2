import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import styles from "./ErrorBubble.module.css";

export const ErrorBubble = ({
  className,
  show,
  message,
  arrowLeft,
  arrowTop,
  center
}) => {
  const [shownMessage, setShownMessage] = useState(message);

  useEffect(() => {
    // Don't update shown message if it is empty.
    // This is to keep messages shown when the bubble
    // is fading out.
    if (message) {
      setShownMessage(message);
    }
  }, [message]);

  return (
    <span
      className={[
        show && message ? styles.show : styles.hidden,
        center ? styles.center : "",
        className
      ].join(" ")}
    >
      {arrowLeft && <span className={styles.arrowLeft} />}
      {arrowTop && <span className={styles.arrowTop} />}
      {shownMessage}
    </span>
  );
};

ErrorBubble.propTypes = {
  className: PropTypes.string,
  show: PropTypes.bool.isRequired,
  message: PropTypes.string,
  arrowLeft: PropTypes.bool,
  arrowTop: PropTypes.bool,
  center: PropTypes.bool
};

ErrorBubble.defaultProps = {
  className: "",
  message: "",
  arrowLeft: false,
  arrowTop: false,
  center: false
};

export const ErrorBubbleAnchor = ({ children, className }) => (
  <span className={[styles.container, className].join(" ")}>{children}</span>
);

ErrorBubbleAnchor.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

ErrorBubbleAnchor.defaultProps = {
  className: ""
};
