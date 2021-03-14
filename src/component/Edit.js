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

    const [ facebookName, setFacebookName ] = useState();
    const [ facebookLink, setFacebookLink ] = useState();
    const [ twitterName, setTwitterName ] = useState();
    const [ twitterLink, setTwitterLink ] = useState();
    const [ githubName, setGithubName ] = useState();
    const [ githubLink, setGithubLink ] = useState();

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
        <div style={{ opacity: loaded ? 1 : 0, display: loaded ? 'flex' : 'none' }} className='box'>
            <div>
                <input
                    style={{
                        color: 'var(--highlight)',
                        fontWeight: 400, fontSize: 32,
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
                        { twitterName
                            ? <Social
                                text={ twitterName }
                                link={ twitterLink }
                                color='#1DA1F2' type='twitter' />
                            : <Social
                                text='Connect Twitter'
                                link='/auth/twitter'
                                color='#1DA1F2' type='twitter' /> }
                        { githubName
                            ? <Social
                                text={ githubName }
                                link={ githubLink }
                                color='#0366D6' type='github' />
                            : <Social
                                text='Connect GitHub'
                                link='/auth/github'
                                color='#0366D6' type='github' /> }
                        { facebookName
                            ? <Social
                                text={ facebookName }
                                link={ facebookLink }
                                color='#4267B2' type='facebook' />
                            : <Social
                                text='Connect Facebook'
                                link='/auth/facebook'
                                color='#4267B2' type='facebook' /> }
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
