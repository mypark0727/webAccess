// SyntaxHighlighter
$(window).ready(function () {
  SyntaxHighlighter.defaults["toolbar"] = false;
  SyntaxHighlighter.all();
});

// HTML 가이드 네비게이션 생성
$(document).ready(function () {
  $(".component_list").append('<ul class="guide_list"></ul>');
  $(".cont_body .tit_guide").each(function (i) {
    var menuId = $(this).attr("id");
    var menuItem = $(this).html();
    $(".guide_list").append(
      '<li class="nav"><a href="#' + menuId + '">' + menuItem + "</a></li>"
    );
  });
  $(".guide_list a").click(function () {
    $(this).parent("li").addClass("on").siblings().removeClass("on");
  });

  guideNavJumpTo();

  $(".btn_collaspe").click(function () {
    $(".wrapper_html_guide").toggleClass("sidebar_open");
  });
});

// $(document).on('click', '.btn_type', function () {
// 	if ($('.common-css').attr('href') == '/resources/css/common.css') {
// 		$('.common-css').attr('href', '/resources/css/common.css');
// 		$(this).text('보험');
// 	} else {
// 		$('.common-css').attr('href', '/resources/css/common.css');
// 		$(this).text('예금');
// 	}
// });

// HTML 가이드 JumpTo
function guideNavJumpTo() {
  var nav, scrollArea, scrollItem, ranges;

  if ($('.guide_list .nav a[href="' + location.hash + '"]').length) {
    setTimeout(function () {
      $('.guide_list .nav a[href="' + location.hash + '"]').click();
    }, 500);
  } else {
    setTimeout(function () {
      $(".guide_list .nav:first-child a").click();
    }, 500);
  }

  nav = $(".guide_list .nav a");
  scrollArea = $("html, body");
  scrollItem = $(".guide_section");

  nav.on("click", function (e) {
    getPosition();

    setActive($(this));

    scrollArea.stop().animate({
        scrollTop: ranges[$(this).parent("li").index(".nav")][0],
      },
      100
    );
    e.preventDefault();
  });

  $.fn.scrollStopped = function (callback) {
    var that = this,
      $this = $(window);

    $this.scroll(function (e) {
      clearTimeout($this.data("scrollTimeout"));
      $this.data("scrollTimeout", setTimeout(callback.bind(that), 150, e));
    });
  };

  scrollArea.scrollStopped(function (e) {
    var pos = Math.ceil($(this).scrollTop());

    $.each(ranges, function (i, range) {
      if (pos >= range[0] && pos < range[1]) {
        setActive(nav.eq(i)[0]);
        return;
      }
    });
  });

  function setActive(elem) {
    $(elem).parent("li").addClass("on").siblings("li").removeClass("on");
    var tg = $(elem).attr("href");
    history.pushState(
      "",
      document.title,
      window.location.pathname + window.location.search + tg
    );
  }

  function getPosition() {
    ranges = scrollItem.map(function (i) {
      // var defaultT = scrollItem.eq(0).position().top;
      // var lnbT = scrollItem.eq(i).position().top - defaultT;
      var lnbT = scrollItem.eq(i).position().top;

      return [
        [Math.ceil(lnbT), Math.ceil(scrollItem.eq(i).outerHeight() + lnbT)],
      ];
    });
  }
}