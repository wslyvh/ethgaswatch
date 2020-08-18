import React, { useState, useEffect } from 'react';
import { ErrorAlert } from './error';

export const Register = () => {
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [gasprice, setGasprice] = useState("30");

    const registerEmail = async () => {
        console.log("Register email", email, gasprice);

        var emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) setError("Email not valid");
        else if (isNaN(parseInt(gasprice))) setError("No valid gasprice. Only use numbers")
        else {
            setError("");

            // save email/price
        }
    }

    let renderErrorMessage = <></>
    if (error) { 
        renderErrorMessage = <ErrorAlert message={error} />
    }

    return (
        <>
        <div>
            <h2>Watch</h2>
            <p>Get notified when gas prices drop below the threshold.</p>
            
            {renderErrorMessage}

            <div className="col-12">
                <div className="input-group input-group-sm w-25 mx-auto m-2">
                    <input type="text" className="form-control input-sm" placeholder="Email" aria-label="Email" 
                        value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                <div className="input-group input-group-sm w-25 mx-auto">
                    <input type="text" className="form-control" placeholder="Gas price" aria-label="Gasprice" 
                        value={gasprice} onChange={e => setGasprice(e.target.value)} />
                        <div className="input-group-append">
                            <button className="btn btn-outline-primary" type="button" id="button-register" onClick={() => registerEmail()}>watch</button>
                        </div>
                </div>
            </div>
        </div>
        </>
    );
}