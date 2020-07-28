// Модуль, отображающий окно полноэкранного просмотра фото случайного пользователя

'use strict';

window.bigPhoto = (function () {
  var COMMENTS_COUNT = 5;

  var bigPhotoElement = document.querySelector('.big-picture');
  var bigPhotoCloseBtnElement = bigPhotoElement.querySelector('.big-picture__cancel');
  var commentsContainerElement = bigPhotoElement.querySelector('.social__comments');
  var commentElement = bigPhotoElement.querySelector('.social__comment');
  var commentsCountElement = bigPhotoElement.querySelector('.social__comment-count');
  var loadMoreBtnElement = bigPhotoElement.querySelector('.social__comments-loader');

  // Объект текущей открытой в полноэкранном режиме фотографии
  var currentPhoto = {};


  // Создает DOM-элемент комментария
  var createCommentElement = function (comment) {
    var element = commentElement.cloneNode(true);

    element.querySelector('.social__picture').src = comment.avatar;
    element.querySelector('.social__text').textContent = comment.message;
    element.querySelector('.social__picture').alt = comment.name;

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
    bigPhotoElement.removeEventListener('click', onBigPhotoOuterClick);
    window.util.showBodyScrollbar();
  };

  // Закрывает окно полноэкранного просмотра фото при клике по области экрана за пределами окна
  var onBigPhotoOuterClick = function (evt) {
    var popupElement = bigPhotoElement.querySelector('.big-picture__preview');
    window.util.isOuterAreaClick(evt, popupElement, closeBigPhoto);
  };

  // Добавляет на кнопку закрытия окна полноэкранного просмотра фото обработчик события клик, закрывающий окно
  bigPhotoCloseBtnElement.addEventListener('click', function () {
    closeBigPhoto();
  });

  // Отрисовывает партию из 5 (или менее) комментариев открытого в полноэкранном режме изображения, начиная с указанного индекса
  var renderComments = function (startIndex) {
    var remainingComments = currentPhoto.comments.slice(startIndex);

    var fragment = document.createDocumentFragment();
    var count = (remainingComments.length >= COMMENTS_COUNT) ? COMMENTS_COUNT : remainingComments.length;

    for (var i = 0; i < count; i++) {
      fragment.appendChild(createCommentElement(remainingComments[i]));
    }
    commentsContainerElement.appendChild(fragment);

    var remainingCount = remainingComments.length - count;
    toggleLoadMoreBtn(remainingCount);
  };

  // Проверяет, остались ли неотрисованные комментарии, и, в зависимости от этого, отображает кнопку "Загрузить ещё"
  var toggleLoadMoreBtn = function (remainingCount) {
    if (remainingCount > 0) {
      loadMoreBtnElement.classList.remove('hidden');
    } else {
      loadMoreBtnElement.classList.add('hidden');
    }
  };

  // Оичщает блок комментариев
  var clearComments = function () {
    var commentsElements = Array.from(commentsContainerElement.querySelectorAll('.social__comment'));
    commentsElements.forEach(function (elem) {
      elem.parentNode.removeChild(elem);
    });
  };

  // Обработчик клика по кнопке "Загрузить ещё"
  var onShowCommentsBtnClick = function () {
    var currentCommentsElements = Array.from(commentsContainerElement.querySelectorAll('.social__comment'));

    // Индекс комментария, начиная с которого будут показаны следующие 5 (или менее) комментариев
    var currentIndex = currentCommentsElements.length;

    renderComments(currentIndex);
  };

  // Добавляет на кнопку "Загрузить ещё" обработчик события клик, отрисовывающий следующую партию комментариев
  loadMoreBtnElement.addEventListener('click', onShowCommentsBtnClick);


  return {
    // Показывает окно полноэкранного просмотра фото из массива объектов, добавляет обработчик закрытия окна по ESC
    open: function (photo) {
      bigPhotoElement.classList.remove('hidden');

      var bigPhotoImgElement = bigPhotoElement.querySelector('.big-picture__img').querySelector('img');
      bigPhotoImgElement.src = photo.url;
      bigPhotoImgElement.alt = photo.description;
      bigPhotoElement.querySelector('.likes-count').textContent = photo.likes;
      bigPhotoElement.querySelector('.comments-count').textContent = photo.comments.length;
      bigPhotoElement.querySelector('.social__caption').textContent = photo.description;
      commentsCountElement.classList.add('hidden');

      clearComments();

      // Записывает в переменную currentPhoto ссылку на объект текущей фотографии
      currentPhoto = photo;

      // Отрисовка первых 5 (или менее) комментариев
      renderComments(0);

      window.util.hideBodyScrollbar();
      document.addEventListener('keydown', onBigPhotoEscPress);
      bigPhotoElement.addEventListener('click', onBigPhotoOuterClick);
    }
  };
})();
