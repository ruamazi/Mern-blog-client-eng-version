import axios from "axios";
import { MdFavoriteBorder, MdOutlineFavorite } from "react-icons/md";
import { apiUrl } from "../../pages/blog/Register";
import { useState } from "react";

const AddToFav = ({ isFavorite, setIsFavorite, blogId }) => {
 const [error, setError] = useState("");
 const handleAddToFav = async () => {
  setError("");
  try {
   await axios.get(`${apiUrl}/api/blogs/add-to-fav/${blogId}`, {
    withCredentials: true,
   });
   setIsFavorite(!isFavorite);
  } catch (error) {
   setError(error.response.data.error || "فشل في إضافة المقال إلى المفضلة");
  }
 };

 if (error) return <p className="text-pink-600 text-sm">{error}</p>;

 return (
  <button onClick={handleAddToFav} className="transition-opacity duration-300">
   <span className="relative block w-6 h-6">
    <span
     className={`absolute inset-0 transition-opacity duration-300 ${
      isFavorite ? "opacity-100" : "opacity-0"
     }`}
    >
     <MdOutlineFavorite className="text-pink-600" size={24} />
    </span>
    <span
     className={`absolute inset-0 transition-opacity duration-300 ${
      isFavorite ? "opacity-0" : "opacity-100"
     }`}
    >
     <MdFavoriteBorder className="text-pink-600" size={24} />
    </span>
   </span>
   <span className="sr-only">Add to favorites</span>
  </button>
 );
};

export default AddToFav;
