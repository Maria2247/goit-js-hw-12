import axios from 'axios';

const API_KEY = '43829548-da808e6ec6af8b5210a63f940';
const API_URL = 'https://pixabay.com/api/';

export const fetchData = async (queryString, page) => {
  const response = await axios.get(API_URL, {
    params: {
      key: API_KEY,
      q: queryString,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: 15,
    },
  });

  return response;
};
