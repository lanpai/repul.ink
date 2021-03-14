import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCode } from 'react-qrcode-logo';

import axios from 'axios';
import forge from 'node-forge';

import { decrypt } from '../crypto';
import Social from './Social';

function ID({ user }) {
    const me = useParams().username == 'me';
    var defaultUsername = useParams().username;
    if (user) defaultUsername = user;
    const [ username, setUsername ] = useState(defaultUsername);
    const [ name, setName ] = useState();
    const [ blurb, setBlurb ] = useState();
    const [ key, setKey ] = useState();

    const [ payload, setPayload ] = useState();
    const [ password, setPassword ] = useState();
    const [ file, setFile ] = useState();

    const [ fileMode, setFileMode ] = useState(false);

    const handlePayloadChange = (e) => { setPayload(e.target.value); };
    const handlePasswordChange = (e) => { setPassword(e.target.value); };
    const handleFileChange = (e) => { setFile(e.target.files[0]); };

    const handleSign = () => {
        if (!fileMode && !payload) return alert('Payload is missing!');
        if (fileMode && !file) return alert('File is missing!');
        if (!password) return alert('Password is missing!');

        axios.post('/api/prepareSign')
        .then(res => {
            switch (res.data.code) {
                case 0:
                    try {
                        const key_encryption = forge.pki.privateKeyFromPem(decrypt(
                            password, res.data.key_encryption));
                        const md = forge.md.sha1.create();

                        let body;

                        if (fileMode) {
                            const fileReader = new FileReader();
                            fileReader.onloadend = (e) => {
                                const content = fileReader.result;

                                md.update(content, 'binary');
                                body = md.digest().toHex();
                                const signature = key_encryption.sign(md);

                                axios.post('/api/sign', { hash: body, signature })
                                .then(res => {
                                    if (res.data.code)
                                        return alert('Unknown error');

                                    const uuid = res.data.uuid;
                                    window.location.href =
                                        `${window.location.origin}/sig/${uuid}`

                                })
                                .catch(err => {
                                    alert('Unknown error!');
                                });
                            };
                            fileReader.readAsBinaryString(file);
                        }
                        else {
                            body = payload;

                            md.update(payload, 'utf8');
                            const signature = key_encryption.sign(md);

                            axios.post('/api/sign', { payload: body, signature })
                            .then(res => {
                                if (res.data.code)
                                    return alert('Unknown error');

                                const uuid = res.data.uuid;
                                window.location.href =
                                    `${window.location.origin}/sig/${uuid}`
                            })
                            .catch(err => {
                                alert('Unknown error!');
                            });
                        }
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

    const toggleMode = () => {
        setFileMode(!fileMode);
    };

    useEffect(() => {
        fetch(`/api/id/${username}`)
        .then(res => res.json())
        .then(
            (res) => {
                if (res.code)
                    window.location.href = '/';

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

    //<i className='soft' style={{ wordBreak: 'break-all' }}>{ key }</i>

    return (
        <>
            <div style={{ opacity: name ? 1 : 0 }} className='box'>
                <div className='qr'>
                    <QRCode
                        size={ 225 }
                        value={ `${window.location.origin}/id/${username}` }
                        qrStyle='dots' bgColor='#1c1f28' fgColor='#f8faf9'
                        logoImage='/logo.png' logoWidth='75' logoOpacity='0.8' />
                        </div>
                <div>
                    <h1>{ name }</h1>
                    <p>{ blurb }</p>
                    <div>
                        <div style={{ display: 'inline-block' }}>
                            <Social
                                text='Jihoon Yang (@lanpai)'
                                color='#1DA1F2' type='twitter' />
                            <Social
                                text='Jihoon Yang (@lanpai)'
                                color='#0366d6' type='github' />
                            <Social
                                text='Jihoon Yang'
                                color='#4267B2' type='facebook' />
                        </div>
                    </div>
                    { me &&
                        <Link to='/edit'>
                            <small className='soft'>Edit your profile</small>
                        </Link>
                    }
                </div>
            </div>
            <div style={{
                display: me ? 'flex' : 'none',
                opacity: name ? 1 : 0,
                backgroundColor: 'transparent'
            }} className='box'>
                <div>
                    <Link onClick={ toggleMode }>
                        <small className='soft'>
                            { fileMode ? 
                                'Want to sign text?' :
                                'Want to sign a file?' }
                        </small>
                    </Link>
                    { fileMode
                        ? <div style={{ marginTop: 5 }}>
                            <label style={{ marginRight: 4 }} for='file'>
                                Browse
                            </label>
                            <small style={{ color: 'var(--midground)' }}>
                                { file?.name || 'No file selected' }
                            </small>
                            <input
                                id='file'
                                style={{ display: 'none' }}
                                type='file' onChange={ handleFileChange } />
                        </div>
                        : <input
                            style={{ marginTop: 5 }}
                            type='text' placeholder='Message'
                            value={ payload } onChange={ handlePayloadChange } />
                    }
                    <input
                        type='password' placeholder='Password'
                        value={ password } onChange={ handlePasswordChange } />
                    <button onClick={ handleSign }>
                        Sign <i className='fas fa-pen-alt'></i>
                    </button>
                </div>
            </div>
        </>
    );
}

export default ID;
