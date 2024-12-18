// common.js : 필수 스크립트 정의

$(function () {
  // 메인헤더 스크롤 작업
  let lastScrollTop = 0;
  let $scroll_area = $('.main_wrapper .container');
  let navbar = $(".main_header");
  let navbarHeight = navbar.outerHeight();

  $scroll_area.scroll(function () {
    let currentScroll = $(this).scrollTop();
    if (currentScroll > lastScrollTop) {
      // 아래로 스크롤
      if (currentScroll > navbarHeight) {
        navbar.stop().animate({
          top: -navbarHeight
        }, 200);
      }
    } else {
      // 위로 스크롤
      navbar.stop().animate({
        top: 0
      }, 200);
    }
    lastScrollTop = currentScroll;
  });

  $(".main_fixed_popup .pop_close").on("click", function () {
    $(this).closest('.main_fixed_popup').css('display', 'none');
    // s:240304 추가
    $('.wrapper').removeClass('has_fixed_pop');
  });

  // 버튼영역 유무 판단 s:240220 bottom_fix 위치이동으로 wrapper에 pd_btm 클래스 적용
  if ($(".bottom_fix").length) {
    $(".wrapper").addClass("pd_btm");
  }

  if ($(".bottom_fix.type2").length) {
    $(".wrapper").addClass("type2");
  }

  if ($(".main_fixed_popup").length) {
    $(".main_wrapper").addClass("has_fixed_pop");
  }

  // s:240304 추가
  if ($(".pop_alert").length) {
    $(".side_pop").addClass("has_pop_alert");
  }

  // s:240306 floating_sheet 고정 스크립트 추가
  function sheet_fixed() {
    var contentHeight = $('.container').outerHeight();
    var floatingHeight = $('.floating_sheet').outerHeight();
    var sectionsHeight = 0;

    $('.section').each(function () {
      sectionsHeight += $(this).outerHeight(true);
    });

    if (sectionsHeight + floatingHeight < contentHeight) {
      $('.floating_sheet').addClass('fixed');
    } else {
      $('.floating_sheet').removeClass('fixed');
    }
  }
  if ($(".floating_sheet").length) {
    setTimeout(function () {
      sheet_fixed();
      $(window).on('scroll resize', sheet_fixed);
    }, 200);
  }
  // e:240306 floating_sheet 고정 스크립트 추가



  //s:퍼블페이지 에서는 ui_layout_setting.js의 코드를 사용함
  // 메뉴 열기
  $(".menu").on("click", function () {
    $('.allMenu_wrap').addClass('on');
  });
  // 메뉴 닫기
  $(".allMenu_wrap .close").on("click", function () {
    $('.allMenu_wrap').removeClass('on');
  });
  //e:퍼블페이지 에서는 ui_layout_setting.js의 코드를 사용함

  // ========================================================================== //
  // s: 모달팝업
  let isDragging = false; // 드래그 중인지 여부를 나타내는 플래그
  let startEvent; // 드래그 시작 이벤트
  let initialHeight; // 모달 높이의 초기값
  let tabDisable; // 탭 비활성 여부를 나타내는 플래그
  let $lp_open = $(".open-lp"); // 모달을 여는 요소에 대한 객체

  function handleDragUp(event, lpObj) {
    let clientY = event.clientY || event.touches[0].clientY;
    let deltaY = clientY - startEvent.clientY;
    let newHeight = Math.max(0, initialHeight - deltaY);
    lpObj.css("height", `${(newHeight / $(window).height()) * 100}%`);

  }

  window.openModal = function (op, modalId) {
    // function openModal(op, modalId) {
    const lp = $("#" + modalId); // 연결된 모달에 대한 객체
    const lpObj = lp.children(".popup_inner"); // 모달 내부의 콘텐츠에 대한 객체    
    const isBottomSheet = lp.hasClass("bottom_sheet"); // 모달이 bottom_sheet인지 여부
    const lpObjHandle = lp.find(".drag_handle"); // 바텀 모달 높이조절 핸들 객체
    const lpObjClose = lp.find(".btn_close_popup, .pop_close"); // 모달 내부 닫기 버튼에 대한 객체   
    const lpObjTabbable = lpObj.find("button, input:not([type='hidden']), select, iframe, textarea, [href], [tabindex]:not([tabindex='-1'])"); // 탭 가능한 모든 요소에 대한 객체
    // const lpObjTabbable = lp.children(".popup_inner"); // 탭 가능한 모든 요소에 대한 객체
    const lpOuterObjHidden = $(".wrapper, .header, .footer"); // 모달 외부의 숨겨진 요소에 대한 객체    
    const lp_close = $(".map_area"); // 모달 외부 닫기 버튼에 대한 객체
    const syncObj = $(".gis_bottom"); // 모달 외부 위치 싱크 영역에 대한 객체

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
          // }, 200, closeModalAnimation);
        }, 0, closeModalAnimation);
        syncObj.animate({
          bottom: "0"
        }, 0); // s:240110 반복이벤트시 이벤트 겹침으로 인한 오류로 인해 animate 시간을 200-> 0으로 수정함        
      } else {
        // 일반 모달 닫기 처리
        // setTimeout(() => lp.removeClass("modal_on"), 100);       
        // lpObj.animate({
        //   top: "0",
        //   opacity: '0'
        // }, 100, () => {
        //   lpObj.css({
        //     top: "2%",
        //     opacity: '1'
        //   });
        // });
        lp.removeClass("modal_on");
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
      if (!$(e.target).hasClass("open-lp")) {
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
      lpObj.css("height", "auto").attr('tabindex', '0').focus(); // 초기에 높이를 'auto'로 설정
      initialHeight = lpObj.outerHeight(); // 초기 높이 저장

      const halfHeight = $(window).height() * 0.5; // 50%의 높이값
      const threequaterHeight = $(window).height() * 0.75; // 75%의 높이값
      // const maxHeight = $(window).height() - 175; // max의 높이값
      const maxHeight = $(window).height() * 0.75 - 50; // max의 높이값
      const targetHeight = initialHeight >= threequaterHeight ? maxHeight : initialHeight; // 높이가 75% 이하면 팝업높이 그대로 나오고 75% 이상이면 75%로 나온다

      const listObj = lpObj.find('ul.line_list'); // 팝업 내부 리스트
      const listHeight = lpObj.find('ul.line_list li:first-child').outerHeight() || 0; // 팝업 내부 리스트 첫번째 요소의 높이값
      const handleHeight = lpObj.find('.drag_handle').outerHeight() || 0; // 팝업 핸들의 높이값
      const headHeight = lpObj.find('.popup_header').outerHeight() || 0; // 팝업 헤더의 높이값
      const btnHeight = lpObj.find('.btn_wrap').outerHeight() || 0; // 팝업 버튼영역 높이값
      const popHeight = listHeight + handleHeight + btnHeight + headHeight; // 팝업의 리스트 한개 있을때 팝업의 높이 


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
          handleDragUp(e, lpObj);
        });

        // 드래그 종료 이벤트 등록
        $(document).on("mouseup touchend", (e) => {
          $(document).off("mousemove touchmove mouseup touchend");
          let finalHeight = lpObj.outerHeight(); // 드래그 종료시점 높이값 객체
          let clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);
          let deltaY = clientY - startEvent.clientY;
          let dragDirection = deltaY > 0 ? 'down' : 'up'; // 드래그 방향 판단
          console.log('dragDirection = ' + dragDirection);
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
            } else {
              if (finalHeight > halfHeight) {
                animateHeight(maxHeight);
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
          handleDragUp(e.touches[0], lpObj);
        }
      });
    } else {
      // bottom_sheet가 아닌 일반 모달 팝업 오픈 동작 정의
      lpObj.css({
        top: "52%",
        opacity: '0',
      }).attr('tabindex', '0').focus().animate({
        top: "50%",
        opacity: '1'
      }, 200);
    }

    // s:240219 opt에 단일 선택시 문자가 길어질 경우 ellipsis 처리
    lp.find(".optionList li a, .optionList li input[type='radio']").on("click", function () {
      if ($(this).is('a')) {
        // 클릭된 요소가 <a> 태그인 경우
        var selectedOption = $(this).text();
        var opText = '<span class="ellipsis">' + selectedOption + '</span>';
        op.html(opText).addClass('color_default').removeClass('color_gray2');
        $(this).closest('li').addClass('selected').siblings().removeClass('selected');
        setTimeout(function () {
          lpClose();
        }, 100);
      } else if ($(this).is('input[type="radio"]')) {
        // 클릭된 요소가 라디오 버튼인 경우
        var selectedRadio = $(this).siblings('label').text();
        var opText = '<span class="ellipsis">' + selectedRadio + '</span>';
        op.html(opText).addClass('color_default').removeClass('color_gray2');
        lpClose();
      }

    });

    // console.log('openModal 함수가 실행되었습니다.');
  }
  window.openModalAuto = function (modalId) {
    // function openModalAuto(modalId) {
    const op = $(".open-lp"); // 클릭한 요소에 대한 객체
    openModal(op, modalId);
    console.log('자동');
  }

  $lp_open.on("click", function (event) {
    const op = $(event.currentTarget); // 클릭한 요소에 대한 객체
    const modalId = op.attr("aria-controls");
    openModal(op, modalId);
    console.log('클릭' + modalId);
  });



  // e: 모달팝업
  // ========================================================================== //

  // ========================================================================== //
  // s:사이드팝
  let isDraggingSide = false;
  let startEventSide;
  let startX;
  let startY;
  let initialLeft;
  let $side_pop = $(".side_pop");
  let $side_handle = $side_pop.find(".side_handle");
  let $side_section = $side_pop.find(".side_section");
  let $side_dimed = $side_pop.find(".dimed");
  let $side_close = $side_pop.find(".side_pop_close");


  function handleDragSide(event) {
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;
    const deltaX = clientX - startEventSide.clientX;
    const deltaY = clientY - startEventSide.clientY;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }

    // 드래그 방향 판단
    const direction = deltaX > 0 ? "right" : "left";
    // console.log("Drag Direction:", direction);

    if (direction === "left") {
      const newLeft = Math.max(0, Math.min($(window).width(), initialLeft + deltaX));
      $side_pop.css("left", `${newLeft}px`);
    }

  }

  function endDragSide() {
    if (isDraggingSide) {
      isDraggingSide = false;
      $(document).off("mousemove touchmove mouseup touchend");

      const currentLeft = $side_pop.position().left;
      const showLeft = currentLeft < initialLeft ? 0 : '100%';

      $side_pop.toggleClass("show", currentLeft < initialLeft).css('left', showLeft);

    }
  }

  function toggleSidePop() {
    const isShowing = $side_pop.hasClass("show");
    $side_pop.toggleClass("show", !isShowing).css('left', isShowing ? '100%' : '0');
  }

  $side_handle.on("mousedown touchstart", function (e) {
    isDraggingSide = true;
    startEventSide = e.type === "mousedown" ? e : e.touches[0];
    initialLeft = $side_pop.css("left") === "auto" ? 0 : parseInt($side_pop.css("left"));
    startX = startEventSide.clientX;
    startY = startEventSide.clientY;

    $(document).on("mousemove touchmove", handleDragSide);
    $(document).on("mouseup touchend", endDragSide);

  });

  $side_section.on("mousedown touchstart", function (e) {

    // side_section에서의 터치/마우스 다운 이벤트 처리
    startEventSide = e.type === "mousedown" ? e : e.touches[0];
    initialLeft = $side_pop.css("left") === "auto" ? 0 : parseInt($side_pop.css("left"));
    startX = startEventSide.clientX;
    startY = startEventSide.clientY;

  });

  $side_section.on("mouseup touchend", function (e) {
    // side_section에서의 터치/마우스 업 이벤트 처리
    const endX = e.clientX || e.changedTouches[0].clientX;
    const endY = e.clientY || e.changedTouches[0].clientY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;

    // 상하로의 이동이 수평 이동보다 크면 드래그를 허용하지 않음
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }

    if (endX > startX) {
      // 오른쪽으로 드래그한 경우 사이드팝 열린 상태에서 닫기
      // s:240304 수정
      // $side_pop.removeClass('show').css('left', '100%');
      closeSidePop()
    }
  });

  $side_pop.on("touchmove", function (e) {
    if (isDraggingSide) {
      e.preventDefault();
    }
  });
  // s:240304 수정
  function closeSidePop() {
    $side_pop.removeClass('show').css('left', '100%');
    $side_handle.removeClass('handling');
    setTimeout(function () {
      $('.side_handle').addClass('handling');
    }, 500);
  }

  $side_handle.on("click", toggleSidePop);

  $side_dimed.on("click", function () {
    closeSidePop();
  });

  $side_close.on("click", function () {
    closeSidePop();
  });



  // e: 사이드팝업
  // ========================================================================== //

  // dimed 
  $('.open_dimed').click(function () {
    $('.dimed').addClass('on');
  });
  $('.dimed .close').click(function () {
    $(this).closest('.dimed').removeClass('on');
  });

  // floating_sheet
  $('.floating_sheet .btn_close_popup,.floating_sheet .pop_close').click(function () {
    $(this).closest('.floating_sheet').css('display', 'none');
  });

  // 박스형 checked 감지
  // checkbox
  $(".check_list li .check_item input:checkbox").on("click", function () {
    let checked = $(this).prop("checked");
    if (checked) {
      $(this).closest("li").addClass("selected");
    } else {
      $(this).closest("li").removeClass("selected");
    }
  });

  //radio
  $(".check_list li .check_item input:radio").change(function () {
    $(".check_list li .check_item input:radio").each(function () {
      let checked = $(this).prop("checked");
      if (checked) {
        $(this).closest("li").addClass("selected");
      } else {
        $(this).closest("li").removeClass("selected");
      }
    });
  });
  $('.select_btn .btn').on("click", function () {
    $(this).toggleClass("selected").siblings().removeClass('selected');
  });


  //아코디언
  $(document).on("click", ".accordion .acc_head a, summary", function () {
    let $ac_wrap = $(this).closest("li, details");
    $ac_wrap.toggleClass("open").siblings().removeClass('open').removeAttr('open');
  });

  // 토글박스
  $(document).on("click", ".toggle_box .box_head a", function () {
    let $toggle_box = $(this).closest(".toggle_box");
    $toggle_box.toggleClass("open");

  });

  // 탭메뉴 선택
  // let defTab = $(".tab_menu li:first-child a"),
  //   defCon = defTab.attr("data-tab");
  // $(defTab).addClass("current");
  // $("#" + defCon).addClass("on");

  $(".tab_menu li a").click(function () {
    let activeTab = $(this).attr("data-tab");
    $(".tab_menu li a").removeClass("current");
    $(".tab_con").removeClass("on");
    $(this).addClass("current");
    $("#" + activeTab).addClass("on");
  });

  // 카테고리 활성화
  let $cate_btn = $('.cate_list').find('button');
  $cate_btn.on("click", function () {
    $(this).closest('div').addClass('active').siblings().removeClass('active');
  });

  let $sch_cate = $('.sch_cate').find('button');
  $sch_cate.on("click", function () {
    $(this).closest('li').addClass('selected').siblings().removeClass('selected');
  });

  // 은행, 카드 등록 선택 활성화
  $('.brand_collect, .card_collect').find('a').on("click", function () {
    $(this).closest('li').addClass('active').siblings().removeClass('active');
  });

  // 폼그룹 포커스요소 시각적 활성화
  $('.form_group input:not([readonly]), .form_group button').blur(function () {
    $(this).closest('.form_group').removeClass("has");
  }).focus(function () {
    $(this).closest('.form_group').addClass("has");
  });

  // 폼그룹 disabled 속성 일때
  $('.form_group input, .form_group .opt').on('change', function () {
    // input 요소의 disabled 상태 확인
    const isDisabled = $(this).prop('disabled');

    // 부모 요소인 form_group에 disabled 클래스 추가/제거
    $(this).closest('.form_group').toggleClass('disabled', isDisabled);
  });

  // 페이지 로드 후 초기 상태에 따라 disabled 클래스 추가/제거
  $('.form_group input, .form_group .opt').each(function () {
    const isDisabled = $(this).prop('disabled');
    $(this).closest('.form_group').toggleClass('disabled', isDisabled);
  });

  // 검색 폼 valid 체크 클래스 토글
  // s:240223 valid 체크 폼 그룹 전체 적용
  $(".form_group input").change(function () {
    var isVal = $(this).val();
    var $formGroup = $(this).closest('.form_group');

    if (!isVal) {
      $formGroup.removeClass("valid");
      console.log('not_valid');
    } else {
      $formGroup.addClass("valid");
      console.log('valid');
    }
  });

  //s:240305 placeholder 대체 백그라운드 valid 작업
  $(".form_group .regis_num div input").change(function () {
    var isVal = $(this).val();
    var $wrap_div = $(this).closest('div');

    if (!isVal) {
      $wrap_div.removeClass("valid");
      console.log('not_valid');
    } else {
      $wrap_div.addClass("valid");
      console.log('valid');
    }
  });


  $(".form_group.date input[type='date']").change(function () {
    var isVal = $(this).val();

    if (!isVal) {
      $(this).removeClass("valid");
      console.log('not_valid');
    } else {
      $(this).addClass("valid");
      console.log('valid');
    }
  });

  let $gis_btn = $('.gis_store_datails').find('.gis_btn');
  let $dt_box_height = $('.gis_store_datails').find('.store_details_box').outerHeight() + 30;
  $gis_btn.css('bottom', $dt_box_height);


  // =====================퍼블 전용=================================//
  // input type="number" 대신 text로 쓰면서 숫자만 받고 세자리에 ',' 찍는 스크립트

  $('.tf_num').on('input', function () {
    var inputValue = $(this).val();
    inputValue = inputValue.replace(/[^0-9]/g, '');
    if ($(this).hasClass('tf_money')) {
      inputValue = Number(inputValue).toLocaleString('en-US');
    }
    $(this).val(inputValue);
  });

  $('.txtArea_wrap textarea').keyup(function () {
    const characterCount = $(this).val().length;
    const count = $(this).closest('.txtArea_wrap').find('.txtArea_count');
    const current = count.find('.current');
    current.text(characterCount);
  });

});