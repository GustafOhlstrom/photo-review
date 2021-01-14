import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AuthContextProvider from './contexts/AuthContext'
import Navbar from './components/navbar/Navbar';
import Home from './pages/home/Home';
import Galleries from './pages/galleries/Galleries';
import Gallery from './pages/gallery/Gallery';
import SignUp from './pages/sign-up/SignUp';
import SignIn from './pages/sign-in/SignIn';
import Review from './pages/review/Review';
import NotFound from './pages/not-found/NotFound';
import AuthRoute from './components/AuthRoute';

function App() {
	return (
		<AuthContextProvider>
			<Navbar />
			<Routes>
				<Route path='/'>
					<Home />
				</Route>

				<AuthRoute path="/galleries">
					<Route path='/'>
						<Galleries />
					</Route>

					<Route path='/:id'>
						<Gallery />
					</Route>
				</AuthRoute>
				
				<Route path='/signup'>
					<SignUp />
				</Route>

				<Route path='/signin'>
					<SignIn />
				</Route>

				<Route path='/review/:id/:version'>
					<Review />
				</Route>

				<Route path="*" element={<NotFound />} />
			</Routes>
		</AuthContextProvider>
	);
}

export default App;
