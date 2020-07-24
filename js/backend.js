// Модуль для работы с сервером

'use strict';

window.backend = (function () {

  var LOAD_URL = 'https://javascript.pages.academy/kekstagram/data';
  var UPLOAD_URL = 'https://javascript.pages.academy/kekstagram';
  var HTTP_STATUS_OK = 200;
  var TIMEOUT = 3000;

  return {
    // Загружает данные с сервера
    load: function (onSuccess, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === HTTP_STATUS_OK) {
          onSuccess(xhr.response);
        } else {
          onError('Произошла ошибка: ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Превышено время ожидания ' + TIMEOUT + ' мс ответа от сервера');
      });
      xhr.timeout = TIMEOUT;

      xhr.open('GET', LOAD_URL);
      xhr.send();
    },

    upload: function (data, onSuccess, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        if (xhr.status === HTTP_STATUS_OK) {
          onSuccess(xhr.response);
        } else {
          onError('Ошибка загрузки файла');
        }
      });
      xhr.addEventListener('error', function () {
        onError('Ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Превышено время ожидания ' + TIMEOUT + ' мс ответа от сервера');
      });
      xhr.timeout = TIMEOUT;

      xhr.open('POST', UPLOAD_URL);
      xhr.send(data);
    }
  };
})();
