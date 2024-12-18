$(function () {
    let isDragging = false;
    let startEvent;
    let initialHeight;

    // Function to handle drag
    function handleDrag(event, $popupInner) {
        let clientY = event.clientY || event.touches[0].clientY;
        let deltaY = clientY - startEvent.clientY;
        let newHeight = initialHeight - deltaY;

        if (newHeight > 0) {
            // Use css for smooth height transition            
            $popupInner.css("height", (newHeight / $(window).height()) * 100 + "%");
        }
    }

    let $btmP_show = $(".open_lp");
    // Open Bottom Sheet Modal
    $btmP_show.on("click", function () {
        var targetSheetId = $(this).attr("aria-controls");
        var lp = $("#" + targetSheetId);

        // Open the target bottom_sheet
        lp.addClass("modal_on");
        $("body").css("overflow", "hidden");

        // Set initial height based on content size
        let $popupInner = lp.find(".popup_inner");
        $popupInner.css("height", "auto");
        initialHeight = $popupInner.outerHeight();

        // Check if the initial height is greater than or equal to 50%
        if (initialHeight >= $(window).height() * 0.5) {
            $popupInner.css("height", "50%");
        } else {
            $popupInner.css("height", (initialHeight / $(window).height()) * 100 + "%");
        }

        // Close Bottom Sheet Modal
        lp.find(".btn_close_popup, .pop_close, .sheet_overlay").click(function () {
            // Set the height to 0% and remove the 'show' class
            $popupInner.stop().animate({
                height: "0%"
            }, 200, function () {
                lp.removeClass("modal_on");
                $("body").css("overflow", "");
            });
        });

        // Add drag and drop functionality
        lp.find(".drag_handle").on("mousedown", function (e) {
            isDragging = true;
            startEvent = e;
            initialHeight = $popupInner.outerHeight();

            $(document).on("mousemove", function (e) {
                handleDrag(e, $popupInner);
            });

            $(document).on("mouseup", function () {
                $(document).off("mousemove");
                $(document).off("mouseup");

                // Check the final height and adjust accordingly
                let finalHeight = $popupInner.outerHeight();

                if (finalHeight >= $(window).height() * 0.75) {
                    $popupInner.stop().animate({
                        height: "100%"
                    }, 200);
                } else if (finalHeight <= $(window).height() * 0.25) {
                    $popupInner.stop().animate({
                        height: "0%"
                    }, 200, function () {
                        lp.removeClass("modal_on");
                        $("body").css("overflow", "");
                    });
                } else if (finalHeight < $(window).height() * 0.75 && finalHeight > $(window).height() * 0.5) {
                    $popupInner.stop().animate({
                        height: "50%"
                    }, 200);

                } else if (finalHeight < $(window).height() * 0.5 && finalHeight > $(window).height() * 0.25) {
                    // Check if the initial height is greater than or equal to 50%
                    if (initialHeight >= $(window).height() * 0.5) {
                        $popupInner.css("height", "50%");
                    } else {
                        $popupInner.css("height", "auto");
                    }
                }

                isDragging = false;
            });

            return false;
        });

        // Add drag and drop functionality for mobile
        lp.find(".drag_handle").on("touchstart", function (e) {
            isDragging = true;
            startEvent = e.touches[0];
            initialHeight = $popupInner.outerHeight();

            $(document).on("touchmove", function (e) {
                handleDrag(e.touches[0], $popupInner);
            });

            $(document).on("touchend", function () {
                $(document).off("touchmove");
                $(document).off("touchend");

                // Check the final height and adjust accordingly
                let finalHeight = $popupInner.outerHeight();

                if (finalHeight >= $(window).height() * 0.75) {
                    $popupInner.stop().animate({
                        height: "100%"
                    }, 200);
                } else if (finalHeight <= $(window).height() * 0.25) {
                    $popupInner.stop().animate({
                        height: "0%"
                    }, 200, function () {
                        lp.removeClass("modal_on");
                        $("body").css("overflow", "");
                    });
                } else if (finalHeight < $(window).height() * 0.75 && finalHeight > $(window).height() * 0.5) {
                    $popupInner.stop().animate({
                        height: "50%"
                    }, 200);

                } else if (finalHeight < $(window).height() * 0.5 && finalHeight > $(window).height() * 0.25) {
                    // Check if the initial height is greater than or equal to 50%
                    if (initialHeight >= $(window).height() * 0.5) {
                        $popupInner.css("height", "50%");
                    } else {
                        $popupInner.css("height", "auto");
                    }
                }

                isDragging = false;
            });

            return false;
        });

        // Allow dragging even when the height is 100% for mobile
        lp.find(".popup_inner").on("touchmove", function (e) {
            if (isDragging && $popupInner.outerHeight() >= $(window).height()) {
                handleDrag(e.touches[0], $popupInner);
            }
        });
    });
});