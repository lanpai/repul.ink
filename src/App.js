import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';

import ID from './component/ID';

function App() {
    return (
        <Router>
            <div className='header'>
                <Link to='/'>
                    <h1>repul.ink</h1>
                </Link>
                <Link to='/me'>
                    <p>My ID</p>
                </Link>
            </div>
            <div className='center'>
                <Switch>
                    <Route path='/id'>
                        <ID />
                    </Route>
                    <Route path='/'>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
