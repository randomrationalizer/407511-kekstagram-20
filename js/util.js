// Модуль c переменными и функциями для общего пользования

'use strict';

window.util = (function () {
  var bodyElement = document.querySelector('body');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');

  var Code = {
    ESC: 27,
    ENTER: 13
  };

  // Скрывает сообщение об ошибке
  var hideErrorMessage = function () {
    var errorMsgElem = document.querySelector('.error');
    errorMsgElem.parentNode.removeChild(errorMsgElem);
    document.removeEventListener('keydown', onErrorMsgEscPress);
    document.removeEventListener('click', onErrorMsgOuterClick);
  };

  // Скрывает сообщение об ошибке по нажатию ESC
  var onErrorMsgEscPress = function (evt) {
    window.util.isEscEvent(evt, hideErrorMessage);
  };

  // Скрывает сообщение об ошибке при клике по области экрана за пределами блока попапа
  var onErrorMsgOuterClick = function (evt) {
    var errorInnerElement = document.querySelector('.error__inner');
    window.util.isOuterAreaClick(evt, errorInnerElement, hideErrorMessage);
  };

  return {
    // Отображает сообщение об ошибке
    showErrorMessage: function (message, isSubmitMsg) {
      var element = errorTemplate.cloneNode(true);

      element.querySelector('.error__title').textContent = message;
      var closeBtn = element.querySelector('.error__button');
      closeBtn.textContent = isSubmitMsg ? 'Загрузить другой файл' : 'Закрыть';
      closeBtn.addEventListener('click', function () {
        hideErrorMessage();
      });
      closeBtn.addEventListener('keydown', function (evt) {
        window.util.isEnterEvent(evt, hideErrorMessage);
      });
      document.querySelector('main').appendChild(element);

      document.addEventListener('keydown', onErrorMsgEscPress);
      document.addEventListener('click', onErrorMsgOuterClick);
    },

    // Обработчик события по нажатию ESC
    isEscEvent: function (evt, action) {
      if (evt.keyCode === Code.ESC) {
        evt.preventDefault();
        action();
      }
    },
    // Обработчик события по нажатию Enter
    isEnterEvent: function (evt, action, arg) {
      if (evt.keyCode === Code.ENTER) {
        action(arg);
      }
    },

    // Обработчик события клика по области за пределами всплывающего окна
    isOuterAreaClick: function (evt, elem, action) {
      var popupCoords = elem.getBoundingClientRect();
      var x = evt.clientX;
      var y = evt.clientY;

      if ((x < popupCoords.left || x > popupCoords.right) || (y < popupCoords.top || y > popupCoords.bottom)) {
        action();
      }
    },

    // Скрывает скроллбар страницы фотографий при открытии модального окна
    hideBodyScrollbar: function () {
      bodyElement.classList.add('modal-open');
    },

    // Показывает скроллбар страницы фотографий при закрытии модального окна
    showBodyScrollbar: function () {
      bodyElement.classList.remove('modal-open');
    }
  };
})();
