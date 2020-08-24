import React, { useState } from 'react';
import { Alert } from './';

export const Register = () => {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [gasprice, setGasprice] = useState("30");

    const registerEmail = async () => {

        var emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            setMessage("");
            setError("Email not valid");
        }
        else if (isNaN(parseInt(gasprice))) {
            setMessage("");
            setError("No valid gasprice. Only use numbers")
        }
        else {
            setError("");

            const body = {
                email,
                gasprice
            };

            try { 
                const response = await fetch('/.netlify/functions/register', {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {'Content-Type': 'application/json'}
                });

                const result = await response.json();
                if (result) { 
                    setMessage(result.message);
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
        <div className="mt-5">
            <p>Get notified when gas prices drop below the threshold.</p>
            
            {renderAlertMessage}

            <div className="col-12">
                <div className="input-group input-group-sm w-50 mx-auto m-2">
                    <input type="text" className="form-control input-sm" placeholder="Email" aria-label="Email" 
                        value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                <div className="input-group input-group-sm w-50 mx-auto">
                    <input type="text" className="form-control" placeholder="Gas price" aria-label="Gasprice" 
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