import Login from './components/Login';
import { UserContext } from "./context/UserContext";
import { ItemContext } from "./context/ItemContext";
import { useMemo, useState } from 'react';
import UserList from './components/UserList';
import { Route, Redirect, useLocation } from "wouter";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [user, setUser] = useState(null)
  const value = useMemo(() => ({ user, setUser }), [user, setUser])
  const [item, setItem] = useState(null)
  const itemValue = useMemo(() => ({ item, setItem }), [item, setItem])
  const [location, setLocation] = useLocation();

  return (
    <UserContext.Provider value={value}>
      {user && (
        <ItemContext.Provider value={itemValue}>
            <Route path='/user_list' component={UserList}/>
        </ItemContext.Provider>
      )}
      <Redirect to={'/login'} />
      <Route path='/login' component={Login} />
    </UserContext.Provider>
    
  );
}

export default App;
