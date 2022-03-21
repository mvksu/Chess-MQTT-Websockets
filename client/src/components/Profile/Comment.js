import img from "../assets/pobrane.png";
import { useState } from "react";

export default function Comment({
  comment,
  token,
  handleDeleteComment,
  handleEdit,
}) {
  const [showEdit, setShowEdit] = useState(false);
  const [inputValue, setInputValue] = useState(comment.text);

  const handleEditComment = () => {
    handleEdit(comment._id, inputValue);
    setShowEdit(false);
  };

  return (
    <div className="px-8 py-4 relative bordet-t border-b" key={comment._id}>
      <div className="flex my-4 items-center">
        <div className="w-8 h-8 rounded-full overflow-hidden border mx-2">
          <img src={img} alt="" />
        </div>
        <div>
          <h1 className="font-bold">
            {comment.author ? comment.author.username : "Deleted account"}
          </h1>
          <h1 className="text-gray-400 text-sm">
            {comment.date.substring(0, 10)} {comment.date.substring(12, 16)}
          </h1>
        </div>
      </div>
      <div>
        {!showEdit ? (
          <p className="italic text-gray-400 text-md ml-12">{comment.text}</p>
        ) : (
          <>
            <textarea
              className="border border-blue-400 w-full"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              className="border bg-blue-400 px-4 py-2 text-white rounded-full"
              onClick={handleEditComment}
            >
              Edit
            </button>
          </>
        )}
      </div>
      {((comment.author && comment.author.username === token) ||
        token === "admin") && (
        <div className="absolute right-8 top-10 cursor-pointer">
          <button
            className="border px-4 py-2"
            onClick={() => handleDeleteComment(comment._id)}
          >
            Delete
          </button>
          <button
            className="border px-4 py-2 mx-2"
            onClick={() => setShowEdit(!showEdit)}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
