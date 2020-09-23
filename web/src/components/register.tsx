import React, { useState } from 'react';
import { Alert } from './';

export const Register = () => {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [gasprice, setGasprice] = useState("");

    const registerEmail = async () => {

        var emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            setMessage("");
            setError("Email not valid");
        }
        else if (isNaN(parseInt(gasprice)) || parseInt(gasprice) <= 0) {
            setMessage("");
            setError("No valid gasprice. Please use a number >0")
        }
        else {
            setError("");

            const body = {
                email: email.trim(),
                gasprice: gasprice.trim()
            };

            try { 
                const response = await fetch('/.netlify/functions/register', {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {'Content-Type': 'application/json'}
                });

                const result = await response.json();
                if (result) { 
                    setMessage("Registration received. Please confirm your email address (check your spam folder).");
                }
            } catch { 
                setMessage("");
                setError("Error registering email. Check your input and try again.");
            }
        }
    }

    let renderAlertMessage = <></>
    if (error) { 
        renderAlertMessage = <Alert type="danger" message={error} />
    }
    if (message) { 
        renderAlertMessage = <Alert type="success" message={message} />
    }

    return (
        <>
        <div className="p-3 mx-auto text-center">
            <p className="lead">
                ETH Gas.watch is an aggregated gas price feed that checks multiple data sources for the latest gas prices. By aggregating these data sources, it provides a more reliable average gas price.
            </p>
            <p>Sign-up to receive a notification when the price drops.</p>
            
            {renderAlertMessage}

            <div className="col-12">
                <div className="input-group input-group-sm w-50 mx-auto m-2">
                    <input type="text" className="form-control input-sm" placeholder="Email" aria-label="Email" 
                        value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                <div className="input-group input-group-sm w-50 mx-auto">
                    <input type="text" className="form-control" placeholder="Gas price in gwei (e.g. 50)" aria-label="Gasprice" 
                        value={gasprice} onChange={e => setGasprice(e.target.value)} />
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="button" id="button-register" onClick={() => registerEmail()}>watch</button>
                        </div>
                </div>
            </div>
        </div>
        </>
    );
}