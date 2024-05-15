import { createGalleryMarkup } from './js/render-functions.js';
import { fetchData } from './js/pixabay-api.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryStyles = new SimpleLightbox('.gallery-list a', {
  captionsData: 'alt',
  captionDelay: 250,
});

// "Витягаємо" необхідні об'єкти з HTML-файлу
const galleryElements = document.querySelector('.gallery-list');
const form = document.querySelector('.search-form');
const loaderEl = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.loadMoreBtn');

async function onSubmitForm(event) {
  event.preventDefault();

  try {
    const searchValue = event.currentTarget.elements.userInput.value.trim();
    // Перевіряємо, чи був введений запит
    if (searchValue === '') {
      galleryElements.innerHTML = '';
      event.currentTarget.reset();
      return iziToast.warning({
        message: 'Type your query, please!',
        position: 'center',
        timeout: 3000,
      });
    }
    // Якщо все ок, створюємо запит і активуємо loader
    galleryElements.innerHTML = '';
    loaderEl.classList.remove('is-hidden');

    // Створюємо змінну, в яку поміщаємо весь об'єкт відповіді від API
    const responseObj = await fetchData(searchValue);
    console.log('responseObj: ', responseObj);

    // Дістаємо з об'єкта всі необхідні дані
    const imgArray = responseObj.data.hits;
    console.log('imgArray: ', imgArray);
    const totalImgs = responseObj.data.total;
    console.log(totalImgs);
    let currentPage = responseObj.config.params.page;
    console.log('currentPage: ', currentPage);
    const perPage = responseObj.config.params.per_page;
    console.log('perPage: ', perPage);
    const totalPages = Math.ceil(totalImgs / perPage);
    console.log('totalPages: ', totalPages);

    // Перевіряємо, чи не пустий об'єкт
    if (imgArray.length === 0) {
      loaderEl.classList.add('is-hidden');
      return iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        timeout: 3000,
        position: 'topRight',
        backgroundColor: '#ef4040',
        messageColor: '#fafafb',
        messageSize: '16px',
        messageLineHeight: '1.5',
        iconColor: '#fafafb',
      });
    }
    loaderEl.classList.add('is-hidden');
    const galleryMarkup = await createGalleryMarkup(imgArray);
    galleryElements.innerHTML = galleryMarkup;
    if (totalPages > 1) {
      loadMoreBtn.classList.remove('is-hidden');
      loadMoreBtn.addEventListener('click', () => {
        try {
          currentPage++;
          const loadMoreData = fetchData(searchValue, currentPage);
          const addedImgArray = loadMoreData.data.hits;

          if (currentPage <= totalPages) {
            const editedGalleryMarkup = createGalleryMarkup(addedImgArray);
            galleryElements.innerHTML += editedGalleryMarkup;
          } else {
            loadMoreBtn.classList.add('is-hidden');
            return iziToast.error({
              position: 'topRight',
              message: "We're sorry, there are no more pictures to load",
            });
          }
        } catch (error) {
          return new Error('Oops, something went wrong 😞');
        }
      });
    }

    event.target.reset();
    galleryStyles.refresh();
    loaderEl.classList.add('is-hidden');
    loadMoreBtn.classList.add('.is-hidden');
  } catch (error) {
    return new Error('Oops, something went wrong 😞');
  }
}

// async function onClickLoadMore(searchValue, currentPage, totalPages) {
//   try {
//     currentPage++;
//     const loadMoreData = await fetchData(searchValue, currentPage);
//     const addedImgArray = loadMoreData.data.hits;

//     if (currentPage <= totalPages) {
//       const editedGalleryMarkup = await createGalleryMarkup(addedImgArray);
//       galleryElements.innerHTML += editedGalleryMarkup;
//     } else {
//       loadMoreBtn.classList.add('is-hidden');
//       return iziToast.error({
//         position: 'topRight',
//         message: "We're sorry, there are no more pictures to load",
//       });
//     }
//   } catch (error) {
//     return new Error('Oops, something went wrong 😞');
//   }
// }

// loadMoreBtn.addEventListener('click', onClickLoadMore);
form.addEventListener('submit', onSubmitForm);
