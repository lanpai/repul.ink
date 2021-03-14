import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCode } from 'react-qrcode-logo';

import axios from 'axios';
import forge from 'node-forge';

import ID from './ID';

function Signature() {
    console.log(useParams());
    const [ uuid, setUuid ] = useState(useParams().uuid);

    const [ username, setUsername ] = useState();
    const [ signature, setSignature ] = useState();
    const [ hash, setHash ] = useState();
    const [ text, setText ] = useState();

    const [ key, setKey ] = useState();
    const [ name, setName ] = useState();
    const [ blurb, setBlurb ] = useState();

    const [ verified, setVerified ] = useState(false);

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
            console.log(signature);

            setVerified(key_decrypt.verify(
                forge.util.hexToBytes(hash), signature));
        }
    }, [ key ]);

    return (
        <div style={{
            opacity: key ? 1 : 0, display: 'flex', flexDirection: 'column'
        }} className='box'>
            <QRCode
                size={ 225 }
                value={ `${window.location.origin}/sig/${uuid}` }
                qrStyle='dots' bgColor='#1c1f28' fgColor='#f8faf9'
                logoImage='/logo.png' logoWidth='75' logoOpacity='0.8' />
            <br />
            <p>{ text }</p>
            <small className='soft'>{ hash }</small>
            { verified
                ? <h2 style={{ color: 'deepskyblue' }}>
                    Verified <i className='fas fa-check-circle'></i>
                </h2>
                : <h2 style={{ color: 'var(--foreground)' }}>Verifying...</h2> }
            <div style={{ width: '100%' }}>
                <hr />
            </div>
            <Link to={ `/id/${username}` }>
                <h1>{ name }</h1>
            </Link>
            <p>{ blurb }</p>
        </div>
    );
}

export default Signature;
