import { useState } from 'react';
import { Link } from 'react-router-dom';

import forge from 'node-forge';
import axios from 'axios';

import { encrypt, decrypt } from '../crypto';

function Yes() {
    return (
        <i style={{ textAlign: 'center', width: 16 }} className='fas fa-check'></i>
    );
}
function No() {
    return (
        <i style={{ textAlign: 'center', width: 16 }} className='fas fa-times'></i>
    );
}

function Register() {
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');

    const handleUsernameChange = (e) => { setUsername(e.target.value); };
    const handlePasswordChange = (e) => { setPassword(e.target.value); };

    const reqLength = password.length >= 14;
    const reqCase = /(?=.*[a-z])(?=.*[A-Z])/.test(password);
    const reqSpecial = /(?=.*[-+_!@#$%^&*., ?])/.test(password);

    const handleRegister = (e) => {
        if (!username) return alert('Username is required!');
        if (!reqLength) return alert('Must contain at least 14 characters!');
        if (!reqCase) return alert('Must have both capital and lowercase letters');
        if (!reqSpecial) return alert('Must contain at least 1 symbol');

        forge.pki.rsa.generateKeyPair(
            { bits: 2048, workers: 2 },
            (err, keypair) => {
                if (err) console.error(err);

                const key_decrypt = forge.pki.publicKeyToPem(keypair.publicKey);
                const key_encrypt = forge.pki.privateKeyToPem(keypair.privateKey);

                console.log(key_decrypt);
                console.log(key_encrypt);

                axios.post('/api/register', {
                    username,
                    key_decrypt,
                    key_encrypt: encrypt(password, key_encrypt)
                })
                .then(res => {
                    switch (res.data.code) {
                        case 0:
                            window.location.href = '/login';
                            break;
                        default:
                            alert(res.data.message);
                            break;
                    }
                });
            }
        );
    };

    return (
        <div className='box'>
            <div>
                <h2>Create your repul.ink account</h2>
                <div style={{ padding: 5 }}>
                    <p>{reqLength ? <Yes/> : <No/>} Must contain at least 14 characters</p>
                    <p>{reqCase ? <Yes/> : <No/>} Must have both capital and lowercase letters</p>
                    <p>{reqSpecial ? <Yes/> : <No/>} Must contain at least 1 symbol</p>
                    <input
                        type='text' placeholder='Username'
                        value={ username } onChange={ handleUsernameChange } />
                    <input
                        type='password' placeholder='Password'
                        value={ password } onChange={ handlePasswordChange } />
                    <button onClick={ handleRegister }>Register</button>
                    <Link to='/login'>
                        <small className='soft'>Already have an account?</small>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
