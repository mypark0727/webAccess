(function () {
  ("use strict");
  // deposit 목록 옵션
  const option = {
    wrap: ".pub_list", // 구조 제일 뒤에 아이프레임을 추가할 wrapper 클래스
    el: ".pub_list a", // 미리보기 할 공통된 셀렉터
    width: 420, // 미리보기 페이지의 가로 범위
    height: 700, // 미리보기 페이지의 세로 범위
    scale: 1, // 미리보기 페이지의 축소 스케일
    frameX: 130, // 미리보기할 프레임의 마우스로부터 X좌표 거리
    frameY: -100, // 미리보기할 프레임의 마우스로부터 Y좌표 거리

  };
  preview(option);
  // page 미리보기
  function preview(option) {
    document.addEventListener("DOMContentLoaded", function () {
      setFramePreview();
      scrollCheck();
      // moveTop();
    });

    // 맨 위로 버튼
    var wrap = document.querySelector(option.wrap);
    var btn = document.querySelector(option.btnToTop);

    function moveTop() {
      btn.addEventListener("click", function () {
        window.scrollTo(0, 0);
      });
    }

    // 스크롤 방향 체크
    function scrollCheck() {
      var delta = null;
      // wrap.addEventListener("mousewheel", checkScroll);
      // wrap.addEventListener("DOMMouseScroll", checkScroll); // FireFox
      // wrap.addEventListener("WheelEvent", checkScroll); // Safari

      function checkScroll(e) {
        delta = 0;
        e.detail ? (delta = e.detail * -40) : (delta = e.wheelDelta);
        if (delta > 0) {
          // 위로 스크롤
          if (!btn.classList.contains("on")) {
            btn.classList.add("on");
          }
        } else if (delta < 0) {
          // 아래로 스크롤
          if (btn.classList.contains("on")) {
            btn.classList.remove("on");
          }
        }
      }
    }

    function setFramePreview() {
      var wrap = document.querySelector(option.wrap),
        currentDomainUrl = "",
        urlAfter = "",
        element = document.querySelectorAll(option.el),
        html = `<iframe id="popupView" frameborder="0" scrlling="no" style="position:absolute;z-index:9999;width:${option.width}px;height:${option.height}px;-webkit-transform:scale(${option.scale});transform: scale(${option.scale});-webkit-transform-origin:top left;transform-origin:top left;background:#fff;border-radius:10px;box-shadow:0 0 4px 0 rgba(0, 0, 0, 0.5)"></iframe>`;

      for (var i = 0, len = element.length; i < len; i++) {
        element[i].addEventListener("mouseenter", linkOver);
        element[i].addEventListener("mouseleave", linkLeave);
      }

      function appendHtml(el, str) {
        var div = document.createElement("div");
        div.innerHTML = str;
        while (div.children.length > 0) {
          el.appendChild(div.children[0]);
        }
      }

      // 링크 마우스 enter
      function linkOver(e) {
        appendHtml(wrap, html);

        var targetX = e.pageX + option.frameX,
          targetY = e.pageY + option.frameY,
          popupView = document.querySelector("#popupView");

        var url = this.getAttribute("href");
        popupView.setAttribute("src", url);

        var winWid = (window.innerWidth =
            15 || document.documentElement.clientWidth),
          winHei = window.innerHeight || document.documentElement.clientHeight,
          widMouseToFrameRightEdge =
          option.width * option.scale + option.frameX,
          widMouseToWindowRightEdge = winWid - e.clientX,
          heiMouseToFrameBottomEdge =
          option.height * option.scale + option.frameY,
          heiMouseToWindowBottomEdge = winHei - e.clientY,
          isFrameWidInside =
          widMouseToWindowRightEdge > widMouseToFrameRightEdge,
          isFrameHeiInside =
          heiMouseToWindowBottomEdge > heiMouseToFrameBottomEdge;

        if (!(isFrameWidInside && isFrameHeiInside)) {
          if (!isFrameWidInside && !isFrameHeiInside) {
            popupView.style.left =
              (e.pageX - option.frameX - option.width * option.scale).toFixed(
                0
              ) + "px";
            correctionHeight();
            return;
          }
          if (!isFrameWidInside) {
            popupView.style.left =
              (e.pageX - option.frameX - option.width * option.scale).toFixed(
                0
              ) + "px";
            popupView.style.top = targetY + "px";
          }
          if (!isFrameHeiInside) {
            popupView.style.left = targetX + "px";
            correctionHeight();
          }
        } else {
          popupView.style.left = targetX + "px";
          popupView.style.top = targetY + "px";
        }

        // 프레임 위치 조정
        function correctionHeight() {
          if (heiMouseToFrameBottomEdge > e.clientY) {
            popupView.style.top = e.pageY - e.clientY + 10 + "px";
          } else {
            popupView.style.top =
              (e.pageY - option.height * option.scale - option.frameY).toFixed(
                0
              ) + "px";
          }
        }
      }

      function linkLeave() {
        popupView.parentNode.removeChild(popupView);
      }
    }
  }
})();