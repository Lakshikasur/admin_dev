$(document).ready(function() {
    $('.lrn-qe-nav-stacked').on("click", function() {
        $(this).removeClass('lrn-active');
    });
    $('#c_id').val(localStorage.getItem('c_typeid'));
    $('#g_id').val(localStorage.getItem('g_typeid'));
    $('#s_id').val(localStorage.getItem('s_typeid'));
    $('#m_id').val(localStorage.getItem('m_typeid'));
    $('#mu_id').val(localStorage.getItem('mu_typeid'));
    $('[data-toggle="div"]').click(function(e) {
        e.preventDefault();
        var $this = $(this),
            url = $this.attr('data-url');
        $('.' + url).removeClass('hide');
        $this.siblings().removeClass('activediv');
        $this.addClass('activediv');
        $('.' + url).siblings().addClass('hide');

    });



});