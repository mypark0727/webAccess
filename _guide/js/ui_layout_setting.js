/* 
	본 JS는 퍼블리싱 편의를 위해 
	중복되는 공통 레이아웃 영역을 로드할 목적으로 작성된 문서입니다.
	서버 언어로 레이아웃을 구성하게되면 오류를 유발하는 코드이오니
	Back-End 개발시 이 파일을 반드시 삭제해 주세요 :)
*/

$(function () {
	// var previewDomain = 'pms.inseq.co.kr';
	// var pathDepth = window.location.pathname.split('/').length;
	// var siteCode = window.location.pathname.split('/')[pathDepth - 3];
	// // var srcRoot = '/resources/';
	// if (window.location.hostname == previewDomain && window.location.pathname.split('/')[2].length > 0) {
	// 	var branch = window.location.pathname.split('/')[2];
	// 	// console.log("%cPMS상에서 미리보기시 이미지가 상대경로 강제치환처리되어 404 (Not Found) 오류가 뜰 수 있습니다. 이미지가 잘 노출되고 있음에도 오류가 뜨는 경우 개발 적용시 사라질 오류이니 무시해 주세요. 로컬서버에서 확인했을 때 오류 없으면 됩니다.\n- leroro@inseq.co.kr", "color:blue;");
	// 	console.log('branch : ' + branch);
	// } else {
	// 	console.log('local');
	// }

	var path = window.location.pathname.split('/');
	var siteCode = path[path.indexOf('html') + 1];
	console.log(siteCode);

	$('.header').load('/html/' + siteCode + '/_inc-header.html .header > *', function () {
		// if ($.isFunction(window.gnbSetting)) gnbSetting();
	});
	$('.breadcrumb').load('/html/' + siteCode + '/_inc-breadcrumb.html .breadcrumb > *', function () {
		// if ($.isFunction(window.scrollbar)) scrollbar();
	});
	$('.footer').load('/html/' + siteCode + '/_inc-footer.html .footer > *', function () {
		// if ($.isFunction(window.toTop)) toTop();
	});
});