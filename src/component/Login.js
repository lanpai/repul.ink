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

function Login() {
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');

    const handleUsernameChange = (e) => { setUsername(e.target.value); };
    const handlePasswordChange = (e) => { setPassword(e.target.value); };

    const reqLength = password.length >= 14;
    const reqCase = /(?=.*[a-z])(?=.*[A-Z])/.test(password);
    const reqSpecial = /(?=.*[-+_!@#$%^&*., ?])/.test(password);

    const handleLogin = (e) => {
        if (!username) return alert('Username is missing!');
        if (!reqLength) return alert('Password contains at least 14 characters!');
        if (!reqCase) return alert('Password contains both capital and lowercase letters');
        if (!reqSpecial) return alert('Password contains at least 1 symbol');

        axios.post('/api/prepareLogin', { username })
        .then(res => {
            switch (res.data.code) {
                case 0:
                    try {
                        const key_encryption = forge.pki.privateKeyFromPem(decrypt(
                            password, res.data.key_encryption));

                        const md = forge.md.sha1.create();
                        md.update(username, 'utf8');
                        const signature = key_encryption.sign(md);

                        axios.post('/api/login', { username, signature })
                        .then(res => {
                            window.location.href = '/id/me';
                        })
                        .catch(err => {
                            alert('Unknown error!');
                        });
                    }
                    catch (err) {
                        alert('Invalid password!');
                    }
                    break;
                default:
                    alert(res.data.message);
                    break;
            }
        });
    };

    return (
        <div className='box'>
            <div>
                <h2>Login to your repul.ink account</h2>
                <div style={{ padding: 5 }}>
                    <p>{reqLength ? <Yes/> : <No/>} Password contains at least 14 characters</p>
                    <p>{reqCase ? <Yes/> : <No/>} Password contains both capital and lowercase letters</p>
                    <p>{reqSpecial ? <Yes/> : <No/>} Password contains at least 1 symbol</p>
                    <input
                        type='text' placeholder='Username'
                        value={ username } onChange={ handleUsernameChange } />
                    <input
                        type='password' placeholder='Password'
                        value={ password } onChange={ handlePasswordChange } />
                    <button onClick={ handleLogin }>Login</button>
                    <Link to='/register'>
                        <small className='soft'>Don't have an account?</small>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
