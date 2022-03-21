import { FaAngleLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const history = useNavigate()
  return (
    <div className="flex items-center cursor-pointer" onClick={() => history('/')}>
      <FaAngleLeft className="text-blue-400" />
      <p className="text-black">Back</p>
    </div>
  );
}