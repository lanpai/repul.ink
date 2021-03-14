import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from 'react-router-dom';

import ID from './component/ID';
import Signature from './component/Signature';
import Register from './component/Register';
import Login from './component/Login';
import Edit from './component/Edit';

function App() {
    return (
        <Router>
            <div className='header'>
                <Link to='/'>
                    <h1 className='outline' style={{ fontWeight: 700 }}>
                        <img src='/logo192.png' />
                        repul.ink
                    </h1>
                </Link>
                <Link to='/id/me'>
                    <h1 style={{ color: 'var(--foreground)' }}>
                        <i className='fas fa-address-card'></i>
                    </h1>
                </Link>
            </div>
            <div className='center'>
                <Switch>
                    <Route path='/register'>
                        <Register />
                    </Route>
                    <Route path='/login'>
                        <Login />
                    </Route>
                    <Route path='/id/:username'>
                        <ID />
                    </Route>
                    <Route path='/sig/:uuid'>
                        <Signature />
                    </Route>
                    <Route path='/edit'>
                        <Edit />
                    </Route>
                    <Route path='/' exact>
                        <div style={{ zIndex: -1, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
                            <div className='blob'>
                                <svg fill='var(--highlight)' viewBox='0 0 310 350'>
                                    <path d='M156.4,339.5c31.8-2.5,59.4-26.8,80.2-48.5c28.3-29.5,40.5-47,56.1-85.1c14-34.3,20.7-75.6,2.3-111  c-18.1-34.8-55.7-58-90.4-72.3c-11.7-4.8-24.1-8.8-36.8-11.5l-0.9-0.9l-0.6,0.6c-27.7-5.8-56.6-6-82.4,3c-38.8,13.6-64,48.8-66.8,90.3c-3,43.9,17.8,88.3,33.7,128.8c5.3,13.5,10.4,27.1,14.9,40.9C77.5,309.9,111,343,156.4,339.5z' />
                                </svg>
                            </div>
                        </div>
                        <div className='center home'>
                            <div>
                            </div>
                            <div className='box' style={{ backgroundColor: 'transparent' }}><div>
                                <Link to='/login'>
                                    <button style={{ marginBottom: 10 }}>Login</button>
                                </Link>
                                <br />
                                <Link to='/register'>
                                    <button>Register</button>
                                </Link>
                                <br /><br />
                                <p style={{ paddingLeft: 10, borderLeftStyle: 'solid', marginLeft: 10, borderWidth: 1 }}>
                                    As misinformation increases in popular media and machine learning pushes the limits of imitating human faces and voices, it's necessary to return normalcy to our trust of online sources.
                                </p>
                                <h2>Identity <i>v.</i> Anonymity <i className='fas fa-theater-masks'></i></h2>
                                <br />
                                <p style={{ paddingLeft: 10, borderLeftStyle: 'solid', marginLeft: 10, borderWidth: 1 }}>
                                    Your private keys will only ever be available to you, they are encrypted locally in the browser before they are stored in secure Google Cloud databases.
                                </p>
                                <h2>Local Encryption <i className='fas fa-key'></i></h2>
                                <br />
                                <p style={{ paddingLeft: 10, borderLeftStyle: 'solid', marginLeft: 10, borderWidth: 1 }}>
                                    Safe and easy to use cryptography should be a right of all users on the internet. As the online world expands into our lives, no person should ever feel unsafe in its growth.
                                </p>
                                <h2>Ease of Use <i className='fas fa-seedling'></i></h2>
                            </div></div>
                        </div>
                    </Route>
                    <Route>
                        <div>
                            <h1>Page not found</h1>
                            <p>Seems you've taken a wrong turn!</p>
                        </div>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
