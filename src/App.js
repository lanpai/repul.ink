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
                    <h1>
                        <img src='/logo192.png' />
                        repul.ink
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
                        <h1>Under Construction</h1>
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
