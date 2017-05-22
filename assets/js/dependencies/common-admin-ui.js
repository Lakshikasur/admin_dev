$(document).ready(function () {

  $('.nav-side-menu li a[href="'+localStorage.getItem('page_url') +'"]').parent().addClass('active');

  $('.nav-side-menu li a').click(function (e) {
    var $this = $(this);
    var click_url=$this.attr('href');
    localStorage.setItem('page_url',click_url);
    var current_url=window.location.pathname;
    //alert(click_url);
  });






});
