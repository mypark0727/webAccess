/* 
	본 JS는 퍼블리싱 편의를 위해 
	중복되는 공통 레이아웃 영역을 로드할 목적으로 작성된 문서입니다.
	서버 언어로 레이아웃을 구성하게되면 오류를 유발하는 코드이오니
	Back-End 개발시 이 파일을 반드시 삭제해 주세요 :)
*/

$(function () {
	// 헤더로드
	$(".header").load("../_inc-header.html .header > *", function () {
		let pageTitle = $(document).find("title").text();
		$(".header h2").text(pageTitle);
	});

	// 푸터로드
	$(".footer").load("../_inc-footer.html .footer > *", function () {

	});


});