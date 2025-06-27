import axios from "axios";
import { apiUrl } from "../pages/blog/Register";

export const fetchBlog = async (id) => {
 try {
  const response = await axios.get(`${apiUrl}/api/blogs/${id}`);
  return response.data;
 } catch (err) {
  throw new Error("Failed to fetch blog");
 }
};

export const deleteBlog = async (blogId) => {
 try {
  await axios.delete(`${apiUrl}/api/blogs/${blogId}`, {
   withCredentials: true,
  });
 } catch (err) {
  throw new Error("Failed to delete blog");
 }
};

export const deleteComment = async (commentId) => {
 try {
  await axios.delete(`${apiUrl}/api/comments/${commentId}`, {
   withCredentials: true,
  });
 } catch (err) {
  throw new Error("Failed to delete comment");
 }
};

export const toggleComments = async (blogId) => {
 try {
  const resp = await axios.patch(
   `${apiUrl}/api/blogs/${blogId}/toggle-comments`,
   {},
   {
    withCredentials: true,
   }
  );
  return resp.data.blog;
 } catch (err) {
  throw new Error("Failed to toggle comments");
 }
};

export const likeDislike = async (action, blogId) => {
 try {
  const resp = await axios.put(
   `${apiUrl}/api/blogs/${action}/${blogId}`,
   {},
   {
    withCredentials: true,
   }
  );
  return resp.data;
 } catch (err) {
  throw new Error("Failed to like/dislike blog");
 }
};

export const makeBlogPrivate = async (blogId) => {
 try {
  const resp = await axios.put(
   `${apiUrl}/api/blogs/private/${blogId}`,
   {},
   {
    withCredentials: true,
   }
  );
  return resp.data;
 } catch (error) {
  throw new Error("Failed to make this change");
 }
};

export const getWebData = async () => {
 try {
  const resp = await axios.get(`${apiUrl}/api/blogs/web-data`);
  return resp.data;
 } catch (error) {
  console.log(error);
  throw new Error("Failed to get web data");
 }
};

export const getCurrentUser = async () => {
 try {
  const resp = await axios.get(`${apiUrl}/api/users/profile`, {
   withCredentials: true,
  });
  return resp.data;
 } catch (error) {
  console.error("Failed to fetch user profile", error);
  return null;
 }
};
