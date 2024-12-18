/* 
	본 JS는 퍼블리싱 편의를 위해 
	Git 이미지 리소스 경로 맞추는 목적으로 작성된 문서입니다.
	Back-End 개발시 이 파일을 반드시 삭제해 주세요 :)
*/

// PMS URL 체크
var previewDomain = 'pms.inseq.co.kr';
var srcRoot = '/_res/yuhs/';
if (window.location.hostname == previewDomain && window.location.pathname.split('/')[4].length > 0) {
	var branch = window.location.pathname.split('/')[4];
	console.log("%cPMS상에서 미리보기시 이미지가 상대경로 강제치환처리되어 404 (Not Found) 오류가 뜰 수 있습니다. 이미지가 잘 노출되고 있음에도 오류가 뜨는 경우 개발 적용시 사라질 오류이니 무시해 주세요. 로컬서버에서 확인했을 때 오류 없으면 됩니다.\n- leroro@inseq.co.kr", "color:blue;");
	console.log('branch : ' + branch);
}

// 이미지 상대경로로 변경 : git 이미지 링크 깨짐현상 조치
gitPath();

function gitPath() {
	if (window.location.hostname == previewDomain) {
		$('img').each(function () {
			var src = $(this).attr('src');
			if (src.substring(0, 11) == srcRoot) {
				src = '../..' + src;
			}
			$(this).attr('src', src);
		});

		// 인라인 스타일 배경이미지 상대경로로 치환
		$('[style*="background-image"]').each(function () {
			var bgUrl = $(this).attr('style');
			bgUrl = replaceAll(bgUrl, "background-image: url('/", "background-image: url('../../")
			$(this).attr('style', bgUrl);
		});

		$('[style*="background-image"]').each(function () {
			var bgUrl = $(this).attr('style');
			bgUrl = replaceAll(bgUrl, "background-image: url(\"/", "background-image: url(\"../../")
			$(this).attr('style', bgUrl);
		});

		// HTML 내 스타일시트 정의 배경이미지 상대경로로 치환
		$('style').each(function () {
			var style = $(this).text();
			style = replaceAll(style, "url('/_res/", "url('../../_res/");
			$(this).text(style);
		});
	}
}

function replaceAll(str, searchStr, replaceStr) {
	return str.split(searchStr).join(replaceStr);
}