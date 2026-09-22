import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import GroupDetail from './pages/GroupDetail.jsx';
import CreateGroup from './pages/CreateGroup.jsx';
import CreateExpense from './pages/CreateExpense.jsx';
import CreateSettlement from './pages/CreateSettlement.jsx';
import './App.css';

function AppContent() {
  return(
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/group/:id" element={<GroupDetail/>}/>
      <Route path="/group/new" element={<CreateGroup/>}/>
      <Route path="/group/:id/expense/new" element={<CreateExpense/>}/>
      <Route path="/group/:id/settle/new" element={<CreateSettlement/>}/>
    </Routes>
  )
}


function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;