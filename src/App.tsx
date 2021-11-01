import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import {Room} from "./app/gaas-lobby/room/Room";
import {Lobby} from "./app/gaas-lobby/lobby/Lobby";

function App() {
    return (
        <Router>
            <div className='App'>
                <Switch>
                    <Route path='/room/:roomId' component={Room}/>
                    <Route path='/' component={Lobby}/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
