// common.js : 필수 스크립트 정의

$(function () {

  //accordion
  $(document).on("click", ".accordion .acc_head a", function () {
    let $ac_wrap = $(this).closest("li");
    $ac_wrap.toggleClass("open").siblings().removeClass('open');
  });

  // 탭메뉴 선택
  let defTab = $(".tab_menu li:first-child a"),
    defCon = defTab.attr("data-tab");
  $(defTab).addClass("current");
  $("#" + defCon).addClass("on");

  $(".tab_menu li a").click(function () {
    let activeTab = $(this).attr("data-tab");
    $(".tab_menu li a").removeClass("current");
    $(".tab_con").removeClass("on");
    $(this).addClass("current");
    $("#" + activeTab).addClass("on");
  });



  // ========================================================================== //
  // s: 모달팝업
  let isDragging = false; // 드래그 중인지 여부를 나타내는 플래그
  let startEvent; // 드래그 시작 이벤트
  let initialHeight; // 모달 높이의 초기값
  let tabDisable; // 탭 비활성 여부를 나타내는 플래그
  let $lp_open = $(".open-lp, .marker .btn_more"); // 모달을 여는 요소에 대한 객체

  function handleDrag(event, lpObj) {
    let clientY = event.clientY || event.touches[0].clientY;
    let deltaY = clientY - startEvent.clientY;
    let newHeight = Math.max(0, initialHeight - deltaY);
    lpObj.css("height", `${(newHeight / $(window).height()) * 100}%`);
  }

  function openModal(event) {
    const op = $(event.currentTarget); // 클릭한 요소에 대한 객체
    const lp = $("#" + op.attr("aria-controls")); // 연결된 모달에 대한 객체
    const lpObj = lp.children(".popup_inner"); // 모달 내부의 콘텐츠에 대한 객체
    const isBottomSheet = lp.hasClass("bottom_sheet"); // 모달이 bottom_sheet인지 여부
    const lpObjHandle = lp.find(".drag_handle"); // 바텀 모달 높이조절 핸들 객체
    const lpObjClose = lp.find(".btn_close_popup, .btn_wrap .pop_close"); // 모달 내부 닫기 버튼에 대한 객체   
    const lpObjTabbable = lpObj.find("button, input:not([type='hidden']), select, iframe, textarea, [href], [tabindex]:not([tabindex='-1'])"); // 탭 가능한 모든 요소에 대한 객체
    const lpOuterObjHidden = $(".wrapper, .header, .footer"); // 모달 외부의 숨겨진 요소에 대한 객체    
    const lp_close = $(".map_area"); // 모달 외부 닫기 버튼에 대한 객체
    const syncObj = $(".bottom_area"); // 모달 외부 위치 싱크 영역에 대한 객체

    // modal 및 bottom_sheet 공통 기능
    // 스크롤 방지 처리
    $(".wrapper").css("top", -$(window).scrollTop()).on("scroll touchmove mousewheel", (event) => event.preventDefault());

    //모달 닫기
    function lpClose() {
      // 스크롤 방지 해제
      $(".wrapper").css("top", "").off("scroll touchmove mousewheel");

      // 탭 비활성화 및 포커스 처리
      lpObj.attr("tabindex", tabDisable ? "-1" : "0");
      lpOuterObjHidden.removeAttr("aria-hidden");
      op.focus();
      $(document).off("keydown.lp_keydown");

      // 모달 닫기 처리
      const closeModalAnimation = () => {
        lp.removeClass("modal_on fullscreen");
        lpObj.css("height", ""); // 닫은 후 높이 초기화 (닫기 문제 수정)
      };

      if (isBottomSheet) {
        // 하단 시트 모달 닫기 처리
        lpObj.stop().animate({
          height: "0%"
        }, 200, closeModalAnimation);
        syncObj.animate({
          bottom: "0"
        }, 0); // s:240110 반복이벤트시 이벤트 겹침으로 인한 오류로 인해 animate 시간을 200-> 0으로 수정함
      } else {
        // 일반 모달 닫기 처리
        setTimeout(() => lp.removeClass("modal_on"), 200);
        lpObj.animate({
          top: "55%",
          opacity: '0'
        }, 200, () => {
          lpObj.css({
            top: "50%",
            opacity: '1'
          });
        });
      }
    }

    op.blur(); // 모달을 여는 버튼에서 포커스를 제거하여 클릭 피드백 감소
    lp.addClass("modal_on").attr("aria-hidden", "true"); // 모달을 활성화하고, 스크린 리더기에 숨김 처리

    // 탭 가능한 요소에 포커스 처리
    lpObjTabbable.length ? lpObjTabbable.first().focus().on("keydown", (event) => {
      if (event.shiftKey && event.key === "Tab") {
        event.preventDefault();
        lpObjTabbable.last().focus();
      }
    }) : lpObj.attr("tabindex", "0").focus().on("keydown", (event) => {
      if (event.key === "Tab") event.preventDefault();
    });

    // 역방향 탭일 경우 처리
    lpObjTabbable.last().on("keydown", (event) => {
      if (!event.shiftKey && event.key === "Tab") {
        event.preventDefault();
        lpObjTabbable.first().focus();
      }
    });

    // 모달 닫기 이벤트 핸들러 등록      
    lpObjClose.on("click", lpClose);
    lp_close.click(function (e) {
      if (!$(e.target).hasClass("btn_more")) {
        lpClose();
      }
    });

    // 모달 바깥 영역을 클릭시 모달이 닫기
    lp.on("click", (event) => {
      if (event.target === event.currentTarget)
        lpClose();
    });

    // 키보드 이벤트 핸들러 등록 (ESC 키로 모달 닫기)
    $(document).on("keydown.lp_keydown", function (event) {
      let keyType = event.keyCode || event.which;
      if (keyType === 27 && lp.hasClass("modal_on")) {
        lpClose();
      }
    });

    if (isBottomSheet) {
      // 하단 시트 모달일 경우 추가 처리
      lpObj.css("height", "auto"); // 초기에 높이를 'auto'로 설정
      initialHeight = lpObj.outerHeight(); // 초기 높이 저장

      const halfHeight = $(window).height() * 0.5; // 50%의 높이값
      const targetHeight = initialHeight >= $(window).height() * 0.5 ? halfHeight : initialHeight; // 높이가 50% 이하면 팝업높이 그대로 나오고 50% 이상이면 50%로 나온다

      const listObj = lpObj.find('ul.pop_list'); // 팝업 내부 리스트
      const listHeight = lpObj.find('ul li:first-child').outerHeight() || 0; // 팝업 내부 리스트 첫번째 요소의 높이값
      const handleHeight = lpObj.find('.drag_handle').outerHeight() || 0; // 팝업 핸들의 높이값
      const headHeight = lpObj.find('.popup_header').outerHeight() || 0; // 팝업 헤더의 높이값
      const btnHeight = lpObj.find('.btn_wrap').outerHeight() || 0; // 팝업 버튼영역 높이값
      const popHeight = listHeight + handleHeight + btnHeight + headHeight + 12; // 팝업의 리스트 한개 있을때 팝업의 높이 


      // 현재 모달을 제외한 형제 모달들 닫기
      lp.siblings('.bottom_sheet').each(function () {
        const siblingModal = $(this);
        const siblingModalobj = siblingModal.find('.popup_inner');

        // 모달 닫기 애니메이션 수행
        siblingModalobj.stop().animate({
          height: "0%"
        }, 200, () => {
          siblingModal.removeClass("modal_on fullscreen");
          siblingModalobj.css("height", "");
        });
        // 잠시 후에 클래스 제거 (애니메이션이 완전히 끝난 후 실행)
        setTimeout(function () {
          siblingModal.removeClass("modal_on fullscreen");
        }, 200);
      });

      // 모달 열기 동작 애니메이션 수행
      lpObj.css({
        top: "5%",
        opacity: '0',
      }).stop().animate({
        height: targetHeight
      }, 200).animate({
        top: "0",
        opacity: '1'
      }, 100);

      //syncObj 모달과 같은 높이값 설정
      syncObj.delay(100).animate({
        bottom: targetHeight
      }, 200);

      // 드래그 이벤트 핸들러 등록
      lpObjHandle.on("mousedown touchstart", (e) => {
        isDragging = true;
        startEvent = e.type === "mousedown" ? e : e.touches[0];
        initialHeight = lpObj.outerHeight();

        // 드래그 중인 동안 이벤트 등록
        $(document).on("mousemove touchmove", (e) => {
          handleDrag(e, lpObj);
        });

        // 드래그 종료 이벤트 등록
        // 드래그 종료 이벤트 등록
        $(document).on("mouseup touchend", (e) => {
          $(document).off("mousemove touchmove mouseup touchend");
          let finalHeight = lpObj.outerHeight(); // 드래그 종료시점 높이값 객체
          let clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);
          let deltaY = clientY - startEvent.clientY;
          let dragDirection = deltaY > 0 ? 'down' : 'up'; // 드래그 방향 판단

          if (isDragging) {
            if (dragDirection === 'down') {
              const shouldClose = listObj.length > 0 ? finalHeight <= popHeight : finalHeight <= targetHeight;

              if (shouldClose) {
                lpClose();
              } else if (finalHeight <= halfHeight) {
                const target = listObj.length > 0 ? popHeight : targetHeight;
                animateHeight(target);
              } else {
                animateHeight(halfHeight);
              }
              lp.removeClass('fullscreen');
            } else {
              if (finalHeight > halfHeight) {
                animateHeight("100%");
                syncObj.stop().animate({
                  bottom: "calc(75% - 80px);"
                }, 200);
                lp.addClass('fullscreen');
              } else {
                animateHeight(halfHeight);
              }
            }
            isDragging = false;
          }

          function animateHeight(heightValue) {
            lpObj.stop().animate({
              height: heightValue
            }, 200);
            syncObj.stop().animate({
              bottom: heightValue
            }, 200);
          }
          return false;
        });
        return false;
      });

      // 터치 기기에서 드래그 중일 때 스크롤 방지
      lpObj.on("touchmove", (e) => {
        if (isDragging && lpObj.outerHeight() >= $(window).height()) {
          handleDrag(e.touches[0], lpObj);
        }
      });
    } else {
      // bottom_sheet가 아닌 일반 모달 팝업 오픈 동작 정의
      lpObj.css({
        top: "55%",
        opacity: '0',
      }).animate({
        top: "50%",
        opacity: '1'
      }, 200);
    }
  }

  $lp_open.on("click", openModal);










  // e: 모달팝업
  // ========================================================================== //

  // toggle_list
  // $(".toggle_list > li button").on("click", function () {
  //   $(this).closest("li").find(".con").stop().slideToggle(200).toggleClass("on");
  //   $(this).closest("li").toggleClass("on");
  // });

  // 박스형 checked 감지
  // checkbox
  // $(".box .check_item input:checkbox").on("click", function () {
  //   let checked = $(this).prop("checked");
  //   if (checked) {
  //     $(this).closest(".box").addClass("selected");
  //   } else {
  //     $(this).closest(".box").removeClass("selected");
  //   }
  // });

  //radio
  // $(".box .check_item input:radio").change(function () {
  //   $(".box .check_item input:radio").each(function () {
  //     let checked = $(this).prop("checked");
  //     if (checked) {
  //       $(this).closest(".box").addClass("selected");
  //     } else {
  //       $(this).closest(".box").removeClass("selected");
  //     }
  //   });
  // });



});