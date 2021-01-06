import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar/Navbar';
import Galleries from './pages/galleries/Galleries';
import Gallery from './pages/gallery/Gallery';
import SignUp from './pages/sign-up/SignUp';
import SignIn from './pages/sign-in/SignIn';
import Review from './pages/review/Review';
import NotFound from './pages/not-found/NotFound';

function App() {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path='/'>
					<Galleries />
				</Route>

				<Route path='/gallery/:Id'>
					<Gallery />
				</Route>

				<Route path='/signup'>
					<SignUp />
				</Route>

				<Route path='/signin'>
					<SignIn />
				</Route>

				<Route path='/review/:id'>
					<Review />
				</Route>

				<Route path="*" element={<NotFound />} />
			</Routes>
		</Router>
	);
}

export default App;
