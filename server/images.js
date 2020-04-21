const imageContainer = document.createElement('div');
imageContainer.id = 'pdf-images';

Array.from(document.querySelectorAll('.news-carousel a[href$=".jpg"], .news-carousel a[href$=".jpeg"], .news-carousel a[href$=".png"]')).map((link) => {
  let img = new Image();
  img.src = link.href;
  imageContainer.appendChild(img);
});

document.body.appendChild(imageContainer);
