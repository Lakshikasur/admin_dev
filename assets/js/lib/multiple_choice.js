$(document).ready(function() {

    $('#qs_id').val(localStorage.setItem('qs_id', $("#qs_id").val()));

    $('.questiontype').on('click', function(event) {
        event.preventDefault();


    });


    $('.questionPrview').on('click', function(event) {
        $('.compose_preview').removeClass('hide');
        $('.compose_question').addClass('hide');

    });

    $('.questionEdit').on('click', function(event) {
        $('.compose_preview').addClass('hide');
        $('.compose_question').removeClass('hide');

    });







});