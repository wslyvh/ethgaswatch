
import React from 'react';

interface AlertProps { 
  type: "danger" | "warning" | "success" | "info"
  message: string
}

export const Alert = (props: AlertProps) => {
  return (
    <div className={`alert alert-${props.type}`} role="alert">
      {props.message}
    </div>
  );
}