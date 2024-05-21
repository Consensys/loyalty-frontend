import React, { useEffect, useRef, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const SmallButton = ({ isProcessing, text }) => {
  const ref = useRef();
  const [width, setWidth] = useState(null);

  useEffect(() => {
    setWidth(ref.current.getBoundingClientRect().width);
  }, []);  
  return (
    <button
      ref={ref} 
      style={{ width }}
      className="small-btn"
      variant="contained"
      color="primary"
      type="submit"
    >
      {isProcessing ? <CircularProgress size={12} /> : text}
    </button>
  );
};

export default SmallButton;