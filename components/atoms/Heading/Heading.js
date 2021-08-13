import React from "react";
import PropTypes from "prop-types";
import styles from "./Heading.module.scss";

const Heading = ({ isBig, children }) => (
    <>
        { isBig ? <h1 className={styles.big}>{children}</h1> : <h2 className={styles.normal}>{children}</h2>}
    </>
);

Heading.propTypes = {
    isBig: PropTypes.bool,
};

Heading.defaultProps = {
    isBig: false,
};

export default Heading;