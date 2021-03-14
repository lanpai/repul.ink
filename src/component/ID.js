import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCode } from 'react-qrcode-logo';
//import forge from 'node-forge';

import Social from './Social';

function ID() {
    const me = useParams().username == 'me';
    const [ username, setUsername ] = useState(useParams().username);
    const [ name, setName ] = useState();
    const [ blurb, setBlurb ] = useState();
    const [ key, setKey ] = useState();

    const [ code, setCode ] = useState();

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
                        value={ `${window.location.origin}/id/${username}` }
                        qrStyle='dots' bgColor='#1c1f28' fgColor='#f8faf9'
                        logoImage='/logo.png' logoWidth='40' logoOpacity='0.8' />
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
                opacity: name ? 1 : 0
            }} className='box'>
                <div className='qr'>
                </div>
            </div>
        </>
    );
}

export default ID;
