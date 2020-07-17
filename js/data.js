// Модуль для генерации массива фотографий пользователей

'use strict';

window.data = (function () {
  var PHOTO_DESCRIPTIONS = [
    'Мой любимый котейка.',
    'Мир должен знать, что я ем!',
    'Доброе утро',
    '<3',
    ';)',
    'Красота-то какая, лепота!',
    'Селфи',
    'Мой кактус Геннадий.',
    'Валера, пришло твоё время!',
    'Oo'
  ];

  var COMMENTS_USERNAMES = [
    'Антон',
    'Иван',
    'Сергей',
    'Андрей',
    'Александр',
    'Максим',
    'Павел',
    'Артём',
    'Анатолий',
    'Валерий',
    'Владимир',
    'Виктор',
    'Валентин',
    'Вячеслав',
    'Пётр',
    'Алексей',
    'Марк',
    'Мартын',
    'Михаил',
    'Олег',
    'Мария',
    'Роза',
    'Клара',
    'Анастасия',
    'Валентина'
  ];

  var COMMENTS_TEXTS = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  var COMMENTS_AVATARS = [
    'img/avatar-1.svg',
    'img/avatar-2.svg',
    'img/avatar-3.svg',
    'img/avatar-4.svg',
    'img/avatar-5.svg',
    'img/avatar-6.svg'
  ];

  var photosCount = 25;

  // Возвращает случайное число в диапазоне от min до max (включая max)
  var getRandomNumber = function (min, max) {
    var randomNumber = min + Math.floor(Math.random() * (max + 1 - min));

    return randomNumber;
  };

  // Создаёт случайно сгенерированный комментарий
  var createComment = function (avatars, messages, names) {
    var comment = {};
    comment.avatar = avatars[getRandomNumber(0, avatars.length - 1)];

    var texts = messages.slice();
    var commentText = [];
    var textsCount = getRandomNumber(1, 2);

    while (commentText.length < textsCount) {
      var textIndex = getRandomNumber(0, messages.length - 1);
      commentText.push(texts.splice(textIndex, 1));
    }
    comment.message = commentText.join(' ');

    comment.name = names[getRandomNumber(0, names.length - 1)];

    return comment;
  };

  // Создаёт массив сгенерированных объектов фотографий
  var createPhotosArr = function (count, descriptions, avatars, messages, names) {
    var photos = [];

    for (var i = 1; i <= count; i++) {
      var photo = {};

      photo.id = i;
      photo.src = 'photos/' + i + '.jpg';
      photo.description = descriptions[getRandomNumber(0, descriptions.length - 1)];
      photo.likes = getRandomNumber(15, 200);

      photo.comments = [];
      var commentsCount = getRandomNumber(1, 15);
      while (photo.comments.length <= commentsCount) {
        photo.comments.push(createComment(avatars, messages, names));
      }

      photos.push(photo);
    }

    return photos;
  };

  return {
    // Экспорт массива сгенерированных случайных фотографий пользователей
    randomPhotos: createPhotosArr(photosCount, PHOTO_DESCRIPTIONS, COMMENTS_AVATARS, COMMENTS_TEXTS, COMMENTS_USERNAMES),

    // Находит нужный объект в массиве объектов фотографий пользователей по id миниатюры
    findPhoto: function (photoId) {
      var imgObj = window.data.randomPhotos.find(function (elem) {
        return elem.id === photoId;
      });

      return imgObj;
    }
  };
})();

