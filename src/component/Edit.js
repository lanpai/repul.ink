import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import axios from 'axios';

import Social from './Social';

function Edit() {
    const [ loaded, setLoaded ] = useState(false);
    const [ username, setUsername ] = useState();
    const [ name, setName ] = useState();
    const [ blurb, setBlurb ] = useState();
    const [ key, setKey ] = useState();

    const handleNameChange = (e) => { setName(e.target.value); };
    const handleBlurbChange = (e) => { setBlurb(e.target.value); };

    useEffect(() => {
        fetch(`/api/id/me`)
        .then(res => res.json())
        .then(
            (res) => {
                if (res.code)
                    window.location.href = '/';

                setLoaded(true);
                setUsername(res.username);
                setName(res.name);
                setBlurb(res.blurb);
                setKey(res.key_decrypt);
            },
            (err) => {
                window.location.href = '/';
            }
        );
    }, []);

    const handleApply = () => {
        axios.post('/api/edit', { name, blurb })
        .then(res => {
            switch (res.data.code) {
                case 0:
                    alert('Successfully updated profile.');
                    break;
                default:
                    alert(res.data.message);
                    break;
            }
        });
    }

    return (
        <div style={{ opacity: loaded ? 1 : 0 }} className='box'>
            <div>
                <input
                    style={{
                        color: 'var(--highlight)',
                        fontWeight: 700, fontSize: 32,
                        marginTop: 0
                    }}
                    type='text' placeholder='Display Name'
                    value={ name } onChange={ handleNameChange } />
                <input
                    style={{
                        color: 'var(--foreground)',
                        fontSize: 16,
                        marginTop: 0
                    }}
                    type='text' placeholder='Blurb'
                    value={ blurb } onChange={ handleBlurbChange } />
                <div>
                    <div style={{ display: 'inline-block' }}>
                        <Social text='Connect Twitter' color='#1DA1F2' type='twitter' />
                        <Social text='Connect GitHub' color='#0366d6' type='github' />
                        <Social text='Connect Facebook' color='#4267B2' type='facebook' />
                    </div>
                </div>
                <button onClick={ handleApply }>Apply</button>
                <Link to='/id/me'>
                    <small className='soft'>View your profile</small>
                </Link>
            </div>
        </div>
    );
}

export default Edit;
