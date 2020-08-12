
import React from 'react';

interface ErrorProps { 
  message: string
}

export const ErrorAlert = (props: ErrorProps) => {
  return (
    <div className="alert alert-danger" role="alert">
      {props.message}
    </div>
  );
}