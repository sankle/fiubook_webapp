import axios from 'axios';

export const uploadImage = async (image: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', image);
  const result = await axios.post(
    'https://api.imgbb.com/1/upload?key=86e5c05b5600d19323d70443e3851da3',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  console.log(result);
  if (result.status === 200) {
    if (result.data.success) {
      return result.data.data.url;
    }
  }

  throw new Error('Image upload failed');
};
