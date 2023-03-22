import axios from 'axios';
import config from '@config/default';

export const uploadImage = async (image: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', image);
  // TODO: fill this in with your own API key
  const result = await axios.post(
    `https://api.imgbb.com/1/upload?key=${config.imgBBApiKey}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  if (result.status === 200) {
    if (result.data.success) {
      return result.data.data.url;
    }
  }

  throw new Error('Image upload failed');
};
