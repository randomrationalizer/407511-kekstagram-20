// Модуль, отображающий окно полноэкранного просмотра фото случайного пользователя

'use strict';

window.bigPhoto = (function () {

  var bigPhotoElement = document.querySelector('.big-picture');
  var bigPhotoCloseBtnElement = bigPhotoElement.querySelector('.big-picture__cancel');
  var commentElement = bigPhotoElement.querySelector('.social__comment');
  var commentsCountElement = bigPhotoElement.querySelector('.social__comment-count');
  var commentsLoaderElement = bigPhotoElement.querySelector('.social__comments-loader');


  // Создает DOM-элемент комментария
  var createCommentElement = function (comment) {
    var element = commentElement.cloneNode(true);

    element.querySelector('.social__picture').src = comment.avatar;
    element.querySelector('.social__picture').alt = comment.name;
    element.querySelector('.social__text').textContent = comment.message;

    return element;
  };

  // Закрывает окно полноэкранного просмотра фото по нажатию ESC
  var onBigPhotoEscPress = function (evt) {
    window.util.isEscEvent(evt, closeBigPhoto);
  };

  // Закрывет окно полноэкранного просмотра фото, удаляет обработчик закрытия фото по ESC
  var closeBigPhoto = function () {
    bigPhotoElement.classList.add('hidden');
    document.removeEventListener('keydown', onBigPhotoEscPress);
    window.util.showBodyScrollbar();
  };

  // Добавляет на кнопку закрытия окна полноэкранного просмотра фото обработчик события клик, закрывающий окно
  bigPhotoCloseBtnElement.addEventListener('click', function () {
    closeBigPhoto();
  });


  return {
    // Показывает окно полноэкранного просмотра фото из массива объектов, добавляет обработчик закрытия окна по ESC
    open: function (photo) {
      bigPhotoElement.classList.remove('hidden');

      var bigPhotoImgElement = bigPhotoElement.querySelector('.big-picture__img').querySelector('img');
      bigPhotoImgElement.src = photo.src;
      bigPhotoImgElement.alt = photo.description;
      bigPhotoElement.querySelector('.likes-count').textContent = photo.likes;
      bigPhotoElement.querySelector('.comments-count').textContent = photo.comments.length;

      var fragment = document.createDocumentFragment();
      photo.comments.forEach(function (comment) {
        fragment.appendChild(createCommentElement(comment));
      });
      bigPhotoElement.querySelector('.social__comments').appendChild(fragment);

      bigPhotoElement.querySelector('.social__caption').textContent = photo.description;

      commentsCountElement.classList.add('hidden');
      commentsLoaderElement.classList.add('hidden');
      window.util.hideBodyScrollbar();
      document.addEventListener('keydown', onBigPhotoEscPress);
    }
  };
})();
