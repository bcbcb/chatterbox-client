$(document).ready(function () {

$('.submit').on('click', app.handleSubmit);

$('.tabber').click(function (e) {
  e.preventDefault();
  console.log(e);
  $(this).tab('show');
});

});
