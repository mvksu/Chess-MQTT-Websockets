import { Link } from 'react-router-dom';


export default function Navbar({token, setToken}) { 

 return (
    <nav className="w-full border h-20 flex justify-between items-center px-2 bg-gray-100">
        <div className="text-gray-500">
          <Link to={`lobby`} className="p-6 text-2xl group hover:text-blue-400">
            Maxchess<span className="text-gray-700 group-hover:text-blue-400">.org</span>
          </Link>
          <Link to={`lobby`} className="p-6 text-sm">
            PLAY
          </Link>
          <Link to={`community`} className="p-6 text-sm">
            COMMUNITY
          </Link>
          <Link to={`profile/details/${token}`} className="p-6 text-sm">
            MY PROFILE
          </Link>
        </div>
        <button onClick={() => setToken(null)}>Logout</button>
      </nav>
 ) 
}
