export const isValidImageUrl = (url) => {
 if (!url) return false;
 // Basic URL format check
 const urlRegex =
  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
 if (!urlRegex.test(url)) return false;
 // Check for common image extensions
 const imageExtensions = /\.(jpeg|jpg|gif|png|bmp|webp)$/i;
 if (!imageExtensions.test(url)) return false;
 return true;
};
