export const createGalleryMarkup = images => {
  return images
    .map(
      image => `
    <li class="image-card">
        <a href="${image.largeImageURL}"
          ><img src="${image.webformatURL}" alt="${image.tags}"/>
        </a>
        <ul class="img-descr">
          <li class="descr-el">Likes <span>${image.likes}</span></li>
          <li class="descr-el">Views <span>${image.views}</span></li>
          <li class="descr-el">Comments <span>${image.comments}</span></li>
          <li class="descr-el"> Downloads <span>${image.downloads}</span></li>
        </ul>
      </li>`
    )
    .join('');
};
