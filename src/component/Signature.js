import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCode } from 'react-qrcode-logo';

import axios from 'axios';
import forge from 'node-forge';

import Social from './Social';
import ID from './ID';

function Signature() {
    const [ uuid, setUuid ] = useState(useParams().uuid);

    const [ username, setUsername ] = useState();
    const [ signature, setSignature ] = useState();
    const [ hash, setHash ] = useState();
    const [ text, setText ] = useState();

    const [ key, setKey ] = useState();
    const [ name, setName ] = useState();
    const [ blurb, setBlurb ] = useState();

    const [ facebookName, setFacebookName ] = useState();
    const [ facebookLink, setFacebookLink ] = useState();
    const [ twitterName, setTwitterName ] = useState();
    const [ twitterLink, setTwitterLink ] = useState();
    const [ githubName, setGithubName ] = useState();
    const [ githubLink, setGithubLink ] = useState();

    const [ verified, setVerified ] = useState('waiting');
    const [ checksum, setChecksum ] = useState('waiting');

    const fileMode = !text;

    const [ file, setFile ] = useState();

    const handleFileChange = (e) => { setFile(e.target.files[0]); };

    useEffect(() => {
        fetch(`/api/sig/${uuid}`)
        .then(res => res.json())
        .then(
            (res) => {
                if (res.code)
                    window.location.href = '/';

                setUsername(res.username);
                setSignature(res.signature);
                setHash(res.hash);
                setText(res.text);
            },
            (err) => {
                window.location.href = '/';
            }
        );
    }, []);

    useEffect(() => {
        if (username) {
            fetch(`/api/id/${username}`)
            .then(res => res.json())
            .then(
                (res) => {
                    if (res.code)
                        window.location.href = '/';

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
        }
    }, [ username ]);

    useEffect(() => {
        if (key) {
            const key_decrypt = forge.pki.publicKeyFromPem(key);

            setVerified(
                key_decrypt.verify(forge.util.hexToBytes(hash), signature) ?
                'verified' : 'invalid'
            );

            if (fileMode && file) {
                const fileReader = new FileReader();
                fileReader.onloadend = (e) => {
                    const content = fileReader.result;

                    const md = forge.md.sha1.create();
                    md.update(content, 'binary');
                    const body = md.digest().toHex();

                    setChecksum(
                        hash == body ?
                        'match' : 'mismatch'
                    );
                };
                fileReader.readAsBinaryString(file);
            }
        }
    }, [ key, file ]);

    return (
        <div style={{
            opacity: key ? 1 : 0, display: key ? 'flex' : 'none', flexDirection: 'column'
        }} className='box'>
            <QRCode
                size={ 225 }
                value={ `${window.location.origin}/sig/${uuid}` }
                qrStyle='dots' bgColor='#1c1f28' fgColor='#f8faf9'
                logoImage='/logo.png' logoWidth='75' logoOpacity='0.8' />
            <br />

            { fileMode
                ? <div style={{ marginBottom: 8 }}>
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
                : <p>{ text }</p>
            }
            { checksum == 'mismatch' && fileMode &&
                <small style={{ color: 'red' }}>
                    Files Mismatch
                </small> }
            { checksum == 'match' && fileMode &&
                <small style={{ color: 'deepskyblue' }}>
                    Files Match
                </small> }
            { checksum == 'waiting' && fileMode &&
                <small style={{ color: 'var(--foreground)' }}>Waiting for file</small> }
            <small className='soft'>{ hash }</small>
            { verified == 'invalid' &&
                <h2 style={{ color: 'red' }}>
                    Invalid <i className='fas fa-times-circle'></i>
                </h2> }
            { verified == 'verified' &&
                <h2 style={{ color: 'deepskyblue' }}>
                    Verified <i className='fas fa-check-circle'></i>
                </h2> }
            { verified == 'waiting' &&
                <h2 style={{ color: 'var(--foreground)' }}>Verifying...</h2> }
            <div style={{ width: '100%' }}>
                <hr />
            </div>
            <Link to={ `/id/${username}` }>
                <h1 style={{ fontWeight: 400 }}>{ name }</h1>
            </Link>
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
        </div>
    );
}

export default Signature;
