$(document).ready(function() {



    $("#packgeSectionData").on('click', '#packageSection', function() {
        // get the current row
        var currentRow = $(this).closest("tr");
        var package = currentRow.find("td:eq(0)").data('value'); // get current row 1st TD value
        var curr = currentRow.find("td:eq(1)").data('value'); // get current row 2nd TD
        var grade = currentRow.find("td:eq(2)").data('value'); // get current row 3rd TD
        var sub = currentRow.find("td:eq(3)").data('value'); // get current row 4th TD
        var sec = currentRow.find("td:eq(4) select option:selected").val(); // get current row 5th TD

        if (sec != "") {
            var data = {
                'p_type': package,
                'c_type': curr,
                'g_type': grade,
                's_subject': sub,
                'sec_type': sec,
                _csrf: $('input[name=_csrf]').val(),
            };
            $.ajax({
                type: 'POST',
                url: '/package/setPackageToSec',
                data: data,
                dataType: "json",
                success: function(status) {

                    if (status) {

                        $.confirm({
                            title: 'Success!',
                            content: 'Section Add Success',
                            buttons: {
                                Done: function() {
                                    location.href = '/section/loadAddPackageSec?auth=' + sessionStorage.getItem('token');
                                }

                            }
                        });
                    }

                }

            });

        } else {
            $.alert({
                title: 'Fail',
                content: 'Select Section'
            });


        }


    });
    $("#packgeSectionData").on('click', '#packageSectionSingle', function() {
        // get the current row
        var currentRow = $(this).closest("tr");
        var package = currentRow.find("td:eq(0)").data('value'); // get current row 1st TD value
        var curr = currentRow.find("td:eq(1)").data('value'); // get current row 2nd TD
        var grade = currentRow.find("td:eq(2)").data('value'); // get current row 3rd TD
        var sub = currentRow.find("td:eq(3)").data('value'); // get current row 4th TD
        var sec = currentRow.find("td:eq(4) select option:selected").val(); // get current row 5th TD

        if (sec != "") {
            var data = {
                'p_type': package,
                'c_type': curr,
                'g_type': grade,
                's_subject': sub,
                'sec_type': sec,
                _csrf: $('input[name=_csrf]').val(),
            };
            $.ajax({
                type: 'POST',
                url: '/package/setPackageToSec',
                data: data,
                dataType: "json",
                success: function(status) {

                    if (status) {

                        $.confirm({
                            title: 'Success!',
                            content: 'Section Add Success',
                            buttons: {
                                Done: function() {
                                    location.href = '/section/packageToSection?auth=' + sessionStorage.getItem('token') + '&pid=' + package;
                                }

                            }
                        });
                    }

                }

            });

        } else {
            $.alert({
                title: 'Fail',
                content: 'Select Section'
            });


        }


    });


});