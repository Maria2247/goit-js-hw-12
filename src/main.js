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

const galleryElements = document.querySelector('.gallery-list');
const form = document.querySelector('.search-form');
const loaderEl = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.loadMoreBtn');
let searchValue = '';
let currentPage;
let totalPages;

async function onSubmitForm(event) {
  event.preventDefault();
  try {
    searchValue = event.currentTarget.elements.userInput.value.trim();
    loadMoreBtn.classList.add('is-hidden');
    galleryElements.innerHTML = '';
    currentPage = 1;

    if (searchValue === '') {
      event.currentTarget.reset();
      return iziToast.warning({
        message: 'Type your query, please!',
        position: 'center',
        timeout: 3000,
      });
    }

    loaderEl.classList.remove('is-hidden');

    const responseObj = await fetchData(searchValue, currentPage);
    console.log('responseObj: ', responseObj);

    const imgArray = responseObj.data.hits;
    console.log('imgArray: ', imgArray);
    const totalImgs = responseObj.data.totalHits;
    const perPage = responseObj.config.params.per_page;
    totalPages = Math.ceil(totalImgs / perPage);

    if (imgArray.length === 0) {
      console.log('No images found');
      loaderEl.classList.add('is-hidden');
      event.target.reset();
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
    }

    event.target.reset();
    galleryStyles.refresh();
  } catch (error) {
    loaderEl.classList.add('is-hidden');
    loadMoreBtn.classList.add('is-hidden');
    return new Error('Oops, something went wrong 😞');
  }
}

async function onClickLoadMore() {
  try {
    currentPage++;
    loaderEl.classList.remove('is-hidden');

    const loadMoreData = await fetchData(searchValue, currentPage);
    const addedImgArray = loadMoreData.data.hits;
    const editedGalleryMarkup = await createGalleryMarkup(addedImgArray);
    loaderEl.classList.add('is-hidden');
    galleryElements.innerHTML += editedGalleryMarkup;
    const imageCard = document.querySelector('.image-card');
    const rect = imageCard.getBoundingClientRect();
    window.scrollBy({
      top: rect.height * 2,
      behavior: 'smooth',
    });

    galleryStyles.refresh();

    if (currentPage >= totalPages) {
      loadMoreBtn.classList.add('is-hidden');
      return iziToast.info({
        position: 'topRight',
        message: "We're sorry, there are no more pictures to load",
      });
    }
    // loadMoreBtn.classList.add('.is-hidden');
  } catch (error) {
    loaderEl.classList.add('is-hidden');
    loadMoreBtn.classList.add('is-hidden');
    return new Error('Oops, something went wrong 😞');
  }
}

form.addEventListener('submit', onSubmitForm);
loadMoreBtn.addEventListener('click', onClickLoadMore);
