    $(document).ready(function() {
        const $header = $('#header');
        const $inputs = $('main input[type="text"], main textarea'); // Inputs in your main content

        $inputs.on('focus', function() {
            $header.css('position', 'absolute'); // Or add a class: $header.addClass('header-unfixed');
        });

        $inputs.on('blur', function() {
            // Delay slightly to handle taps outside that might immediately refocus
            setTimeout(function() {
                if (!$inputs.is(':focus')) { // Check if any relevant input is still focused
                    $header.css('position', 'fixed'); // Or remove class: $header.removeClass('header-unfixed');
                }
            }, 100);
        });
    });
    