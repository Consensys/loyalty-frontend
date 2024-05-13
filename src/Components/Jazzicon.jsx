import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import jazzicon from "@metamask/jazzicon";
import iconFactoryGenerator from "./icon-factory";

const iconFactory = iconFactoryGenerator(jazzicon);

/**
 * Wrapper around the jazzicon library to return a React component, as the library returns an
 * HTMLDivElement which needs to be appended.
 */

function Jazzicon({
  address,
  className,
  diameter = 32,
  style,
  tokenList = {},
}) {
  const container = useRef();

  useEffect(() => {
    const _container = container.current;

    // add icon
    const imageNode = iconFactory.iconForAddress(
      address,
      diameter,
      tokenList[address?.toLowerCase()],
    );

    _container?.appendChild(imageNode);

    // remove icon
    return () => {
      while (_container.firstChild) {
        _container.firstChild.remove();
      }
    };
  }, [address, diameter, tokenList]);

  return <div ref={container} className={className} style={style} />;
}

Jazzicon.propTypes = {
  /**
   * Address used for generating random image
   */
  address: PropTypes.string.isRequired,
};

export default Jazzicon;
