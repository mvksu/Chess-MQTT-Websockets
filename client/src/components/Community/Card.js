import img from "../assets/pobrane.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Card({ user, index }) {
  const variants = {
    visible: (i) => ({
      opacity: 1,
      transition: {
        delay: i * 0.15,
      },
    }),
    hidden: { opacity: 0 },
  };

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      <Link to={`/profile/details/${user.username}`}>
        <div className="border py-6 px-4 mr-8 grid grid-cols-4 items-center my-4 hover:ring-2">
          <div className="h-24 w-24">
            <img src={img} alt="" />
          </div>
          <h1>{user.username}</h1>
          <h3>{user.role}</h3>
          <h3>{user.rank}</h3>
        </div>
      </Link>
    </motion.div>
  );
}
