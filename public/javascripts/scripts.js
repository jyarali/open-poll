$(document).ready(function () {
    var max_fields = 20; //maximum input boxes allowed
    var wrapper = $(".input_fields_wrap"); //Fields wrapper
    var add_button = $(".add_field_button"); //Add button ID

    var x = wrapper.find('input[type=text]').length + 1; //initlal text box count
    $(add_button).click(function (e) { //on add input button click
        e.preventDefault();
        if (x < max_fields) { //max input box allowed
            $(wrapper).append('<div class="form-group"><input class="form-control" type="text" name="answers[' + x + '][content]" placeholder="گزینه ' + x + '"><a href="#" class="remove_field">Remove</a></div>'); //add input box
            x++; //text box increment
        }
    });

    $(wrapper).on("click", ".remove_field", function (e) { //user click on remove text
        e.preventDefault();
        $(this).parent('div').remove();
        x--;
    });

    // code for checking if at least one checkbox is checked
    $("#poll").submit(function (e) {
        var allchecks = $('#poll').find('input[type=checkbox]:checked').length;
        if (allchecks == 0) {
            // alert("ابتدا یکی از گزینه ها را انتخاب کنید");
            $('#mod1').modal('toggle');
            //stop the form from submitting
            return false;
        } else if (allchecks > 1) {
            // alert("فقط می‌توانید یکی از گزینه ها را انتخاب کنید");
            $('#mod2').modal('toggle');
            //stop the form from submitting
            return false;
        }
        return true;
    });

    // disable checkboxes for already voted users
    $("#voted input:checkbox").each(function () {
        // this.disabled = true;
        $(this).attr('disabled', '');
    });
});
var jlocation = $('#link').val() + window.location.pathname;
$('#link').attr({
    "value": jlocation
});

function del(id) {
    $('#mod3').modal('toggle');
    $('#confirmdel').click(function () {
        /* when the submit button in the modal is clicked, submit the form */
        $('.form-' + id).submit();
    });
}

function copylink() {
    /* Get the text field */
    var copyText = document.getElementById("link");

    /* Select the text field */
    copyText.select();

    /* Copy the text inside the text field */
    document.execCommand("copy");

    /* Alert the copied text */
    alert("Copied the text: " + copyText.value);
}