import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Room} from "./app/gaas-lobby/room/Room";
import {Lobby} from "./app/gaas-lobby/lobby/Lobby";
import DixitComponent from "./app/dixit/views/DixitComponent";

function App() {
    return (
        <Router>
            <div className='App'>
                <Switch>
                    <Route path='/' component={Lobby} exact={true}/>
                    <Route path='/rooms/:roomId' component={Room}/>
                    <Route path='/dixit/:gameId' component={DixitComponent}/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
