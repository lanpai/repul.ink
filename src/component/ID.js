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

    const [ facebookName, setFacebookName ] = useState();
    const [ facebookLink, setFacebookLink ] = useState();
    const [ twitterName, setTwitterName ] = useState();
    const [ twitterLink, setTwitterLink ] = useState();
    const [ githubName, setGithubName ] = useState();
    const [ githubLink, setGithubLink ] = useState();

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
                switch (res.code) {
                    case 0:
                        break;
                    case 3:
                        window.location.href = '/login';
                        break;
                    default:
                        window.location.href = '/';
                        break;
                }

                setUsername(res.username);
                setName(res.name);
                setBlurb(res.blurb);
                setKey(res.key_decrypt);

                setFacebookName(res.facebook_name);
                setFacebookLink(res.facebook_link);
                setTwitterName(res.twitter_name);
                setTwitterLink(res.twitter_link);
                setGithubName(res.github_name);
                setGithubLink(res.github_link);
            },
            (err) => {
                window.location.href = '/';
            }
        );
    }, []);

    return (
        <>
            <div style={{ opacity: name ? 1 : 0, display: name ? 'flex' : 'none' }} className='box'>
                <div className='qr'>
                    <QRCode
                        size={ 225 }
                        value={ `${window.location.origin}/id/${username}` }
                        qrStyle='dots' bgColor='#1c1f28' fgColor='#f8faf9'
                        logoImage='/logo.png' logoWidth='75' logoOpacity='0.8' />
                        </div>
                <div>
                    <h1 style={{ fontWeight: 400 }}>{ name }</h1>
                    <i className='soft'>@{ username }</i>
                    <p>{ blurb }</p>
                    <div>
                        <div style={{ display: 'inline-block' }}>
                            { twitterName &&
                                <Social
                                    text={ twitterName }
                                    link={ twitterLink }
                                    color='#1DA1F2' type='twitter' /> }
                            { githubName &&
                                <Social
                                    text={ githubName }
                                    link={ githubLink }
                                    color='#0366D6' type='github' /> }
                            { facebookName &&
                                <Social
                                    text={ facebookName }
                                    link={ facebookLink }
                                    color='#4267B2' type='facebook' /> }
                        </div>
                    </div>
                    { me &&
                        <>
                            <Link to='/edit'>
                                <small className='soft'>Edit your profile</small>
                            </Link>
                            <br />
                            <a href='/logout'>
                                <small className='soft'>Logout</small>
                            </a>
                        </>
                    }
                </div>
            </div>
            <div style={{
                display: me && name ? 'flex' : 'none',
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
                        ? <div style={{ marginTop: 8 }}>
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
